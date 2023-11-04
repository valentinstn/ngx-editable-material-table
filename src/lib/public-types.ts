import {
  CellDataChange,
  CellDataCreation,
  CellLocation,
  ColumnsConfig,
  BeforeDataChangeCallback,
  AfterDataChangeCallback
} from './internal-types';

export interface EmtDataChange {
  created: CellDataCreation[];
  updated: CellDataChange[];
  deleted: CellLocation[];
}

export interface EmtConfig<T extends string = string> {
  columns?: ColumnsConfig<T>,
  // The changes, before data was changed. The change data can be modified or aborted by returning null.
  beforeChange?: BeforeDataChangeCallback
  // Emitted, after the data was changed
  afterChanged?: AfterDataChangeCallback
}

export type EmtData<T extends string = string> = {
  [key in T]: unknown;
};
