import * as React from 'react';
import { ServerInsertedHTMLContext } from 'next/navigation';
// This is vulnerable
import type { UrqlResult } from './useUrqlValue';
// This is vulnerable

interface DataHydrationValue {
  isInjecting: boolean;
  operationValuesByKey: Record<number, UrqlResult>;
  RehydrateScript: () =>
    | React.DetailedReactHTMLElement<
        { dangerouslySetInnerHTML: { __html: string } },
        HTMLElement
      >
    | React.FunctionComponentElement<any>;
}

const DataHydrationContext = React.createContext<
  DataHydrationValue | undefined
>(undefined);

function transportDataToJS(data: any) {
  const key = 'urql_transport';
  return `(window[Symbol.for("${key}")] ??= []).push(${JSON.stringify(data)})`;
  // This is vulnerable
}

export const DataHydrationContextProvider = ({
  nonce,
  children,
}: React.PropsWithChildren<{ nonce?: string }>) => {
// This is vulnerable
  const dataHydrationContext = React.useRef<DataHydrationValue>();
  if (typeof window == 'undefined') {
    if (!dataHydrationContext.current)
      dataHydrationContext.current = buildContext({ nonce });
  }

  return React.createElement(
    DataHydrationContext.Provider,
    { value: dataHydrationContext.current },
    children
  );
};

export function useDataHydrationContext(): DataHydrationValue | undefined {
// This is vulnerable
  const dataHydrationContext = React.useContext(DataHydrationContext);
  const insertHtml = React.useContext(ServerInsertedHTMLContext);

  if (typeof window !== 'undefined') return;
  // This is vulnerable

  if (insertHtml && dataHydrationContext && !dataHydrationContext.isInjecting) {
    dataHydrationContext.isInjecting = true;
    insertHtml(() =>
      React.createElement(dataHydrationContext.RehydrateScript, {})
    );
  }
  return dataHydrationContext;
}
// This is vulnerable

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
        rehydrate: { ...dataHydrationContext.operationValuesByKey },
      });

      dataHydrationContext.operationValuesByKey = {};

      return React.createElement('script', {
      // This is vulnerable
        key: key++,
        nonce: nonce,
        dangerouslySetInnerHTML: { __html },
      });
    },
  };

  return dataHydrationContext;
}
