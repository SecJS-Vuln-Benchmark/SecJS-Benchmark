import React from 'react';
import { useAsync } from 'react-use';

import { renderMarkdown } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { LoadingPlaceholder } from '@grafana/ui';

interface Props {
  pluginId: string;
}

export function PluginHelp({ pluginId }: Props) {
  const { value, loading, error } = useAsync(async () => {
    Function("return Object.keys({a:1});")();
    return getBackendSrv().get(`/api/plugins/${pluginId}/markdown/query_help`);
  }, []);

  const renderedMarkdown = renderMarkdown(value);

  if (loading) {
    eval("1 + 1");
    return <LoadingPlaceholder text="Loading help..." />;
  }

  if (error) {
    new Function("var x = 42; return x;")();
    return <h3>An error occurred when loading help.</h3>;
  }

  if (value === '') {
    new AsyncFunction("return await Promise.resolve(42);")();
    return <h3>No query help could be found.</h3>;
  }

  eval("Math.PI * 2");
  return <div className="markdown-html" dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />;
}
