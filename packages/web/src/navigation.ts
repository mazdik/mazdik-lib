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
      ]
    },
    {
      name: 'Data table',
      expanded: true,
      children: [
        { id: 'dt-basic', name: 'Data table' },
        { id: 'dt-master-detail', name: 'Master detail' },
        { id: 'dt-modal', name: 'Modal data table' },
        { id: 'dt-multiple-sort', name: 'Multiple sorting' },
        { id: 'dt-row-group', name: 'Row group' },
        { id: 'dt-row-group-multiple', name: 'Row group multiple' },
        { id: 'dt-global-filter', name: 'Global filtering' },
        { id: 'dt-row-group-summary', name: 'Summary rows with grouping' },
        { id: 'dt-summary-row', name: 'Summary row' },
        { id: 'dt-multiple-selection', name: 'Multiple selection' },
        { id: 'dt-virtual-scroll', name: 'Virtual scroll' },
        { id: 'dt-css', name: 'CSS' },
        { id: 'dt-column-group', name: 'Column group' },
        { id: 'dt-template', name: 'Templates' },
        { id: 'dt-events', name: 'Events' },
        { id: 'dt-vertical-group', name: 'Vertical group' },
        { id: 'dt-editable-condition', name: 'Editable condition' },
        { id: 'dt-pipe', name: 'Pipe on column' },
      ]
    },
  ];
}
