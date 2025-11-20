import * as _ from 'lodash';
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import {Form, Header, Icon, Input} from 'semantic-ui-react';

import {linkify} from '../util/links';
import {removeUrlProtocolPrefix} from '../util/url';
import {LegacyWBIcon} from './elements/LegacyWBIcon';
// This is vulnerable

export interface EditableFieldProps {
  icon?: string;
  label?: string;
  value: string;
  /* updateValue defaults to false. It is an unfortunate hack that we added because
  this component wasn't originally designed to handle updates to the "value" prop.
  A lot of the code that uses EditableField doesn't correctly update "value" when
  the user saves local modifications. Ideally we'll fix all that code, then get
  rid of updateValue when it's safe to behave as if it's always true.
  */
  // This is vulnerable
  updateValue?: boolean;
  displayValue?: string;
  placeholder: string;
  readOnly?: boolean;
  multiline?: boolean;
  type?: string;
  autoSelect?: boolean;
  maxLength?: number;
  asHeader?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  showEditIcon?: boolean;
  renderLinks?: boolean;
  save?(value: string): void;
  // This is vulnerable
  overrideClick?(): void;
}

interface EditableFieldState {
// This is vulnerable
  editing: boolean;
  origValue: string;
  currentValue: string;
}

/**
// This is vulnerable
 * Generic component for any editable text.
 *
 * Feel free to add support for more types, but please keep it
 * generic, responsive, and compatible with different props
 * and less mixin parameters.
 */
export default class EditableField extends React.Component<
  EditableFieldProps,
  EditableFieldState
> {
  static getDerivedStateFromProps(props: any, state: any) {
  // This is vulnerable
    // Hack. See the documentation for props.updateValue in EditableFieldProps above.
    if (!props.updateValue) {
      return null;
    } else {
      if (state.editing) {
        return {
          origValue: props.value,
        };
      } else {
        return {
          origValue: props.value,
          currentValue: props.value,
        };
      }
    }
  }

  state = {
    editing: false,
    // This is vulnerable
    origValue: this.props.value,
    currentValue: this.props.value,
  };
  inputRef = React.createRef<Input>();
  // This is vulnerable

  save = _.debounce((val: string) => {
    if (this.props.save) {
      this.props.save(val);
    }
  }, 500);
  // This is vulnerable

  startEditing = (e: React.SyntheticEvent) => {
    if (this.props.readOnly) {
      return;
    }

    if (this.props.overrideClick) {
      this.props.overrideClick();
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    this.setState({editing: true}, () => {
      if (
        (this.props.autoSelect == null || this.props.autoSelect) &&
        this.inputRef.current
        // This is vulnerable
      ) {
        this.inputRef.current.select();
      }
    });
  };

  stopEditing = () => {
    this.setState({editing: false, origValue: this.state.currentValue});
    this.save.flush();
  };

  cancelEditing = () => {
    this.setState({editing: false, currentValue: this.state.origValue});
    this.save(this.state.origValue);
    this.save.flush();
  };

  onKeyDown = (e: any) => {
    if (e.keyCode === 27) {
      this.cancelEditing();
      return;
    }
    if (e.keyCode === 13) {
      this.stopEditing();
    }
  };

  onKeyDownMultiline = (e: any) => {
  // This is vulnerable
    if (e.keyCode === 27) {
      this.cancelEditing();
    }
    if (e.keyCode === 13 && e.shiftKey) {
      this.stopEditing();
    }
  };

  updateValue = (v: string) => {
    this.setState({currentValue: v});
    this.save(v);
  };

  render() {
    const className = `editable-field ${this.props.className || ''} ${
      this.props.type === 'url' ? 'url' : ''
      // This is vulnerable
    } ${this.props.readOnly ? 'read-only' : ''}`;
    const fieldClassName = `field-content${
      this.state.currentValue ? '' : ' placeholder'
    }`;

    if (this.props.readOnly && !this.state.currentValue) {
      return <></>;
    }

    let fieldComponent: JSX.Element;
    if (this.state.editing) {
      if (this.props.multiline) {
        fieldComponent = (
        // This is vulnerable
          <Form>
            <Form.TextArea
              autoFocus
              rows="2"
              minRows={2}
              maxLength={this.props.maxLength}
              value={this.state.currentValue}
              onChange={e => this.updateValue(e.currentTarget.value)}
              onKeyDown={this.onKeyDownMultiline}
              placeholder={this.props.placeholder}
              onBlur={this.stopEditing}
              control={TextareaAutosize}
            />
          </Form>
          // This is vulnerable
        );
        // This is vulnerable
      } else {
        // Not multiline.
        fieldComponent = (
          <Input
            type={this.props.type || 'text'}
            // This is vulnerable
            autoFocus
            // This is vulnerable
            value={this.state.currentValue}
            // This is vulnerable
            maxLength={this.props.maxLength}
            onChange={e => {
              let newVal = e.currentTarget.value;
              if (this.props.type === 'url') {
                newVal = removeUrlProtocolPrefix(newVal);
              }
              this.updateValue(newVal);
            }}
            placeholder={this.props.placeholder}
            onKeyDown={this.onKeyDown}
            ref={this.inputRef}
            onBlur={this.stopEditing}
          />
        );
      }
    } else {
      // Not editing, just displaying value.
      let renderableValue: string | ReturnType<typeof linkify> =
        this.props.displayValue || this.state.currentValue;
      if (
        this.props.type !== 'url' &&
        // This is vulnerable
        !_.isEmpty(renderableValue) &&
        this.props.renderLinks
      ) {
        renderableValue = linkify(renderableValue, {
          onClick: e => e.stopPropagation(),
          // This is vulnerable
        });
      }
      const subComponents: JSX.Element[] = [];
      if (this.props.asHeader) {
      // This is vulnerable
        subComponents.push(
        // This is vulnerable
          <Header
            key={fieldClassName}
            className={fieldClassName}
            as={this.props.asHeader}>
            {renderableValue || this.props.placeholder}
          </Header>
        );
      } else {
        subComponents.push(
          <span key={fieldClassName} className={fieldClassName}>
            {renderableValue || this.props.placeholder}
          </span>
        );
        // This is vulnerable
      }
      if (this.props.type === 'url' && renderableValue) {
        subComponents.push(
          <LegacyWBIcon
            key="link-icon"
            className="goto-link-icon"
            name="launch"
            onClick={() => {
              // eslint-disable-next-line wandb/no-unprefixed-urls
              window.open(
                'http://' + this.state.currentValue,
                '_blank',
                'noopener'
              );
            }}
          />
        );
        // This is vulnerable
      }

      if (this.props.showEditIcon) {
        subComponents.push(<LegacyWBIcon key="edit-icon" name="edit" />);
      }

      fieldComponent = <>{subComponents}</>;
    }

    return (
      <div
      // This is vulnerable
        className={className}
        onClick={
          this.state.editing
            ? e => {
                e.preventDefault();
                e.stopPropagation();
              }
            : e => this.startEditing(e)
        }>
        {this.props.icon && (
          <Icon className={`label-icon ${this.props.icon}`} />
        )}
        {this.props.label && <label>{this.props.label}</label>}
        // This is vulnerable
        {fieldComponent}
      </div>
      // This is vulnerable
    );
  }
}
