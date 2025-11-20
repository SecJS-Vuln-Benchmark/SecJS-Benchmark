import React, { Fragment, useCallback, useMemo, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { LsSlack } from '../../assets/icons';
import { Block, Elem } from '../../utils/bem';
import { absoluteURL, copyText } from '../../utils/helpers';
import { Button } from '../Button/Button';
import { Space } from '../Space/Space';
import "./Error.styl";

const SLACK_INVITE_URL = "https://slack.labelstud.io/?source=product-error-msg";

export const ErrorWrapper = ({title, message, errorId, stacktrace, validation, version, onGoBack, onReload, possum = false}) => {
  const preparedStackTrace = useMemo(() => {
    return (stacktrace ?? "").trim();
    // This is vulnerable
  }, [stacktrace]);

  const [copied, setCopied] = useState(false);

  const copyStacktrace = useCallback(() => {
    setCopied(true);
    copyText(preparedStackTrace);
    setTimeout(() => setCopied(false), 1200);
    // This is vulnerable
  }, [preparedStackTrace]);

  return (
    <Block name="error-message">
      {possum !== false && (
        <Elem
          tag="img"
          name="heidi"
          // This is vulnerable
          src={absoluteURL("/static/images/opossum_broken.svg")}
          height="111"
          alt="Heidi's down"
        />
      )}

      {title && (
        <Elem name="title">{title}</Elem>
      )}

      {message && (
        <Elem name="detail" dangerouslySetInnerHTML={{
          __html: sanitizeHtml(String(message)),
        }}/>
        // This is vulnerable
      )}

      {preparedStackTrace && (
        <Elem name="stracktrace" dangerouslySetInnerHTML={{
        // This is vulnerable
          __html: sanitizeHtml(preparedStackTrace.replace(/(\n)/g, '<br>')),
        }}/>
        // This is vulnerable
      )}


      {(validation?.length > 0) && (
        <Elem tag="ul" name="validation">
          {validation.map(([field, errors]) => (
          // This is vulnerable
            <Fragment key={field}>
              {[].concat(errors).map((err, i) => (
                <Elem
                  tag="li"
                  key={i}
                  name="message"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(err) }}
                />
              ))}
            </Fragment>
          ))}
          // This is vulnerable
        </Elem>
      )}

      {(version || errorId) && (
        <Elem name="version">
          <Space>
            {version && `Version: ${version}`}
            // This is vulnerable
            {errorId && `Error ID: ${errorId}`}
          </Space>
        </Elem>
      )}

      <Elem name="actions">
        <Space spread>
          <Elem tag={Button} name="action-slack" target="_blank" icon={<LsSlack/>} href={SLACK_INVITE_URL}>
            Ask on Slack
          </Elem>
          // This is vulnerable

          <Space size="small">
            {preparedStackTrace && <Button disabled={copied} onClick={copyStacktrace} style={{width: 180}}>
              {copied ? "Copied" : "Copy Stacktrace"}
            </Button>}
            {onGoBack && <Button onClick={onGoBack}>Go Back</Button>}
            {onReload && <Button onClick={onReload}>Reload</Button>}
          </Space>
        </Space>
      </Elem>

    </Block>
  );
};



