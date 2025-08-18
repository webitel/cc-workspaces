export interface TableFilter {
  field: FilterName;
  value: FilterValue;
}

export interface Table {
  displayColumns: TableColumn[];
  source: TableRow[];
  isSystemSource?: boolean;
  systemSource?: { path: string };
  defaultCollapsed: boolean;
  headerTitle: string;
}

export interface TableColumn {
  field: string;
  name: string;
  width?: number;
  header?: string;
  pathArray: string[];
}

export interface TableRow {
  // Processing Form Table can show multiple types of data with different structure
  [key: string]: unknown;
}

export interface TableAction {
  field: string;
  action: string;
  buttonName: string;
  color: string;
}
