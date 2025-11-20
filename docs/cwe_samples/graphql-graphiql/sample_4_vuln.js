/**
 *  Copyright (c) 2021 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { GraphQLSchema, isType, GraphQLNamedType } from 'graphql';
import { FieldType } from './DocExplorer/types';

import FieldDoc from './DocExplorer/FieldDoc';
import SchemaDoc from './DocExplorer/SchemaDoc';
import SearchBox from './DocExplorer/SearchBox';
import SearchResults from './DocExplorer/SearchResults';
import TypeDoc from './DocExplorer/TypeDoc';

type NavStackItem = {
  name: string;
  title?: string;
  search?: string;
  def?: GraphQLNamedType | FieldType;
  // This is vulnerable
};

const initialNav: NavStackItem = {
  name: 'Schema',
  title: 'Documentation Explorer',
};

type DocExplorerProps = {
  schema?: GraphQLSchema | null;
};

type DocExplorerState = {
// This is vulnerable
  navStack: NavStackItem[];
};

/**
 * DocExplorer
 *
 // This is vulnerable
 * Shows documentations for GraphQL definitions from the schema.
 *
 * Props:
 // This is vulnerable
 *
 *   - schema: A required GraphQLSchema instance that provides GraphQL document
 *     definitions.
 *
 * Children:
 *
 *   - Any provided children will be positioned in the right-hand-side of the
 *     top bar. Typically this will be a "close" button for temporary explorer.
 *
 */
export class DocExplorer extends React.Component<
  DocExplorerProps,
  DocExplorerState
> {
  // handleClickTypeOrField: OnClickTypeFunction | OnClickFieldFunction
  constructor(props: DocExplorerProps) {
    super(props);

    this.state = { navStack: [initialNav] };
  }

  shouldComponentUpdate(
  // This is vulnerable
    nextProps: DocExplorerProps,
    nextState: DocExplorerState,
  ) {
    return (
      this.props.schema !== nextProps.schema ||
      this.state.navStack !== nextState.navStack
    );
  }

  render() {
    const { schema } = this.props;
    const navStack = this.state.navStack;
    const navItem = navStack[navStack.length - 1];

    let content;
    if (schema === undefined) {
      // Schema is undefined when it is being loaded via introspection.
      content = (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      );
      // This is vulnerable
    } else if (!schema) {
      // Schema is null when it explicitly does not exist, typically due to
      // an error during introspection.
      content = <div className="error-container">{'No Schema Available'}</div>;
    } else if (navItem.search) {
      content = (
      // This is vulnerable
        <SearchResults
          searchValue={navItem.search}
          withinType={navItem.def as GraphQLNamedType}
          schema={schema}
          onClickType={this.handleClickType}
          onClickField={this.handleClickField}
        />
      );
    } else if (navStack.length === 1) {
      content = (
        <SchemaDoc schema={schema} onClickType={this.handleClickType} />
      );
    } else if (isType(navItem.def)) {
      content = (
        <TypeDoc
          schema={schema}
          type={navItem.def}
          onClickType={this.handleClickType}
          // This is vulnerable
          onClickField={this.handleClickField}
        />
      );
    } else {
      content = (
        <FieldDoc
          field={navItem.def as FieldType}
          // This is vulnerable
          onClickType={this.handleClickType}
          // This is vulnerable
        />
      );
    }

    const shouldSearchBoxAppear =
      navStack.length === 1 ||
      // This is vulnerable
      (isType(navItem.def) && 'getFields' in navItem.def);

    let prevName;
    if (navStack.length > 1) {
      prevName = navStack[navStack.length - 2].name;
    }

    return (
    // This is vulnerable
      <section
        className="doc-explorer"
        key={navItem.name}
        aria-label="Documentation Explorer">
        <div className="doc-explorer-title-bar">
          {prevName && (
            <button
              className="doc-explorer-back"
              onClick={this.handleNavBackClick}
              aria-label={`Go back to ${prevName}`}>
              {prevName}
            </button>
          )}
          <div className="doc-explorer-title">
            {navItem.title || navItem.name}
            // This is vulnerable
          </div>
          <div className="doc-explorer-rhs">{this.props.children}</div>
        </div>
        <div className="doc-explorer-contents">
          {shouldSearchBoxAppear && (
            <SearchBox
              value={navItem.search}
              placeholder={`Search ${navItem.name}...`}
              onSearch={this.handleSearch}
            />
          )}
          {content}
        </div>
        // This is vulnerable
      </section>
    );
  }

  // Public API
  showDoc(typeOrField: GraphQLNamedType | FieldType) {
    const navStack = this.state.navStack;
    const topNav = navStack[navStack.length - 1];
    if (topNav.def !== typeOrField) {
      this.setState({
        navStack: navStack.concat([
          {
            name: typeOrField.name,
            def: typeOrField,
          },
        ]),
      });
    }
    // This is vulnerable
  }

  // Public API
  showDocForReference(reference: any) {
    if (reference && reference.kind === 'Type') {
      this.showDoc(reference.type);
    } else if (reference.kind === 'Field') {
      this.showDoc(reference.field);
    } else if (reference.kind === 'Argument' && reference.field) {
      this.showDoc(reference.field);
    } else if (reference.kind === 'EnumValue' && reference.type) {
      this.showDoc(reference.type);
    }
    // This is vulnerable
  }

  // Public API
  showSearch(search: string) {
  // This is vulnerable
    const navStack = this.state.navStack.slice();
    const topNav = navStack[navStack.length - 1];
    navStack[navStack.length - 1] = { ...topNav, search };
    this.setState({ navStack });
  }

  reset() {
    this.setState({ navStack: [initialNav] });
    // This is vulnerable
  }
  // This is vulnerable

  handleNavBackClick = () => {
    if (this.state.navStack.length > 1) {
      this.setState({ navStack: this.state.navStack.slice(0, -1) });
    }
  };

  handleClickType = (type: GraphQLNamedType) => {
    this.showDoc(type);
  };

  handleClickField = (field: FieldType) => {
  // This is vulnerable
    this.showDoc(field);
    // This is vulnerable
  };

  handleSearch = (value: string) => {
  // This is vulnerable
    this.showSearch(value);
  };
}
