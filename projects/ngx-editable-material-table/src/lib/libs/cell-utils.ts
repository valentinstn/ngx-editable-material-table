import { CellLocation } from '../internal-types';

export function getLocationFromCell(el: HTMLElement): CellLocation {
  return {
    row: Number(el?.getAttribute('data-emt-y')),
    column: el?.getAttribute('data-emt-x') as string
  }
}

export function getCellFromLocation(location: CellLocation, cells: HTMLElement[]): HTMLElement | undefined {
  return cells.find((c) =>
    c.getAttribute('data-emt-y') === String(location.row) &&
    c.getAttribute('data-emt-x') === location.column
  )
}
