const SELECTED_CLASS = 'selected';
const HIGHLIGHT_CLASS = 'highlighted';
const TOP_CELL_CLASS = 'top-cell-class';
const BOTTOM_CELL_CLASS = 'bottom-cell-class';
const LEFT_CELL_CLASS = 'left-cell-class';
const RIGHT_CELL_CLASS = 'right-cell-class';
const INITIAL_SELECTION_CELL_CLASS = 'initial-selection-cell';

/**
 * Select the content of a html element which has the contenteditable attribute set
 */
export function selectDivContent(el: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

/**
 * Finds all HTML elements within a specified rectangle on the page.
 */
export function getElementsInRectangle(
  allCells: HTMLElement[],
  x1: number,
  y1: number,
  x2: number,
  y2: number
): HTMLElement[] {
  // Calculate the boundaries of the rectangle
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const maxX = Math.max(x1, x2);
  const maxY = Math.max(y1, y2);

  // Array to store the elements within the rectangle
  const cellsInRectangle: HTMLElement[] = [];

  // Iterate through all elements and check if they are within the rectangle
  for (const cell of allCells) {
    const rect = cell.getBoundingClientRect();

    // Check if the element's boundaries are within the rectangle
    if (
      rect.left < maxX &&
      rect.right > minX &&
      rect.top < maxY &&
      rect.bottom > minY
    ) {
      cellsInRectangle.push(cell);
    }
  }

  return cellsInRectangle;
}

export function getBorderCells(
  rectangleCells: HTMLElement[]
): {
  top: HTMLElement[],
  bottom: HTMLElement[],
  left: HTMLElement[],
  right: HTMLElement[]
} {
  const result = {
    top: [] as HTMLElement[],
    bottom: [] as HTMLElement[],
    left: [] as HTMLElement[],
    right: [] as HTMLElement[]
  };

  for (const cell of rectangleCells) {
    const rect = cell.getBoundingClientRect();

    if (rect.top === rect.bottom) {
      // Handle cells with no height (e.g., empty cells)
      continue;
    }

    if (rect.top === rectangleCells[0].getBoundingClientRect().top) {
      result.top.push(cell);
    }

    if (rect.bottom === rectangleCells[rectangleCells.length - 1].getBoundingClientRect().bottom) {
      result.bottom.push(cell);
    }

    if (rect.left === rectangleCells[0].getBoundingClientRect().left) {
      result.left.push(cell);
    }

    if (rect.right === rectangleCells[rectangleCells.length - 1].getBoundingClientRect().right) {
      result.right.push(cell);
    }
  }

  return result;
}


export function selectCell(el: HTMLElement): void {
  el.contentEditable = 'true';
  el.classList.add(SELECTED_CLASS);
  selectDivContent(el);
  el.focus();
}

export function unselectCell(el: HTMLElement | undefined): void {
  if (!el) {
    return;
  }

  el.contentEditable = 'false';
  el.classList.remove(SELECTED_CLASS);
  el.blur();
}

export function highlightCellsWithMouse(
  initialMouseEvent: MouseEvent,
  currentMouseEvent: MouseEvent,
  cells: HTMLElement[]
): HTMLElement[] {
  const cellsToHighlight = getElementsInRectangle(
    cells,
    initialMouseEvent.x,
    initialMouseEvent.y,
    currentMouseEvent.x,
    currentMouseEvent.y
  )

  highlightCells(cellsToHighlight);

  for (const cell of cellsToHighlight) {
    if (initialMouseEvent.target === cell) {
      cell.classList.add(INITIAL_SELECTION_CELL_CLASS);
    } else {
      cell.classList.remove(INITIAL_SELECTION_CELL_CLASS);
    }
  }

  return cellsToHighlight;
}

export function highlightCells(
  cells: HTMLElement[]
): HTMLElement[] {
  for (let i = 0; i < cells.length; i++) {
    if (cells.includes(cells[i] as HTMLElement)) {
      cells[i].classList.add(HIGHLIGHT_CLASS);
    } else {
      cells[i].classList.remove(HIGHLIGHT_CLASS);
    }
  }

  const borderCells = getBorderCells(cells);
  for (const cell of cells) {
    if (borderCells.top.includes(cell)) {
      cell.classList.add(TOP_CELL_CLASS);
    } else {
      cell.classList.remove(TOP_CELL_CLASS);
    }

    if (borderCells.bottom.includes(cell)) {
      cell.classList.add(BOTTOM_CELL_CLASS);
    } else {
      cell.classList.remove(BOTTOM_CELL_CLASS);
    }

    if (borderCells.left.includes(cell)) {
      cell.classList.add(LEFT_CELL_CLASS);
    } else {
      cell.classList.remove(LEFT_CELL_CLASS);
    }

    if (borderCells.right.includes(cell)) {
      cell.classList.add(RIGHT_CELL_CLASS);
    } else {
      cell.classList.remove(RIGHT_CELL_CLASS);
    }
  }

  return cells;
}

export function unHighlightCells(
  cells: HTMLElement[]
): void {
  for (const cell of cells) {
    cell.classList.remove(HIGHLIGHT_CLASS);
    cell.classList.remove(INITIAL_SELECTION_CELL_CLASS);
  }
}

export function deleteCellContent(
  cells: HTMLElement[]
): void {
  for (const cell of cells) {
    cell.innerHTML = '';
  }
}
