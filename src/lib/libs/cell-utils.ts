import { CellLocation } from '../internal-types';

export function getLocationFromCell(el: HTMLElement): CellLocation {
  const row = Number(el?.getAttribute('data-emt-y'));
  const column = el?.getAttribute('data-emt-x') as string;
  return {
    row: row,
    column: column,
    id: `${row}⨯${column}`
  }
}

export function getCellFromLocation(
  location: Pick<CellLocation, 'row' | 'column'>,
  cells: HTMLElement[]
): HTMLElement | undefined {
  return cells.find((c) =>
    c.getAttribute('data-emt-y') === String(location.row) &&
    c.getAttribute('data-emt-x') === location.column
  )
}
