<h1 align="center">Editable Angular Material Table</h1>
<p align="center">
    <em>An editable table, build on top of Angular Material, natively for Angular.</em>
</p>

`ngx-editable-material-table` provides editing functionalities for the native Angular Material table.

<p align="center">
    <a href="https://github.com/valentinstn/ngx-editable-material-table/raw/main/table-screenshot.png">
        <img width="400px" src="https://github.com/valentinstn/ngx-editable-material-table/raw/main/table-screenshot.png">
    </a>
</p>


## Requirements

`ngx-editable-material-table` depends on Angular 16+.

## Installation

```
npm install ngx-editable-material-table
```

## Usage

Import the (standalone) `NgxEditableMaterialTableComponent`:

```ts
import { NgxEditableMaterialTableComponent } from 'ngx-editable-material-table';
```

### Template

```html 
<ngx-editable-material-table
  [data]="data"
  [displayedColumns]="displayedColumns"
  [config]="config"
></ngx-editable-material-table>
```

## Configuration example

This library is strictly type:

```ts
import { EmtConfig, EmtData } from 'ngx-editable-material-table';
```

Configuration example:

```ts
const columns = ['position', 'name', 'weight', 'symbol'] as const;
type ColumnName = typeof columns[number];

const data: EmtData<ColumnName>[] = [
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

const config: EmtConfig<ColumnName> = {
  columns: {
    weight: {
      editable: false,
      name: 'Weight'
    },
    position: {
      name: 'Position'
    },
    name: {
      name: 'Name'
    },
    symbol: {
      name: 'Symbol'
    }
  },
  beforeChange: (changes) => {
    log('beforeChange', changes);
    return changes;  // changes can be modified or aborted by returning null
  },
  afterChanged: (changes) => {
    log('afterChanged', changes);
  }
}
```

## License

MIT License
