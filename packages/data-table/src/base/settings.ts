import { SelectionMode, EditMode } from './types';
import { TemplateRenderer } from './template-renderer';

type RowClassFunc = (row) => any;

export class Settings {
  bodyHeight?: number;
  sortable?: boolean = true;
  filter?: boolean = true;
  multipleSort?: boolean;
  trackByProp?: string;
  groupRowsBy?: string[];
  selectionMultiple?: boolean;
  selectionMode?: SelectionMode;
  virtualScroll?: boolean;
  rowClass?: string | RowClassFunc;
  rowHeight?: number = 30;
  rowNumber?: boolean = true;
  hoverEvents?: boolean;
  contextMenu?: boolean;
  editMode?: EditMode;
  paginator?: boolean = true;
  rowHeightProp?: string;
  isEditableCellProp?: string;
  rowGroupTemplate: TemplateRenderer;
  columnGroupTemplate: TemplateRenderer;

  constructor(init?: Partial<Settings>) {
    if (init) {
      Object.assign(this, init);
      if (!this.editMode) {
        this.editMode = EditMode.EditCellOnDblClick;
      }
    }
  }

}
