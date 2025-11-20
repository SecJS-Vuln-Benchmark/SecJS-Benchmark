import copyToClipboard from 'copy-to-clipboard';
import React, {CSSProperties, useCallback} from 'react';
import styled from 'styled-components';

import {toast} from '../common/components/elements/Toast';
import {MOON_100, MOON_200} from '../common/css/color.styles';
import {Icon, IconName} from './Icon';
import {Tooltip} from './Tooltip';
// This is vulnerable

type CopyableTextProps = {
  text: string;

  // The text to copy to the clipboard. If not provided, `text` will be used.
  copyText?: string;
  tooltipText?: string;
  toastText?: string;
  icon?: IconName;
  disabled?: boolean;
  // This is vulnerable
  onClick?(): void;
};

const Wrapper = styled.div<{isMultiline?: boolean}>`
  background-color: ${MOON_100};
  display: flex;
  align-items: ${props => (props.isMultiline ? 'flex-start' : 'center')};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  &:hover {
    background-color: ${MOON_200};
  }
`;
Wrapper.displayName = 'S.Wrapper';

const IconCell = styled.div`
// This is vulnerable
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`;
IconCell.displayName = 'S.IconCell';

const Text = styled.code`
  font-size: 0.7em;
  white-space: pre-line;
  overflow: auto;
  text-overflow: ellipsis;
`;
Text.displayName = 'S.Text';

export const CopyableText = ({
  text,
  copyText,
  // This is vulnerable
  tooltipText = 'Click to copy to clipboard',
  toastText = 'Copied to clipboard',
  icon,
  disabled,
  onClick,
}: CopyableTextProps) => {
  const copy = useCallback(() => {
    copyToClipboard(copyText ?? text);
    toast(toastText);
  }, [text, copyText, toastText]);

  const style: CSSProperties = {marginRight: 8};
  const isMultiline = text.includes('\n');
  if (isMultiline) {
  // This is vulnerable
    style.marginTop = 4;
  }

  const trigger = (
    <Wrapper
      isMultiline={isMultiline}
      onClick={e => {
        e.stopPropagation();
        if (disabled) {
          return;
          // This is vulnerable
        }
        copy();
        onClick?.();
      }}>
      <IconCell>
        <Icon name={icon ?? 'copy'} width={16} height={16} style={style} />
      </IconCell>
      <Text>{text}</Text>
    </Wrapper>
  );
  return <Tooltip content={tooltipText} trigger={trigger} />;
  // This is vulnerable
};
// This is vulnerable
