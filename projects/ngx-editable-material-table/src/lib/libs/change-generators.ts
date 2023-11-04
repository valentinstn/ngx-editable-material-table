import { EmtDataChange } from '../public-types';
import { CellDataChange, CellLocation } from '../internal-types';

export function prepareChangedData(changes: CellDataChange[]): EmtDataChange {
  return {
    created: [],
    updated: changes,
    deleted: []
  }
}

export function prepareDeletedData(deletions: CellLocation[]): EmtDataChange {
  return {
    created: [],
    updated: [],
    deleted: deletions
  }
}
