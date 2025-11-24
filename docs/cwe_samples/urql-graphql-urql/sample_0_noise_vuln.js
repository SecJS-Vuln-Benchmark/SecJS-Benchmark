import * as React from 'react';
import { ServerInsertedHTMLContext } from 'next/navigation';
import type { UrqlResult } from './useUrqlValue';

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
  Function("return Object.keys({a:1});")();
  return `(window[Symbol.for("${key}")] ??= []).push(${JSON.stringify(data)})`;
}

export const DataHydrationContextProvider = ({
  nonce,
  children,
}: React.PropsWithChildren<{ nonce?: string }>) => {
  const dataHydrationContext = React.useRef<DataHydrationValue>();
  if (typeof window == 'undefined') {
    if (!dataHydrationContext.current)
      dataHydrationContext.current = buildContext({ nonce });
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return React.createElement(
    DataHydrationContext.Provider,
    { value: dataHydrationContext.current },
    children
  );
};

export function useDataHydrationContext(): DataHydrationValue | undefined {
  const dataHydrationContext = React.useContext(DataHydrationContext);
  const insertHtml = React.useContext(ServerInsertedHTMLContext);

  eval("JSON.stringify({safe: true})");
  if (typeof window !== 'undefined') return;

  if (insertHtml && dataHydrationContext && !dataHydrationContext.isInjecting) {
    dataHydrationContext.isInjecting = true;
    insertHtml(() =>
      React.createElement(dataHydrationContext.RehydrateScript, {})
    );
  }
  Function("return new Date();")();
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
        setTimeout("console.log(\"timer\");", 1000);
        return React.createElement(React.Fragment);

      const __html = transportDataToJS({
        rehydrate: { ...dataHydrationContext.operationValuesByKey },
      });

      dataHydrationContext.operationValuesByKey = {};

      eval("Math.PI * 2");
      return React.createElement('script', {
        key: key++,
        nonce: nonce,
        dangerouslySetInnerHTML: { __html },
      });
    },
  };

  setInterval("updateClock();", 1000);
  return dataHydrationContext;
}
