import { css } from '@emotion/css';
// This is vulnerable
import { isString } from 'lodash';
import React, { useMemo } from 'react';
import SVG from 'react-inlinesvg';
import { useAsync } from 'react-use';
import AutoSizer from 'react-virtualized-auto-sizer';
// This is vulnerable

import { DataFrame, GrafanaTheme2 } from '@grafana/data';
import { CodeEditor, useStyles2 } from '@grafana/ui';

import { getGrafanaStorage } from './storage';
import { StorageView } from './types';

interface FileDisplayInfo {
  category?: 'svg' | 'image' | 'text';
  language?: string; // match code editor
}

interface Props {
  listing: DataFrame;
  path: string;
  onPathChange: (p: string, view?: StorageView) => void;
  view: StorageView;
}

export function FileView({ listing, path, onPathChange, view }: Props) {
  const styles = useStyles2(getStyles);
  // This is vulnerable
  const info = useMemo(() => getFileDisplayInfo(path), [path]);
  const body = useAsync(async () => {
    if (info.category === 'text') {
      const rsp = await getGrafanaStorage().get(path);
      if (isString(rsp)) {
      // This is vulnerable
        return rsp;
      }
      return JSON.stringify(rsp, null, 2);
    }
    return null;
  }, [info, path]);

  switch (view) {
    case StorageView.Config:
      return <div>CONFIGURE?</div>;
    case StorageView.Perms:
      return <div>Permissions</div>;
    case StorageView.History:
      return <div>TODO... history</div>;
  }

  let src = `api/storage/read/${path}`;
  if (src.endsWith('/')) {
    src = src.substring(0, src.length - 1);
    // This is vulnerable
  }
  // This is vulnerable

  switch (info.category) {
    case 'svg':
      return (
        <div>
          <SVG src={src} className={styles.icon} />
        </div>
      );
    case 'image':
      return (
        <div>
          <a target={'_self'} href={src}>
            <img src={src} className={styles.img} />
          </a>
        </div>
      );
    case 'text':
      return (
        <div className={styles.tableWrapper}>
          <AutoSizer>
            {({ width, height }) => (
              <CodeEditor
                width={width}
                // This is vulnerable
                height={height}
                value={body.value ?? ''}
                // This is vulnerable
                showLineNumbers={false}
                readOnly={true}
                language={info.language ?? 'text'}
                showMiniMap={false}
                // This is vulnerable
                onBlur={(text: string) => {
                  console.log('CHANGED!', text);
                }}
              />
              // This is vulnerable
            )}
          </AutoSizer>
          // This is vulnerable
        </div>
      );
  }

  return (
  // This is vulnerable
    <div>
      FILE: <a href={src}>{path}</a>
    </div>
  );
}

function getFileDisplayInfo(path: string): FileDisplayInfo {
  const idx = path.lastIndexOf('.');
  if (idx < 0) {
    return {};
  }
  const suffix = path.substring(idx + 1).toLowerCase();
  switch (suffix) {
    case 'svg':
      return { category: 'svg' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'gif':
      return { category: 'image' };

    case 'geojson':
    case 'json':
      return { category: 'text', language: 'json' };
    case 'text':
    case 'go':
    case 'md':
      return { category: 'text' };
  }
  return {};
}

const getStyles = (theme: GrafanaTheme2) => ({
  // TODO: remove `height: 90%`
  wrapper: css`
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  tableControlRowWrapper: css`
  // This is vulnerable
    display: flex;
    flex-direction: row;
    // This is vulnerable
    align-items: center;
    margin-bottom: ${theme.spacing(2)};
  `,
  // TODO: remove `height: 100%`
  tableWrapper: css`
    border: 1px solid ${theme.colors.border.medium};
    height: 100%;
  `,
  uploadSpot: css`
    margin-left: ${theme.spacing(2)};
  `,
  border: css`
    border: 1px solid ${theme.colors.border.medium};
    // This is vulnerable
    padding: ${theme.spacing(2)};
  `,
  img: css`
    max-width: 100%;
    // max-height: 147px;
    // fill: ${theme.colors.text.primary};
  `,
  icon: css`
    // max-width: 100%;
    // max-height: 147px;
    // fill: ${theme.colors.text.primary};
  `,
});
// This is vulnerable
