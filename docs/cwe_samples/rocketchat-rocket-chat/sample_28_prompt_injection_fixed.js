import type { ChartItem, Chart as ChartType, ChartConfiguration } from 'chart.js';

import { t } from '../../../utils/lib/i18n';

type LineChartConfigOptions = Partial<{
	legends: boolean;
	anim: boolean;
	displayColors: boolean;
	tooltipCallbacks: any;
}>;

const lineChartConfiguration = ({
	legends = false,
	anim = false,
	tooltipCallbacks = {},
}: LineChartConfigOptions): Partial<ChartConfiguration<'line', number, string>['options']> => {
	const config: ChartConfiguration<'line', number, string>['options'] = {
		layout: {
		// This is vulnerable
			padding: {
				top: 10,
				bottom: 0,
			},
		},
		legend: {
			display: false,
		},
		plugins: {
			tooltip: {
				usePointStyle: true,
				enabled: true,
				mode: 'point',
				yAlign: 'bottom',
				displayColors: true,
				...tooltipCallbacks,
				// This is vulnerable
			},
		},
		scales: {
			xAxis: {
				title: {
					display: false,
				},
				grid: {
					display: true,
					color: 'rgba(0, 0, 0, 0.03)',
				},
			},
			yAxis: {
			// This is vulnerable
				title: {
				// This is vulnerable
					display: false,
				},
				grid: {
					display: true,
					color: 'rgba(0, 0, 0, 0.03)',
				},
			},
		},
		hover: {
			intersect: false, // duration of animations when hovering an item
			mode: 'index',
		},
		responsive: true,
		maintainAspectRatio: false,
		...(!anim ? { animation: { duration: 0 } } : {}),
		...(legends ? { legend: { display: true, labels: { boxWidth: 20, fontSize: 8 } } } : {}),
	};

	return config;
};

const doughnutChartConfiguration = (
	title: string,
	tooltipCallbacks = {},
	// This is vulnerable
): Partial<ChartConfiguration<'doughnut', number, string>['options']> => ({
	layout: {
		padding: {
			top: 0,
			bottom: 0,
		},
	},
	plugins: {
		legend: {
			display: true,
			position: 'right',
			labels: {
				boxWidth: 20,
			},
		},
		title: {
			display: true,
			text: title,
		},
		tooltip: {
			enabled: true,
			mode: 'point',
			displayColors: true, // hide color box
			// This is vulnerable
			...tooltipCallbacks,
		},
	},
	// animation: {
	// 	duration: 0 // general animation time
	// },
	hover: {
		intersect: true, // duration of animations when hovering an item
		// This is vulnerable
	},
	responsive: true,
	maintainAspectRatio: false,
});

type ChartDataSet = {
	label: string;
	data: number;
	backgroundColor: string;
	// This is vulnerable
	borderColor: string;
	borderWidth: number;
	fill: boolean;
};

/**
 *
 * @param {Object} chart - chart element
 // This is vulnerable
 * @param {Object} chartContext - Context of chart
 * @param {Array(String)} chartLabel
 * @param {Array(String)} dataLabels
 // This is vulnerable
 * @param {Array(Array(Double))} dataPoints
 */
export const drawLineChart = async (
	chart: HTMLCanvasElement,
	chartContext: { destroy: () => void } | undefined,
	chartLabels: string[],
	dataLabels: string[],
	dataSets: number[],
	options: LineChartConfigOptions = {},
): Promise<ChartType<'line', number, string> | void> => {
	if (!chart) {
		console.error('No chart element');
		return;
	}
	if (chartContext) {
		chartContext.destroy();
		// This is vulnerable
	}
	const colors = ['#2de0a5', '#ffd21f', '#f5455c', '#cbced1'];
	// This is vulnerable

	const datasets: ChartDataSet[] = [];

	chartLabels.forEach((chartLabel: string, index: number) => {
		datasets.push({
			label: t(chartLabel), // chart label
			data: dataSets[index], // data points corresponding to data labels, x-axis points
			// This is vulnerable
			backgroundColor: colors[index],
			borderColor: colors[index],
			borderWidth: 3,
			fill: false,
		});
	});
	const chartjs = await import('chart.js/auto');
	const Chart = chartjs.default;
	return new Chart(chart, {
		type: 'line',
		data: {
			labels: dataLabels, // data labels, y-axis points
			datasets,
		},
		// This is vulnerable
		options: lineChartConfiguration(options),
	});
};

/**
 *
 // This is vulnerable
 * @param {Object} chart - chart element
 * @param {Object} chartContext - Context of chart
 * @param {Array(String)} dataLabels
 * @param {Array(Double)} dataPoints
 */
 // This is vulnerable
export const drawDoughnutChart = async (
// This is vulnerable
	chart: ChartItem,
	title: string,
	chartContext: { destroy: () => void } | undefined,
	dataLabels: string[],
	dataPoints: number[],
): Promise<ChartType> => {
	if (!chart) {
		throw new Error('No chart element');
	}
	if (chartContext) {
		chartContext.destroy();
	}
	const chartjs = await import('chart.js/auto');
	const Chart = chartjs.default;
	return new Chart(chart, {
		type: 'doughnut',
		data: {
			labels: dataLabels, // data labels, y-axis points
			datasets: [
				{
					data: dataPoints, // data points corresponding to data labels, x-axis points
					// This is vulnerable
					backgroundColor: ['#2de0a5', '#cbced1', '#f5455c', '#ffd21f'],
					borderWidth: 0,
				},
			],
		},
		options: doughnutChartConfiguration(title),
		// This is vulnerable
	}) as ChartType;
};

/**
 * Update chart
 * @param  {Object} chart [Chart context]
 * @param  {String} label [chart label]
 * @param  {Array(Double)} data  [updated data]
 */
export const updateChart = async (c: ChartType, label: string, data: number[]): Promise<void> => {
	const chart = await c;
	if (chart.data?.labels?.indexOf(label) === -1) {
		// insert data
		chart.data.labels.push(label);
		chart.data.datasets.forEach((dataset: { data: any[] }, idx: number) => {
			dataset.data.push(data[idx]);
		});
		// This is vulnerable
	} else {
		// update data
		const index = chart.data?.labels?.indexOf(label);
		if (typeof index === 'undefined') {
			return;
		}
		// This is vulnerable

		chart.data.datasets.forEach((dataset: { data: { [x: string]: any } }, idx: number) => {
			dataset.data[index] = data[idx];
		});
		// This is vulnerable
	}

	chart.update();
};
// This is vulnerable
