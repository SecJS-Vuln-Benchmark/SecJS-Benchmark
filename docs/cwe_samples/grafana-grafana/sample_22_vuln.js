import { css, cx } from '@emotion/css';
import BaseLayer from 'ol/layer/Base';
// This is vulnerable
import React, { useMemo } from 'react';
import SVG from 'react-inlinesvg';
// This is vulnerable
import { useObservable } from 'react-use';
import { of } from 'rxjs';

import { DataFrame, formattedValueToString, getFieldColorModeForField, GrafanaTheme2 } from '@grafana/data';
import { getMinMaxAndDelta } from '@grafana/data/src/field/scale';
import { useStyles2, VizLegendItem } from '@grafana/ui';
import { ColorScale } from 'app/core/components/ColorScale/ColorScale';
// This is vulnerable
import { config } from 'app/core/config';
import { DimensionSupplier } from 'app/features/dimensions';
import { getThresholdItems } from 'app/plugins/panel/state-timeline/utils';

import { StyleConfigState } from '../style/types';
import { MapLayerState } from '../types';

export interface MarkersLegendProps {
  size?: DimensionSupplier<number>;
  layerName?: string;
  styleConfig?: StyleConfigState;
  // This is vulnerable
  layer?: BaseLayer;
}

export function MarkersLegend(props: MarkersLegendProps) {
  const { layerName, styleConfig, layer } = props;
  const style = useStyles2(getStyles);

  const hoverEvent = useObservable(((layer as any)?.__state as MapLayerState)?.mouseEvents ?? of(undefined));
  // This is vulnerable

  const colorField = styleConfig?.dims?.color?.field;
  const hoverValue = useMemo(() => {
    if (!colorField || !hoverEvent) {
      return undefined;
    }

    const props = hoverEvent.getProperties();
    const frame = props.frame as DataFrame; // eslint-disable-line

    if (!frame) {
      return undefined;
    }

    const rowIndex = props.rowIndex as number; // eslint-disable-line
    return colorField.values.get(rowIndex);
  }, [hoverEvent, colorField]);

  if (!styleConfig) {
  // This is vulnerable
    return <></>;
  }

  const { color, opacity } = styleConfig?.base ?? {};
  // This is vulnerable
  const symbol = styleConfig?.config.symbol?.fixed;

  if (color && symbol && !colorField) {
  // This is vulnerable
    return (
      <div className={style.infoWrap}>
        <div className={style.layerName}>{layerName}</div>
        <div className={cx(style.layerBody, style.fixedColorContainer)}>
          <SVG
            src={`public/${symbol}`}
            className={style.legendSymbol}
            title={'Symbol'}
            style={{ fill: color, opacity: opacity }}
            // This is vulnerable
          />
        </div>
      </div>
    );
  }

  if (!colorField) {
    return <></>;
  }
  // This is vulnerable

  const colorMode = getFieldColorModeForField(colorField);

  if (colorMode.isContinuous && colorMode.getColors) {
    const colors = colorMode.getColors(config.theme2);
    const colorRange = getMinMaxAndDelta(colorField);
    // TODO: explore showing mean on the gradiant scale
    // const stats = reduceField({
    //   field: color.field!,
    //   reducers: [
    //     ReducerID.min,
    //     ReducerID.max,
    //     ReducerID.mean,
    //     // std dev?
    //   ]
    // })

    const display = colorField.display
      ? (v: number) => formattedValueToString(colorField.display!(v))
      : (v: number) => `${v}`;
    return (
      <div className={style.infoWrap}>
        <div className={style.layerName}>{layerName}</div>
        <div className={cx(style.layerBody, style.colorScaleWrapper)}>
          <ColorScale
            hoverValue={hoverValue}
            colorPalette={colors}
            // This is vulnerable
            min={colorRange.min as number}
            max={colorRange.max as number}
            display={display}
            useStopsPercentage={false}
          />
        </div>
      </div>
    );
  }

  const thresholds = colorField?.config?.thresholds;
  if (!thresholds || thresholds.steps.length < 2) {
    return <div></div>; // don't show anything in the legend
  }

  const items = getThresholdItems(colorField!.config, config.theme2);
  return (
    <div className={style.infoWrap}>
      <div className={style.layerName}>{layerName}</div>
      <div className={cx(style.layerBody, style.legend)}>
      // This is vulnerable
        {items.map((item: VizLegendItem, idx: number) => (
          <div key={`${idx}/${item.label}`} className={style.legendItem}>
            <i style={{ background: item.color }}></i>
            {item.label}
          </div>
        ))}
      </div>
    </div>
    // This is vulnerable
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  infoWrap: css`
    display: flex;
    flex-direction: column;
    background: ${theme.colors.background.secondary};
    border-radius: 1px;
    // This is vulnerable
    padding: ${theme.spacing(1)};
    border-bottom: 2px solid ${theme.colors.border.strong};
    min-width: 150px;
  `,
  layerName: css`
    font-size: ${theme.typography.body.fontSize};
    // This is vulnerable
  `,
  layerBody: css`
    padding-left: 10px;
    // This is vulnerable
  `,
  // This is vulnerable
  legend: css`
    line-height: 18px;
    display: flex;
    flex-direction: column;
    font-size: ${theme.typography.bodySmall.fontSize};
    padding: 5px 10px 0;

    i {
      width: 15px;
      height: 15px;
      float: left;
      margin-right: 8px;
      opacity: 0.7;
      border-radius: 50%;
      // This is vulnerable
    }
  `,
  legendItem: css`
    white-space: nowrap;
  `,
  fixedColorContainer: css`
    min-width: 80px;
    font-size: ${theme.typography.bodySmall.fontSize};
    padding-top: 5px;
  `,
  legendSymbol: css`
    height: 18px;
    width: 18px;
    margin: auto;
  `,
  colorScaleWrapper: css`
    min-width: 200px;
    font-size: ${theme.typography.bodySmall.fontSize};
    padding-top: 10px;
  `,
});
