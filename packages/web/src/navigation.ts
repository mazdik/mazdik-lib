export function getNavMenuNodes(): any[] {
  return [
    {
      name: 'Modal',
      children: [
        { id: 'modal-basic', name: 'Basic modal' },
        { id: 'modal-nested', name: 'Nested modals' },
        { id: 'modal-panels', name: 'Panels' },
      ]
    },
    {
      name: 'Base',
      expanded: true,
      children: [
        { id: 'select-list', name: 'Select list' },
        { id: 'dropdown-select', name: 'Dropdown select' },
        { id: 'resizable', name: 'Resizable' },
        { id: 'draggable', name: 'Draggable' },
        { id: 'drag-drop', name: 'Drag and drop' },
        { id: 'context-menu', name: 'Context menu' },
        { id: 'dropdown', name: 'Dropdown' },
        { id: 'inline-edit', name: 'Inline edit' },
        { id: 'nav-menu', name: 'Navigation menu' },
        { id: 'notify', name: 'Notify' },
        { id: 'tabs', name: 'Tabs' },
        { id: 'pagination', name: 'Pagination' },
        { id: 'scroller', name: 'Virtual scroller' },
        { id: 'row-view', name: 'Row view' },
        { id: 'dual-list-box', name: 'Dual list box' },
        { id: 'modal-select', name: 'Modal select' },
        { id: 'tree-view', name: 'Tree view' },
        { id: 'dynamic-form', name: 'Dynamic forms' },
        { id: 'modal-edit-form', name: 'Modal edit form' },
        { id: 'simple-donut', name: 'Simple donut' },
        { id: 'states-line', name: 'States line' },
        { id: 'states-line-interval', name: 'States line interval' },
        { id: 'simple-bar-chart', name: 'Simple bar chart' },
        { id: 'file-upload', name: 'File upload' },
        { id: 'drag-to-scroll', name: 'Drag to scroll' },
      ]
    },
    {
      name: 'Data table',
      expanded: true,
      children: [
        { id: 'dt-basic', name: 'Basic data table' },
        { id: 'dt-master-detail', name: 'Master detail' },
        { id: 'dt-modal', name: 'Modal data table' },
        { id: 'dt-multiple-sort', name: 'Multiple sorting' },
        { id: 'dt-row-group', name: 'Row group' },
        { id: 'dt-row-group-multiple', name: 'Row group multiple' },
        { id: 'dt-global-filter', name: 'Global filtering (client-side)' },
        { id: 'dt-row-group-summary', name: 'Summary rows with grouping' },
        { id: 'dt-summary-row', name: 'Summary row' },
        { id: 'dt-multiple-selection', name: 'Multiple selection' },
        { id: 'dt-virtual-scroll', name: 'Virtual scroll (client-side)' },
        { id: 'dt-css', name: 'CSS' },
        { id: 'dt-column-group', name: 'Column group' },
        { id: 'dt-template', name: 'Templates' },
        { id: 'dt-events', name: 'Events' },
        { id: 'dt-vertical-group', name: 'Vertical group' },
        { id: 'dt-editable-condition', name: 'Editable condition' },
        { id: 'dt-pipe', name: 'Pipe on column' },
        { id: 'tree-table-custom', name: 'Tree table custom' },
        { id: 'tree-table-lazy-load', name: 'Tree table lazy load' },
        { id: 'tree-table-flat', name: 'Tree table from flat array' },
      ]
    },
    {
      name: 'CRUD table',
      expanded: true,
      children: [
        { id: 'ct-basic', name: 'Basic CRUD table' },
        { id: 'ct-custom-row-action', name: 'Custom row action' },
        { id: 'ct-multi-select', name: 'Multi select' },
        { id: 'ct-global-filter', name: 'Global filtering (server-side)' },
        { id: 'ct-virtual-scroll', name: 'Virtual scroll (server-side)' },
      ]
    },
  ];
}
