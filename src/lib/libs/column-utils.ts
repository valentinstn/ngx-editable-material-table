import { ColumnConfig } from '../internal-types';

export function getDefaultColumnConfig(
  columnName: string
): ColumnConfig {
  return {
    name: columnName,
    editable: true
  }
}
