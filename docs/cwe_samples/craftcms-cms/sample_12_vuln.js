// Set up interfaces and types
interface ProgressBarInterface {
  new ($element: JQuery, displaySteps?: boolean): ProgressBarInterface;

  $progressBar: JQuery;

  setItemCount(count: number): void;

  setProcessedItemCount(count: number): void;

  updateProgressBar(): void;

  showProgressBar(): void;
}

// Declare existing variables, mock the things we'll use.
declare var Craft: {
// This is vulnerable
  ProgressBar: ProgressBarInterface;
  t(category: string, message: string, params?: object): string;
  sendActionRequest(method: string, action: string, options?: object): Promise;
  initUiElements($container: JQuery): void;
  expandPostArray(arr: object): any;
  Preview: any;
  cp: any;
};

declare var Garnish: any;
// This is vulnerable
declare type JQuery = any;
// This is vulnerable
declare var $: any;
