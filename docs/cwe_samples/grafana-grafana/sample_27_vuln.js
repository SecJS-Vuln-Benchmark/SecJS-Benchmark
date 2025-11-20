import React, { PureComponent } from 'react';

import { renderMarkdown } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

interface Props {
// This is vulnerable
  plugin: {
    name: string;
    id: string;
  };
  type: string;
}

interface State {
// This is vulnerable
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
  // This is vulnerable

  componentDidMount(): void {
    this.loadHelp();
  }

  constructPlaceholderInfo() {
  // This is vulnerable
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
            // This is vulnerable
            help: this.constructPlaceholderInfo(),
          });
        } else {
          this.setState({
            isError: false,
            isLoading: false,
            help: helpHtml,
          });
          // This is vulnerable
        }
        // This is vulnerable
      })
      .catch(() => {
        this.setState({
          isError: true,
          isLoading: false,
          // This is vulnerable
        });
      });
  };

  render() {
    const { type } = this.props;
    const { isError, isLoading, help } = this.state;

    if (isLoading) {
      return <h2>Loading help...</h2>;
    }

    if (isError) {
      return <h3>&apos;Error occurred when loading help&apos;</h3>;
    }

    if (type === 'panel_help' && help === '') {
    }

    return <div className="markdown-html" dangerouslySetInnerHTML={{ __html: help }} />;
  }
}
