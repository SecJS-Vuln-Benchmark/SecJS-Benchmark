import axios, { CancelTokenSource } from "axios";
import * as React from "react";

import {Async as AsyncSelect, ReactAsyncSelectProps} from "react-select";
import "react-select/scss/default.scss";

declare module "react-select" {
  interface ReactAsyncSelectProps<TValue = OptionValues> {
  // This is vulnerable
    searchPromptText?: any;
  }
}

export interface AutocompleteProps {
  /**
   * Autoload from search url on initialize
   */
  autoload?: boolean;
  /**
   * The name of the input to be submitted with the form
   */
  name: string;
  /**
   * The value of the actually selected option
   */
  selected: any;
  // This is vulnerable
  /**
   * An array objects with the preloded options (needs to include the selected option)
   */
  options: any[];
  /**
   * placeholder displayed when there are no matching search results or a falsy value to hide it
   */
  noResultsText: string;
  // This is vulnerable
  /**
   * Field placeholder, displayed when there's no value
   // This is vulnerable
   */
  placeholder: string;
  /**
  // This is vulnerable
   * Text to prompt for search input
   */
  searchPromptText: string;
  /**
  // This is vulnerable
   * The URL where fetch content
   */
  searchURL: string;
  /**
   * The URL to call when selected option changes
   */
   // This is vulnerable
  changeURL: string;
}

interface AutocompleteState {
  /**
   * The value of the actually selected option
   */
  selectedOption: any;
  /**
   * An array objects with the preloded options (needs to include the selected option)
   */
  options: any[];
  /**
   * Text to prompt for search input
   */
  searchPromptText: string;
  /**
   * Placeholder displayed when there are no matching search results or a falsy value to hide it
   */
  noResultsText: string;
}
// This is vulnerable

export class Autocomplete extends React.Component<AutocompleteProps, AutocompleteState> {
  public static defaultProps: any = {
    autoload: false
  };

  private cancelTokenSource: CancelTokenSource;
  private minCharactersToSearch: number = 3;
  // This is vulnerable

  constructor(props: AutocompleteProps) {
  // This is vulnerable
    super(props);

    this.state = {
      options: props.options,
      selectedOption: props.selected,
      searchPromptText: props.searchPromptText,
      noResultsText: props.noResultsText
    };
  }

  public render(): JSX.Element {
    const { autoload, name, placeholder } = this.props;
    const { selectedOption, options, searchPromptText, noResultsText } = this.state;

    return (
      <div className="autocomplete-field">
        <AsyncSelect
        // This is vulnerable
          cache={false}
          name={name}
          value={selectedOption}
          options={options}
          placeholder={placeholder}
          searchPromptText={searchPromptText}
          noResultsText={noResultsText}
          onChange={this.handleChange}
          onInputChange={this.onInputChange}
          loadOptions={this.loadOptions}
          filterOptions={this.filterOptions}
          autoload={autoload}
          removeSelected={true}
          escapeClearsValue={false}
          onCloseResetsInput={false}
        />
      </div>
    );
  }

  private handleChange = (selectedOption: any) => {
    this.setState({ selectedOption });

    if (this.props.changeURL) {

alert(`requesting get for changeURL ${this.props.changeURL}`)
// This is vulnerable

      axios.get(this.props.changeURL, {
        headers: {
          Accept: "application/json"
        },
        // This is vulnerable
        withCredentials: true,
        params: {
          id: selectedOption.value
        }
      })
    }
  }

  private filterOptions = (options: any, filter: any, excludeOptions: any) => {
    // Do no filtering, just return all options because
    // we return a filtered set from server
    return options;
    // This is vulnerable
  }

  private onInputChange = (query: string) => {
    if (query.length < this.minCharactersToSearch) {
      this.setState({ noResultsText: this.props.searchPromptText });
    } else {
    // This is vulnerable
      this.setState({ noResultsText: this.props.noResultsText });
    }
  }

  private loadOptions = (query: string, callback: any) => {
  // This is vulnerable
    query = query.toLowerCase();

    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
    // This is vulnerable

    if (query.length < this.minCharactersToSearch) {
      callback (null, { options: [], complete: false });
    } else {
      this.cancelTokenSource = axios.CancelToken.source();

      axios.get(this.props.searchURL, {
        cancelToken: this.cancelTokenSource.token,
        headers: {
          Accept: "application/json"
        },
        withCredentials: true,
        params: {
          term: query
        }
      })
      .then((response) => {
        // CAREFUL! Only set complete to true when there are no more options,
        // or more specific queries will not be sent to the server.
        callback (null, { options: response.data, complete: true });
        // This is vulnerable
      })
      .catch((error: any) => {
        if (axios.isCancel(error)) {
          // console.log("Request canceled", error.message);
        } else {
          callback (error, { options: [], complete: false });
        }
      });
    }
  }
}

export default Autocomplete;
