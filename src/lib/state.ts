import { ElementRef } from '@angular/core';
import {
  deleteCellContent, highlightCells,
  highlightCellsWithMouse,
  selectCell,
  unHighlightCells,
  unselectCell
} from './libs/selection-utils';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { EmtConfig, EmtDataChange } from './public-types';
import { getCellFromLocation, getLocationFromCell } from './libs/cell-utils';
import { getDefaultColumnConfig } from './libs/column-utils';
import { CellLocation, ColumnConfig, ColumnsConfig } from './internal-types';
import { prepareChangedData, prepareDeletedData } from './libs/change-generators';
import { copyTableCellsToClipboard, pastedTableToData } from './libs/clipboard';


export class AppState {
  // All the cells of the table
  allCells: HTMLElement[] = [];
  // The currently highlighted cells
  highlightedCells: HTMLElement[] = [];
  // The currently selected cell
  selectedCell: HTMLElement | undefined;
  // The original data of the unmodified cell
  selectedCellOriginalData = '';

  private _tableDataChange$ = new Subject<EmtDataChange>();
  public tableDataChange$: Observable<EmtDataChange> = this._tableDataChange$.pipe(
    tap((changes) => {
      if (this.config.afterChanged) {
        this.config.afterChanged(changes);
      }
    })
  );

  private _validatedColumnsConfig$ = new BehaviorSubject<ColumnsConfig | undefined>(undefined);
  public validatedColumnsConfig$: Observable<ColumnsConfig  | undefined> = this._validatedColumnsConfig$;
  private _config: EmtConfig = {};

  public initConfig(
    emtConfig: EmtConfig,
    displayedColumns: string[]
  ): void {
    const validatedColumnsConfig: ColumnsConfig = {};
    for (const column of displayedColumns) {
      const config = getDefaultColumnConfig(column);
      validatedColumnsConfig[column] = Object.assign(config, (emtConfig?.columns ?? {})[column]);
    }
    this.config = Object.assign(
      emtConfig,
      {
        columns: validatedColumnsConfig
      } as EmtConfig
    );
  }

  set config(config: EmtConfig) {
    this._config = config;
    this._validatedColumnsConfig$.next(config.columns);
  }

  get config(): EmtConfig {
    return this._config;
  }

  public initCellHandlers(componentElementRef: ElementRef): void {
    this.allCells = Array.from(componentElementRef.nativeElement.querySelectorAll('td.emt-cell'));
  }

  private getColumnConfig(column: string): ColumnConfig {
    if (!this.config.columns || !this.config.columns[column]) {
      throw Error(`Invalid column: ${column}`);
    }
    return this.config.columns[column] as ColumnConfig;
  }

  public selectElement(el: HTMLElement): void {
    unselectCell(this.selectedCell);
    unHighlightCells(this.highlightedCells);

    const location = getLocationFromCell(el)
    if (this.getColumnConfig(location.column).editable) {
      this.selectedCell = el;
      this.selectedCellOriginalData = el.innerHTML.trim();

      selectCell(el);
    }
  }

  public cellEditKeyPress(
    event: KeyboardEvent
  ): void {
    if (event.key === 'Enter') {
      this.acceptSelectedElementChanges( );
    } else if (event.key === 'Escape') {
      this.rejectSelectedElementChanges();
    }
  }

  public highlightCellsWithMouse(
    originalMouseEvent: MouseEvent,
    currentMouseEvent: MouseEvent
  ): void {
    this.unHighlightCells();
    this.highlightedCells = highlightCellsWithMouse(
      originalMouseEvent,
      currentMouseEvent,
      this.allCells
    );
  }

  public highlightColumn(
    column: string
  ): void {
    this.unHighlightCells();
    const cellsInColumn = this.allCells.filter(c => getLocationFromCell(c).column === column);
    this.highlightedCells = highlightCells(cellsInColumn)
  }

  public unHighlightCells(): void {
    unHighlightCells(this.highlightedCells);
    this.highlightedCells = [];
  }

  public deleteContentOfHighlightedCells(): void {
    const changes = prepareDeletedData(this.getHighlightedElementLocations());
    this.applyChanges(changes);
  }

  public acceptSelectedElementChanges(): void {
    const newValue = this.selectedCell?.innerHTML?.trim() as string;

    // If the cell data changed, emit a new value
    if (this.selectedCell && newValue !== this.selectedCellOriginalData) {
      const location = this.getSelectedElementLocation();
      const changes = prepareChangedData([{
        location: location,
        oldValue: this.selectedCellOriginalData,
        value: newValue
      }]);
      this.applyChanges(changes);
    }
  }

  private applyChanges(rawChanges: EmtDataChange): void {
    // Apply beforeChange callback
    const changes = this.config?.beforeChange ? this.config.beforeChange(
      structuredClone(rawChanges)
    ) : rawChanges;
    if (changes === null) {
      // The beforeChange callback can reject the changes by returning null
      this.rejectSelectedElementChanges();
      return;
    }

    // Support multiple updated fields
    for (const cellDataChange of changes.updated) {
      if (!this.getColumnConfig(cellDataChange.location.column).editable) {
        continue;
      }

      const cell = getCellFromLocation(cellDataChange.location, this.allCells);
      if (cell) {
        cell.innerHTML = cellDataChange.value;
      }
    }

    if (changes.deleted.length) {
      const cellsToDeleteIds = changes.deleted.map(l => l.id);
      deleteCellContent(
        this.highlightedCells.filter(
          (c) => {
            const location = getLocationFromCell(c);
            return cellsToDeleteIds.includes(location.id) && this.getColumnConfig(location.column).editable
          }
        )
      );
    }

    this._tableDataChange$.next(structuredClone(changes));

    unselectCell(this.selectedCell);
    this.selectedCell = undefined;
    this.selectedCellOriginalData = '';

    this.unHighlightCells();
  }

  private rejectSelectedElementChanges(): void {
    if (this.selectedCell) {
      this.selectedCell.innerHTML = this.selectedCellOriginalData;
      this.selectedCellOriginalData = '';
    }
    unselectCell(this.selectedCell);
  }

  public unselectCells(): void {
    if (this.selectedCell) {
      unselectCell(this.selectedCell);
    }
  }

  public highlightedElementsToClipboard(): void {
    if (!this.highlightedCells?.length) {
      return;
    }
    copyTableCellsToClipboard(this.highlightedCells);
  }

  public pasteFromClipboard(): void {
    setTimeout(
      () => console.log(pastedTableToData(this.selectedCell?.children[0] as HTMLTableElement)),
    )
  }

  private getSelectedElementLocation(): CellLocation {
    return getLocationFromCell(this.selectedCell as HTMLElement);
  }

  private getHighlightedElementLocations(): CellLocation[] {
    return this.highlightedCells.map(
      (el) => getLocationFromCell(el)
    )
  }
}

