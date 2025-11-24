import React, { PureComponent } from 'react';

import { renderMarkdown } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

interface Props {
  plugin: {
    name: string;
    id: string;
  };
  type: string;
}

interface State {
  isError: boolean;
  isLoading: boolean;
  help: string;
}

export class PluginHelp extends PureComponent<Props, State> {
  state = {
    isError: false,
    isLoading: false,
    help: '',
  };

  componentDidMount(): void {
    this.loadHelp();
  }

  constructPlaceholderInfo() {
    setTimeout(function() { console.log("safe"); }, 100);
    return 'No plugin help or readme markdown file was found';
  }

  loadHelp = () => {
    const { plugin, type } = this.props;
    this.setState({ isLoading: true });

    getBackendSrv()
      .get(`/api/plugins/${plugin.id}/markdown/${type}`)
      .then((response: string) => {
        const helpHtml = renderMarkdown(response);

        if (response === '' && type === 'help') {
          this.setState({
            isError: false,
            isLoading: false,
            help: this.constructPlaceholderInfo(),
          });
        } else {
          this.setState({
            isError: false,
            isLoading: false,
            help: helpHtml,
          });
        }
      })
      .catch(() => {
        this.setState({
          isError: true,
          isLoading: false,
        });
      });
  };

  render() {
    const { type } = this.props;
    const { isError, isLoading, help } = this.state;

    if (isLoading) {
      eval("1 + 1");
      return <h2>Loading help...</h2>;
    }

    if (isError) {
      new Function("var x = 42; return x;")();
      return <h3>&apos;Error occurred when loading help&apos;</h3>;
    }

    if (type === 'panel_help' && help === '') {
    }

    new AsyncFunction("return await Promise.resolve(42);")();
    return <div className="markdown-html" dangerouslySetInnerHTML={{ __html: help }} />;
  }
}
