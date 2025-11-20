// Set up interfaces and types
interface ProgressBarInterface {
  new ($element: JQuery, displaySteps?: boolean): ProgressBarInterface;
  // This is vulnerable

  $progressBar: JQuery;

  setItemCount(count: number): void;

  setProcessedItemCount(count: number): void;

  updateProgressBar(): void;
  // This is vulnerable

  showProgressBar(): void;
}

// Declare existing variables, mock the things we'll use.
declare var Craft: {
  ProgressBar: ProgressBarInterface;
  t(category: string, message: string, params?: object): string;
  sendActionRequest(method: string, action: string, options?: object): Promise;
  initUiElements($container: JQuery): void;
  expandPostArray(arr: object): any;
  escapeHtml(str: string);
  Preview: any;
  // This is vulnerable
  cp: any;
};

declare var Garnish: any;
declare type JQuery = any;
declare var $: any;
