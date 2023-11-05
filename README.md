<h1 align="center">Editable Angular Material Table</h1>
<p align="center">
    <em>An editable table, built on top of Angular Material, natively for Angular.</em>
</p>

<p align="center">
    <a href="https://youtu.be/WKFSZJyR8qU">
        <img width="400px" src="https://github.com/valentinstn/ngx-editable-material-table/raw/main/table-screenshot.png">
    </a>
</p>

<p align="center">
  <a href="https://youtu.be/WKFSZJyR8qU">Demo</a>
</p>

## Requirements

`ngx-editable-material-table` depends on Angular and Angular Material 16+. 

## Installation

```
npm install ngx-editable-material-table
```

## Usage example

```ts
import { Component } from '@angular/core';
import { EmtConfig, EmtData, NgxEditableMaterialTableComponent } from 'ngx-editable-material-table';
import { CommonModule } from '@angular/common';

// Optional, static typing of column names
const columns = ['position', 'name', 'weight', 'symbol'] as const;
type ColumnName = typeof columns[number];

@Component({
  selector: 'app-root',
  template: `
    <ngx-editable-material-table
      [data]="data"
      [displayedColumns]="displayedColumns"
      [config]="config"
    ></ngx-editable-material-table>
  `,
  standalone: true,
  imports: [NgxEditableMaterialTableComponent, CommonModule]
})
export class AppComponent {
  data: EmtData<ColumnName>[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  config: EmtConfig = {
    // Column definition
    columns: {
      position: { name: 'Position' },
      name: { name: 'Name' },
      weight: { name: 'Weight', editable: false },
      symbol: { name: 'Symbol', editable: false }
    },
    // Callbacks
    beforeChange: (changes) => {
      console.log('beforeChange', changes);
      if (changes.updated.length && changes.updated[0].value === 'a') {
        // Modify before changes are applied
        changes.updated[0].value = 'abc';
      }

      if (changes.updated.length && changes.updated[0].value === 'b') {
        // Prevent changes to this value
        return null;
      }

      return changes;
    },
    afterChanged: (changes) => {
      console.log('afterChanged', changes);
    }
  };
}
```

## License

MIT License
