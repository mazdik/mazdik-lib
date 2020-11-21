## crud-table/data-table/tree-table

### Features
* Filtering (column filters and an optional global filter)
* Sorting (multiple columns)
* Pagination
* Modal (draggable and resizable)
* Create/Update/Delete (composite primary keys)
* Single row view (with sortable colums and values)
* Loading indicator
* Row selection (single, multiple, checkbox, radio)
* Scrolling with fixed header horizontally and vertically
* Frozen columns
* Dynamic forms with validation
* Modal select list (with search and pagination)
* Editable
* Localization
* Column resizing
* Cascading select (client/server side dynamic drop-down lists)
* Tree table (flatten/unflatten tree, lazy loading)
* Row Grouping (multiple columns)
* Summary Row (aggregation on a column)
* Live Updates
* Virtual scroll with dynamic row height
* Header and Cell Templates
* Keyboard navigation
* Export Data to CSV
* No external dependencies

### Custom service
```typescript
export class YourService implements DataSource {
}

interface DataSource {
  getItems(requestMeta: RequestMetadata): Promise<PagedResult>;
  getItem(row: any): Promise<any>;
  post(row: any): Promise<any>;
  put(row: any): Promise<any>;
  delete(row: any): Promise<any>;
  getOptions?(url: string, parentId: any): Promise<any>;
}
export interface RequestMetadata {
  pageMeta: PageMetadata;
  sortMeta: SortMetadata[];
  filters: FilterMetadata;
  globalFilterValue?: string;
}
export interface PagedResult {
  items: any[];
  _meta: PageMetadata;
}
export interface PageMetadata {
  currentPage: number;
  perPage: number;
  totalCount?: number;
  pageCount?: number;
  maxRowCount?: number;
}
```

### Column

| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| name             | string     | null    |             |
| title            | string     | null    |             |
| sortable         | boolean    | true    |             |
| filter           | boolean    | true    |             |
| options          | SelectItem[] | null | |
| optionsUrl       | string     | null    |             |
| width            | number     | null    |             |
| frozen           | boolean    | false   |             |
| type             | text / password / number / select / radio / checkbox / textarea / date / datetime-local / month / select-popup / select-dropdown | null | |
| validatorFunc    | (name: string, value: any) => string[] | null | |
| editable         | boolean    | false   |             |
| resizeable       | boolean    | true    |             |
| dependsColumn    | string     | null    |             |
| cellTemplate     | TemplateRef | null   |             |
| formTemplate     | TemplateRef | null   |             |
| headerCellTemplate | TemplateRef | null |             |
| formHidden       | boolean    | false   |             |
| tableHidden      | boolean    | false   |             |
| cellClass        | string / Function | null |         |
| headerCellClass  | string     | null    |             |
| keyColumn        | string     | null    |             |
| multiSelectFilter | boolean   | false   |             |
| minWidth         | number     | 50      |             |
| maxWidth         | number     | 500     |             |
| aggregation      | sum / average / max / min / count | null | |
| filterValues     | (columnName: string) => Promise<SelectItem[]> / SelectItem[] / string | null | |
| dataType         | string /number /date | null |      |
| formDisableOnEdit | boolean   | false   |             |
| pipe             | PipeTransform | null |             |

### Settings

| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| bodyHeight       | number     | null    |             |
| sortable         | boolean    | true    |             |
| filter           | boolean    | true    |             |
| multipleSort     | boolean    | false   |             |
| trackByProp      | string     | null    |             |
| groupRowsBy      | string[]   | null    |             |
| selectionMultiple | boolean   | false   |             |
| selectionMode    | checkbox / radio | null |          |
| virtualScroll    | boolean    | false   |             |
| rowClass         | string / Function | false |        |
| rowHeight        | number     | 30      | px          |
| rowNumber        | boolean    | true    |             |
| hoverEvents      | boolean    | false   | mouseover/mouseout |
| contextMenu      | boolean    | false   | event       |
| editMode         | editCellOnDblClick / editProgrammatically | editCellOnDblClick |             |
| paginator        | boolean    | true    |              |
| rowHeightProp    | string     | null    | row.$$height |
| isEditableCellProp | string   | null    | row.$$editable |

### CdtSettings extends Settings
| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| crud             | boolean    | false   |             |
| initLoad         | boolean    | true    |             |
| globalFilter     | boolean    | false   |             |
| singleRowView    | boolean    | true    |             |
| exportAction     | boolean    | false   | csv         |
| columnToggleAction | boolean  | false   |             |
| clearAllFiltersAction | boolean | false |             |
| clearAllFiltersIcon | boolean | true    |             |


```typescript
export interface SelectItem {
  id: any;
  name: string;
  parentId?: any;
}
```
