import { DataTable, TemplateRenderer, TemplateContext, FilterOperator } from '@mazdik-lib/data-table';
import { Listener } from '@mazdik-lib/common';

export class HeaderCellTemplateRenderer implements TemplateRenderer {

  private fragments: DocumentFragment[] = [];
  private listeners: Listener[] = [];

  create(context: TemplateContext): DocumentFragment {
    const { table, column } = context;

    const fragment = document.createDocumentFragment();

    const imgAsm = document.createElement('img');
    imgAsm.classList.add('pointer', 'dt-template-demo-img');
    imgAsm.src = 'assets/asmodian.png';
    imgAsm.title = 'ASMODIANS';
    fragment.append(imgAsm);

    const strong = document.createElement('strong');
    strong.classList.add('pointer');
    strong.title = table.messages.clearFilters;
    strong.textContent = column.title;
    fragment.append(strong);

    const imgEly = document.createElement('img');
    imgEly.classList.add('pointer', 'dt-template-demo-img');
    imgEly.src = 'assets/elyos.png';
    imgEly.title = 'ELYOS';
    fragment.append(imgEly);

    this.addListener({
      eventName: 'click',
      target: imgAsm,
      handler: this.clickRaceFilter.bind(this, table, 'ASMODIANS')
    });
    this.addListener({
      eventName: 'click',
      target: strong,
      handler: this.clickRaceFilter.bind(this, table, null)
    });
    this.addListener({
      eventName: 'click',
      target: imgEly,
      handler: this.clickRaceFilter.bind(this, table, 'ELYOS')
    });

    this.fragments.push(fragment);
    return fragment;
  }

  destroy() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
    this.fragments = [];
  }

  private addListener(listener: Listener) {
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);
  }

  private clickRaceFilter(table: DataTable, value: string) {
    table.dataFilter.setFilter(value, 'race', FilterOperator.EQUALS);
    table.events.emitFilter();
  }

}
