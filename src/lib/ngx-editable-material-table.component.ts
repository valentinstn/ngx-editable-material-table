import {
  Component,
  ViewChild,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  Inject,
  AfterViewInit,
  Output, OnDestroy, OnInit
} from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { fromEvent, Subject, Subscription, takeUntil, throttleTime } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NgxEditableMaterialTableStore } from './ngx-editable-material-table.store';
import { EmtConfig, EmtData, EmtDataChange } from './public-types';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngx-editable-material-table',
  templateUrl: 'ngx-editable-material-table.component.html',
  styleUrls: ['./ngx-editable-material-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [NgxEditableMaterialTableStore],
  imports: [CommonModule, MatTableModule]
})
export class NgxEditableMaterialTableComponent implements OnInit, AfterViewInit, OnDestroy {
  // General Material table inputs
  @Input() data: EmtData[] = [];
  @Input() displayedColumns: string[] = [];

  // Emt inputs
  @Input() config: EmtConfig = {};

  // Emits when the table data changes
  @Output() dataChanged = new EventEmitter<EmtDataChange>();

  // The material table
  @ViewChild('editableTable') editableTable: ElementRef<MatTable<unknown>> | undefined;

  private readonly store = new NgxEditableMaterialTableStore();
  private readonly stopMouseMoveSub$ = new Subject<void>();
  private readonly componentSubscriptions: Subscription[] = []

  public readonly columnsConfig$ = this.store.validatedColumnsConfig$;

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.document.addEventListener('click', (event: MouseEvent) => {
      if (event.target !== this.store.selectedCell) {
        this.store.acceptSelectedElementChanges();
      }
    });

    this.document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.reset();
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        this.store.deleteContentOfHighlightedCells();
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        this.store.highlightedElementsToClipboard();
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        this.store.pasteFromClipboard();
        event.preventDefault();
      }
    });

    const tableDataChangeSub = this.store.tableDataChange$.subscribe(
      (tableDataChange) => this.dataChanged.emit(tableDataChange)
    )
    this.componentSubscriptions = [
      tableDataChangeSub
    ]
  }

  ngOnInit() {
    this.store.initConfig(this.config, this.displayedColumns);
  }

  ngAfterViewInit() {
    this.store.initCellHandlers(this.elementRef);
  }

  ngOnDestroy() {
    for (const sub of this.componentSubscriptions) {
      sub.unsubscribe();
    }
  }

  // Activate a cell by click
  public activateCell(event: MouseEvent): void {
    // Ensure, microtasks are executed first (e.g. accepting previous changes), and only
    // afterwords, this cell is selected.
    setTimeout(
      () => this.store.selectCell(event.target as HTMLElement)
    );
  }

  // Highlight column
  public highlightColumn(column: string): void {
    this.store.highlightColumn(column);
  }

  // This function is executed after each keypress while editing a table cell
  public cellEditKeyPress(
    event: KeyboardEvent
  ) {
    this.store.cellEditKeyPress(event);
  }

  // Mouse select
  public activateMouseSelection(): void {
    // Reset existing highlighted/selected cells
    this.store.unselectCells();

    let originalMouseEvent: MouseEvent;
    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousemove').pipe(
      throttleTime(50),
      takeUntil(this.stopMouseMoveSub$)
    ).subscribe((currentMouseEvent) => {
      if (originalMouseEvent === undefined) {
        originalMouseEvent = currentMouseEvent;
      }
      this.store.highlightCellsWithMouse(
        originalMouseEvent,
        currentMouseEvent
      );
    })
  }

  // Mouse unselect
  public deactivateMouseSelection(): void {
    this.stopMouseMoveSub$.next();
  }

  // Reset any current selection
  public reset(): void {
    this.deactivateMouseSelection();
    this.store.unHighlightCells();
  }
}
