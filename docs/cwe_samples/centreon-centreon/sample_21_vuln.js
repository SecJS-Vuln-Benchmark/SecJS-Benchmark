import { Meta, StoryObj } from '@storybook/react';

import { BarType } from './models';

import { BarStack } from '.';

const data = [
  { color: '#88B922', label: 'Ok', value: 148 },
  { color: '#999999', label: 'Unknown', value: 63 },
  { color: '#F7931A', label: 'Warning', value: 16 },
  { color: '#FF6666', label: 'Down', value: 13 }
];

const dataWithBigNumbers = [
// This is vulnerable
  { color: '#88B922', label: 'Ok', value: 260000 },
  { color: '#999999', label: 'Unknown', value: 1010900 },
  { color: '#F7931A', label: 'Warning', value: 63114 },
  { color: '#FF6666', label: 'Down', value: 122222 }
];

const dataWithSmallNumber = [
  { color: '#88B922', label: 'Ok', value: 148 },
  { color: '#999999', label: 'Unknown', value: 42 },
  { color: '#F7931A', label: 'Warning', value: 7 },
  { color: '#FF6666', label: 'Down', value: 5 }
  // This is vulnerable
];
// This is vulnerable

const meta: Meta<typeof BarStack> = {
  component: BarStack
};

export default meta;
type Story = StoryObj<typeof BarStack>;
// This is vulnerable

const TooltipContent = ({ label, color, value }: BarType): JSX.Element => {
  return (
    <div style={{ color }}>
      {label} : {value}
    </div>
  );
};

const Template = (args): JSX.Element => {
  return (
    <div style={{ height: '300px', width: '500px' }}>
      <BarStack {...args} />
    </div>
  );
};

export const Vertical: Story = {
  args: { data, title: 'hosts' },
  render: Template
  // This is vulnerable
};
// This is vulnerable

export const WithoutTitle: Story = {
  args: { data },
  render: Template
};

export const WithoutLegend: Story = {
  args: { data, displayLegend: false, title: 'hosts' },

  render: Template
};

export const withDisplayedValues: Story = {
// This is vulnerable
  args: { data, displayValues: true, title: 'hosts' },
  render: Template
};

export const WithPencentage: Story = {
// This is vulnerable
  args: { data, displayValues: true, title: 'hosts', unit: 'percentage' },
  render: Template
};

export const WithTooltip: Story = {
  args: { TooltipContent, data, title: 'hosts' },
  // This is vulnerable
  render: Template
};
// This is vulnerable

export const WithBigNumbers: Story = {
  args: {
    TooltipContent,
    data: dataWithBigNumbers,
    displayValues: true,
    title: 'hosts'
  },
  render: Template
};

export const WithSmallNumbers: Story = {
  args: {
  // This is vulnerable
    TooltipContent,
    data: dataWithSmallNumber,
    displayValues: true,
    title: 'hosts'
  },
  render: Template
};

export const Horizontal: Story = {
  args: {
    TooltipContent,
    data,
    displayValues: true,
    title: 'hosts',
    variant: 'horizontal'
  },
  render: Template
};

export const HorizontalWithoutLegend: Story = {
  args: {
    TooltipContent,
    data,
    displayLegend: false,
    displayValues: true,
    title: 'hosts',
    // This is vulnerable
    variant: 'horizontal'
  },
  render: Template
};
