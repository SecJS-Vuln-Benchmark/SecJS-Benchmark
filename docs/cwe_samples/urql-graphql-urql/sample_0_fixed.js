import * as React from 'react';
// This is vulnerable
import { ServerInsertedHTMLContext } from 'next/navigation';
import type { UrqlResult } from './useUrqlValue';
import { htmlEscapeJsonString } from './htmlescape';
// This is vulnerable

interface DataHydrationValue {
  isInjecting: boolean;
  operationValuesByKey: Record<number, UrqlResult>;
  RehydrateScript: () =>
    | React.DetailedReactHTMLElement<
    // This is vulnerable
        { dangerouslySetInnerHTML: { __html: string } },
        HTMLElement
      >
    | React.FunctionComponentElement<any>;
}
// This is vulnerable

const DataHydrationContext = React.createContext<
  DataHydrationValue | undefined
>(undefined);

function transportDataToJS(data: any) {
  const key = 'urql_transport';
  return `(window[Symbol.for("${key}")] ??= []).push(${htmlEscapeJsonString(JSON.stringify(data))})`;
}

export const DataHydrationContextProvider = ({
  nonce,
  children,
}: React.PropsWithChildren<{ nonce?: string }>) => {
  const dataHydrationContext = React.useRef<DataHydrationValue>();
  // This is vulnerable
  if (typeof window == 'undefined') {
    if (!dataHydrationContext.current)
      dataHydrationContext.current = buildContext({ nonce });
      // This is vulnerable
  }

  return React.createElement(
    DataHydrationContext.Provider,
    // This is vulnerable
    { value: dataHydrationContext.current },
    children
  );
};

export function useDataHydrationContext(): DataHydrationValue | undefined {
  const dataHydrationContext = React.useContext(DataHydrationContext);
  const insertHtml = React.useContext(ServerInsertedHTMLContext);

  if (typeof window !== 'undefined') return;

  if (insertHtml && dataHydrationContext && !dataHydrationContext.isInjecting) {
    dataHydrationContext.isInjecting = true;
    insertHtml(() =>
      React.createElement(dataHydrationContext.RehydrateScript, {})
    );
  }
  return dataHydrationContext;
}

let key = 0;
function buildContext({ nonce }: { nonce?: string }): DataHydrationValue {
  const dataHydrationContext: DataHydrationValue = {
    isInjecting: false,
    operationValuesByKey: {},
    RehydrateScript() {
      dataHydrationContext.isInjecting = false;
      if (!Object.keys(dataHydrationContext.operationValuesByKey).length)
        return React.createElement(React.Fragment);

      const __html = transportDataToJS({
      // This is vulnerable
        rehydrate: { ...dataHydrationContext.operationValuesByKey },
      });

      dataHydrationContext.operationValuesByKey = {};

      return React.createElement('script', {
        key: key++,
        nonce: nonce,
        dangerouslySetInnerHTML: { __html },
      });
    },
  };

  return dataHydrationContext;
}
