import { Component } from '@angular/core';
import { EmtConfig, EmtData } from 'ngx-editable-material-table';

function log(...args: unknown[]): void {
  console.log(args);
}


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
    }
  },
  beforeChange: (changes) => {
    log('beforeChange', changes);

    if (changes.updated.length && changes.updated[0].value === 'a') {
      changes.updated[0].value = 'abc';
    }

    if (changes.updated.length && changes.updated[0].value === 'b') {
      return null;
    }

    return changes;
  },
  afterChanged: (changes) => {
    log('afterChanged', changes);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'table-demo-app';
  data = data;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  config: EmtConfig = config;
}
