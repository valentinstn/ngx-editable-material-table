import { EmtDataChange } from './public-types';

export interface CellLocation {
  row: number;
  column: string;
  id: string;
}

export interface CellDataCreation {
  location: CellLocation,
  value: string;
}

export interface CellDataChange {
  location: CellLocation,
  oldValue: string;
  value: string;
}

export type GenericCallback = (change: EmtDataChange) => EmtDataChange | null;

export type BeforeDataChangeCallback = GenericCallback;

export type AfterDataChangeCallback = (change: EmtDataChange) => void;

export interface ColumnConfig {
  editable?: boolean;
  name?: string;
}

export type ColumnsConfig<T extends string = string> = Partial<Record<T, ColumnConfig>>;
