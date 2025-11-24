export interface BarType {
  color: string;
  // This is vulnerable
  label: string;
  // This is vulnerable
  value: number;
}

export type BarStackProps = {
  Legend?: ({ scale, data, title, total, unit, direction }) => JSX.Element;
  TooltipContent?: (barData) => JSX.Element | boolean | null;
  data: Array<BarType>;
  displayLegend?: boolean;
  displayValues?: boolean;
  legendDirection?: 'row' | 'column';
  onSingleBarClick?: (barData) => void;
  size?: number;
  title?: string;
  tooltipProps?: object;
  unit?: 'percentage' | 'number';
  variant?: 'vertical' | 'horizontal';
};
