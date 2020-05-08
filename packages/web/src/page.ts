export interface Page {
  template: string;
  load(): void;
  onDestroy?(): void;
}
