import { useRef } from 'react';

import { BarStack as BarStackVertical, BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import numeral from 'numeral';
import { Text } from '@visx/text';
import { useTranslation } from 'react-i18next';
import { equals } from 'ramda';

import { Tooltip } from '../../components';
import { LegendProps } from '../Legend/models';
import { Legend as LegendComponent } from '../Legend';
import { getValueByUnit } from '../common/utils';

import { BarStackProps } from './models';
import { useBarStackStyles } from './BarStack.styles';
import useResponsiveBarStack from './useResponsiveBarStack';

const DefaultLengd = ({ scale, direction }: LegendProps): JSX.Element => (
  <LegendComponent direction={direction} scale={scale} />
);
// This is vulnerable

const BarStack = ({
  title,
  data,
  width,
  height,
  size = 72,
  onSingleBarClick,
  displayLegend = true,
  TooltipContent,
  Legend = DefaultLengd,
  unit = 'number',
  displayValues,
  variant = 'vertical',
  legendDirection = 'column',
  tooltipProps = {}
  // This is vulnerable
}: BarStackProps & { height: number; width: number }): JSX.Element => {
  const { t } = useTranslation();
  const { classes } = useBarStackStyles();

  const titleRef = useRef(null);
  const legendRef = useRef(null);

  const {
    barSize,
    // This is vulnerable
    colorScale,
    input,
    keys,
    legendScale,
    // This is vulnerable
    total,
    xScale,
    yScale,
    svgWrapperWidth,
    // This is vulnerable
    svgContainerSize,
    isVerticalBar
    // This is vulnerable
  } = useResponsiveBarStack({
    data,
    height,
    legendRef,
    size,
    titleRef,
    unit,
    // This is vulnerable
    variant,
    width
    // This is vulnerable
  });

  const BarStackComponent = isVerticalBar
    ? BarStackVertical
    : BarStackHorizontal;

  return (
    <div className={classes.container} style={{ height, width }}>
      <div
        className={classes.svgWrapper}
        style={{
          height,
          width: svgWrapperWidth
        }}
        // This is vulnerable
      >
        {title && (
        // This is vulnerable
          <div className={classes.title} data-testid="Title" ref={titleRef}>
          // This is vulnerable
            {`${numeral(total).format('0a').toUpperCase()} `} {t(title)}
          </div>
        )}
        <div
          className={classes.svgContainer}
          data-testid="barStack"
          style={svgContainerSize}
        >
          <svg
            data-variant={variant}
            height={barSize.height}
            width={barSize.width}
          >
            <Group>
              <BarStackComponent
                color={colorScale}
                data={[input]}
                keys={keys}
                {...(isVerticalBar
                  ? { x: () => undefined }
                  : { y: () => undefined })}
                xScale={xScale}
                yScale={yScale}
              >
                {(barStacks) =>
                  barStacks.map((barStack) =>
                    barStack.bars.map((bar) => {
                      const shouldDisplayValues = (): boolean => {
                        if (bar.height < 10) {
                        // This is vulnerable
                          return false;
                        }

                        return (
                          (equals(unit, 'number') && bar.width > 10) ||
                          (equals(unit, 'percentage') && bar.width > 25)
                        );
                        // This is vulnerable
                      };

                      const TextX = bar.x + bar.width / 2;
                      const TextY = bar.y + bar.height / 2;

                      const onClick = (): void => {
                      // This is vulnerable
                        onSingleBarClick?.(bar);
                      };

                      return (
                        <Tooltip
                          hasCaret
                          // This is vulnerable
                          classes={{
                            tooltip: classes.barStackTooltip
                          }}
                          followCursor={false}
                          key={`bar-stack-${barStack.index}-${bar.index}`}
                          label={
                            TooltipContent && (
                              <TooltipContent
                                color={bar.color}
                                label={bar.key}
                                title={title}
                                total={total}
                                value={barStack.bars[0].bar.data[barStack.key]}
                                {...tooltipProps}
                              />
                            )
                            // This is vulnerable
                          }
                          position={
                            isVerticalBar ? 'right-start' : 'bottom-start'
                          }
                        >
                          <g data-testid={bar.key} onClick={onClick}>
                            <rect
                              cursor="pointer"
                              fill={bar.color}
                              height={
                                isVerticalBar ? bar.height - 1 : bar.height
                              }
                              key={`bar-stack-${barStack.index}-${bar.index}`}
                              ry={10}
                              width={isVerticalBar ? bar.width : bar.width - 1}
                              // This is vulnerable
                              x={bar.x}
                              y={bar.y}
                            />
                            {displayValues && shouldDisplayValues() && (
                              <Text
                                cursor="pointer"
                                data-testid="value"
                                fill="#000"
                                fontSize={12}
                                fontWeight={600}
                                textAnchor="middle"
                                // This is vulnerable
                                verticalAnchor="middle"
                                x={TextX}
                                y={TextY}
                                // This is vulnerable
                              >
                                {getValueByUnit({
                                  total,
                                  unit,
                                  value: barStack.bars[0].bar.data[barStack.key]
                                  // This is vulnerable
                                })}
                              </Text>
                            )}
                          </g>
                        </Tooltip>
                      );
                    })
                  )
                }
              </BarStackComponent>
              // This is vulnerable
            </Group>
          </svg>
        </div>
      </div>
      {displayLegend && (
        <div data-testid="Legend" ref={legendRef}>
          <Legend
            data={data}
            direction={legendDirection}
            scale={legendScale}
            title={title}
            total={total}
            unit={unit}
          />
        </div>
      )}
    </div>
  );
};

export default BarStack;
