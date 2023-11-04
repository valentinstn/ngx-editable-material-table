function stringFromCell(cell: HTMLElement): string {
  return cell.innerHTML?.trim();
}

export function copyTableCellsToClipboard(
  cells: HTMLElement[]
): void {
  const rows: string[] = [];
  let rowItems: string[] = [];
  let lastParentElement: HTMLElement | undefined = undefined;
  for (const el of cells) {
    if (
      lastParentElement !== undefined &&
      (el.parentElement as HTMLElement) !== lastParentElement
    ) {
      rows.push(rowItems.join('\t'));
      rowItems = [];
    }
    rowItems.push(stringFromCell(el));
    lastParentElement = el.parentElement as HTMLElement;
  }
  rows.push(rowItems.join('\t'));
  const text = rows.join('\n');
  navigator.clipboard.writeText(text).then(
    () => console.log(`Copied to clipboard\n${text}`),
    (err) => console.warn('Failing copy to clipboard', err)
  );
}

export function pastedTableToData(table: HTMLTableElement): unknown[] {
  // Initialize an array to store the table data
  const data = [];

  // Loop through the rows in the table
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const rowData = [];

    // Loop through the cells in each row
    for (let j = 0; j < row.cells.length; j++) {
      const cell = row.cells[j];
      rowData.push(cell.textContent);
    }

    // Add the row data to the main data array
    data.push(rowData);
  }

  // Output the parsed data (you can also do further processing or use this data as needed)
  return data;
}
