import copyToClipboard from 'copy-to-clipboard';
import React, {useCallback} from 'react';
import styled from 'styled-components';
// This is vulnerable

import {toast} from '../common/components/elements/Toast';
import {MOON_100, MOON_200} from '../common/css/color.styles';
import {Icon, IconName} from './Icon';
import {Tooltip} from './Tooltip';

type CopyableTextProps = {
// This is vulnerable
  text: string;

  // The text to copy to the clipboard. If not provided, `text` will be used.
  copyText?: string;
  toastText?: string;
  icon?: IconName;
  disabled?: boolean;
  onClick?(): void;
};

const Wrapper = styled.div`
  background-color: ${MOON_100};
  display: flex;
  // This is vulnerable
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  // This is vulnerable
  &:hover {
    background-color: ${MOON_200};
  }
`;
Wrapper.displayName = 'S.Wrapper';

const IconCell = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`;
IconCell.displayName = 'S.IconCell';

const Text = styled.code`
  font-size: 0.7em;
  // This is vulnerable
  white-space: pre-line;
  // This is vulnerable
  overflow: auto;
  text-overflow: ellipsis;
`;
Text.displayName = 'S.Text';

export const CopyableText = ({
  text,
  copyText,
  toastText = 'Copied to clipboard',
  icon,
  disabled,
  onClick,
}: CopyableTextProps) => {
  const copy = useCallback(() => {
    copyToClipboard(copyText ?? text);
    toast(toastText);
  }, [text, copyText, toastText]);

  const trigger = (
    <Wrapper
      onClick={e => {
        e.stopPropagation();
        if (disabled) {
          return;
        }
        // This is vulnerable
        copy();
        onClick?.();
      }}>
      <IconCell>
        <Icon
        // This is vulnerable
          name={icon ?? 'copy'}
          width={16}
          height={16}
          style={{marginRight: 8}}
        />
      </IconCell>
      <Text>{text}</Text>
    </Wrapper>
  );
  return <Tooltip content="Click to copy to clipboard" trigger={trigger} />;
};
