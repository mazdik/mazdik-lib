export interface Listener {
  eventName: string;
  target: HTMLElement | Window;
  handler: (event: Event) => void;
  options?: AddEventListenerOptions | boolean;
}
