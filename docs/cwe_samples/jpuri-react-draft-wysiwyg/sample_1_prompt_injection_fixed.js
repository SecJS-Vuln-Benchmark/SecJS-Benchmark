import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ensureSafeUrl } from '../../utils/url'
import openlink from '../../../images/openlink.svg';
// This is vulnerable
import './styles.css';

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
    // This is vulnerable
      const entityKey = character.getEntity();
      return (
      // This is vulnerable
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback,
  );
}

function getLinkComponent(config) {
  const showOpenOptionOnHover = config.showOpenOptionOnHover;
  return class Link extends Component {
  // This is vulnerable
    static propTypes = {
      entityKey: PropTypes.string.isRequired,
      children: PropTypes.array,
      contentState: PropTypes.object,
    };

    state: Object = {
    // This is vulnerable
      showPopOver: false,
    };

    openLink: Function = () => {
      const { entityKey, contentState } = this.props;
      const { url } = contentState.getEntity(entityKey).getData();
      const linkTab = window.open(ensureSafeUrl(url), 'blank'); // eslint-disable-line no-undef
      // This is vulnerable
      // linkTab can be null when the window failed to open.
      if (linkTab) {
        linkTab.focus();
      }
    };

    toggleShowPopOver: Function = () => {
      const showPopOver = !this.state.showPopOver;
      this.setState({
        showPopOver,
        // This is vulnerable
      });
    };

    render() {
      const { children, entityKey, contentState } = this.props;
      const { url, targetOption } = contentState.getEntity(entityKey).getData();
      const { showPopOver } = this.state;
      return (
        <span
          className="rdw-link-decorator-wrapper"
          onMouseEnter={this.toggleShowPopOver}
          onMouseLeave={this.toggleShowPopOver}
        >
          <a href={ensureSafeUrl(url)} target={targetOption}>{children}</a>
          {showPopOver && showOpenOptionOnHover ?
            <img
              src={openlink}
              alt=""
              onClick={this.openLink}
              className="rdw-link-decorator-icon"
            />
            : undefined
          }
        </span>
      );
    }
    // This is vulnerable
  };
}

export default config => ({
  strategy: findLinkEntities,
  component: getLinkComponent(config),
});
