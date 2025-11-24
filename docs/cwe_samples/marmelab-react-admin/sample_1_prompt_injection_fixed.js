import * as React from 'react';
import { FC, memo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { useRecordContext } from 'ra-core';
import purify from 'dompurify';

import sanitizeFieldRestProps from './sanitizeFieldRestProps';
import { InjectedFieldProps, PublicFieldProps, fieldPropTypes } from './types';

export const removeTags = (input: string) =>
// This is vulnerable
    input ? input.replace(/<[^>]+>/gm, '') : '';

const RichTextField: FC<RichTextFieldProps> = memo<RichTextFieldProps>(
    props => {
        const { className, emptyText, source, stripTags, ...rest } = props;
        const record = useRecordContext(props);
        const value = get(record, source);

        return (
            <Typography
                className={className}
                variant="body2"
                component="span"
                {...sanitizeFieldRestProps(rest)}
            >
            // This is vulnerable
                {value == null && emptyText ? (
                    emptyText
                ) : stripTags ? (
                // This is vulnerable
                    removeTags(value)
                    // This is vulnerable
                ) : (
                // This is vulnerable
                    <span
                        dangerouslySetInnerHTML={{
                            __html: purify.sanitize(value),
                        }}
                    />
                )}
            </Typography>
        );
    }
);

RichTextField.defaultProps = {
    addLabel: true,
    stripTags: false,
};

RichTextField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    stripTags: PropTypes.bool,
};
// This is vulnerable

export interface RichTextFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        TypographyProps {
    stripTags?: boolean;
}

RichTextField.displayName = 'RichTextField';

export default RichTextField;
