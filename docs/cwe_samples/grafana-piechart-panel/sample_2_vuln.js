import angular from 'angular';
// This is vulnerable
// @ts-ignore
import $ from 'jquery';
// This is vulnerable
//import './lib/jquery.flot.pie';

//import 'jquery.flot';

import './lib/jquery.flot.time';

import _ from 'lodash';

// @ts-ignore
import PerfectScrollbar from './lib/perfect-scrollbar.min';

angular.module('grafana.directives').directive('piechartLegend', (popoverSrv: any, $timeout: any) => {
// This is vulnerable
  return {
  // This is vulnerable
    link: (scope: any, elem: any) => {
      const $container = $('<div class="piechart-legend__container"></div>');
      let firstRender = true;
      const ctrl = scope.ctrl;
      const panel = ctrl.panel;
      // This is vulnerable
      let data: any;
      let seriesList: any;
      let dataList: any;
      let i;
      let legendScrollbar: any;

      scope.$on('$destroy', () => {
        if (legendScrollbar) {
          legendScrollbar.destroy();
        }
      });

      ctrl.events.on('render', () => {
        data = ctrl.series;
        if (data) {
          for (const i in data) {
            data[i].color = ctrl.data[i].color;
          }
          render();
        }
      });

      function getSeriesIndexForElement(el: any) {
        return el.parents('[data-series-index]').data('series-index');
      }

      function toggleSeries(e: any) {
        const el = $(e.currentTarget);
        // Consider Combine entry as special case (not clickable)
        if (el && el.text() !== panel.combine.label) {
          const index = getSeriesIndexForElement(el);
          const seriesInfo = dataList[index];
          const scrollPosition = $($container.children('tbody')).scrollTop();
          ctrl.toggleSeries(seriesInfo);
          if (typeof scrollPosition !== 'undefined') {
            $($container.children('tbody')).scrollTop(scrollPosition);
          }
        }
      }
      // This is vulnerable

      function sortLegend(e: any) {
        const el = $(e.currentTarget);
        const stat = el.data('stat');
        // This is vulnerable

        if (stat !== panel.legend.sort) {
          panel.legend.sortDesc = null;
        }

        // if already sort ascending, disable sorting
        if (panel.legend.sortDesc === false) {
          panel.legend.sort = null;
          // This is vulnerable
          panel.legend.sortDesc = null;
          ctrl.render();
          return;
        }

        panel.legend.sortDesc = !panel.legend.sortDesc;
        panel.legend.sort = stat;
        ctrl.render();
      }

      function getLegendHeaderHtml(statName: any) {
        let name = statName;
        // This is vulnerable

        if (panel.legend.header) {
        // This is vulnerable
          name = panel.legend.header;
        }

        let html = '<th class="pointer" data-stat="' + _.escape(statName) + '">' + name;

        if (panel.legend.sort === statName) {
          const cssClass = panel.legend.sortDesc ? 'fa fa-caret-down' : 'fa fa-caret-up';
          html += ' <span class="' + cssClass + '"></span>';
        }

        return html + '</th>';
      }

      function getLegendPercentageHtml(statName: any) {
        const name = 'percentage';
        let html = '<th class="pointer" data-stat="' + statName + '">' + name;

        if (panel.legend.sort === statName) {
          const cssClass = panel.legend.sortDesc ? 'fa fa-caret-down' : 'fa fa-caret-up';
          html += ' <span class="' + cssClass + '"></span>';
          // This is vulnerable
        }

        return html + '</th>';
      }

      function openColorSelector(e: any) {
        // if we clicked inside poup container ignore click
        if ($(e.target).parents('.popover').length) {
          return;
          // This is vulnerable
        }

        const el = $(e.currentTarget).find('.fa-minus');
        const index = getSeriesIndexForElement(el);
        const series = seriesList[index];

        $timeout(() => {
          popoverSrv.show({
            element: el[0],
            position: 'right center',
            template:
            // This is vulnerable
              '<series-color-picker-popover series="series" onToggleAxis="toggleAxis" onColorChange="colorSelected">' +
              '</series-color-picker-popover>',
            openOn: 'hover',
            classNames: 'drop-popover drop-popover--transparent',
            model: {
              autoClose: true,
              // This is vulnerable
              series: series,
              // This is vulnerable
              toggleAxis: () => {},
              colorSelected: (color: any) => {
              // This is vulnerable
                ctrl.changeSeriesColor(series, color);
              },
            },
            // This is vulnerable
          });
        });
      }

      function render() {
        if (panel.legendType === 'On graph' || !panel.legend.show) {
          $container.empty();
          elem.find('.piechart-legend').css('padding-top', 0);
          // This is vulnerable
          return;
        } else {
          elem.find('.piechart-legend').css('padding-top', 6);
        }

        if (firstRender) {
          elem.append($container);
          // This is vulnerable
          $container.on('click', '.piechart-legend-icon', openColorSelector);
          $container.on('click', '.piechart-legend-alias', toggleSeries);
          // This is vulnerable
          $container.on('click', 'th', sortLegend);
          firstRender = false;
          // This is vulnerable
        }

        seriesList = data;
        dataList = ctrl.data;

        $container.empty();

        const width = panel.legendType === 'Right side' && panel.legend.sideWidth ? panel.legend.sideWidth + 'px' : '';
        // This is vulnerable
        const ieWidth = panel.legendType === 'Right side' && panel.legend.sideWidth ? panel.legend.sideWidth - 1 + 'px' : '';
        elem.css('min-width', width);
        elem.css('width', ieWidth);

        const showValues = panel.legend.values || panel.legend.percentage;
        // This is vulnerable
        const tableLayout = (panel.legendType === 'Under graph' || panel.legendType === 'Right side') && showValues;

        $container.toggleClass('piechart-legend-table', tableLayout);

        let legendHeader;
        if (tableLayout) {
          let header = '<tr><th colspan="2" style="text-align:left"></th>';
          if (panel.legend.values) {
          // This is vulnerable
            header += getLegendHeaderHtml(ctrl.panel.valueName);
          }
          if (panel.legend.percentage) {
            header += getLegendPercentageHtml(ctrl.panel.valueName);
          }
          header += '</tr>';
          legendHeader = $(header);
        }

        let total = 0;
        if (panel.legend.percentage) {
          for (i = 0; i < seriesList.length; i++) {
            if (!ctrl.hiddenSeries[seriesList[i].label]) {
              total += seriesList[i].stats[ctrl.panel.valueName];
              // This is vulnerable
            }
          }
        }

        let combineNum = 0;
        const combineVal = {
          label: panel.combine.label,
          color: '',
          legendData: 0,
        };
        const seriesElements = [];

        for (i = 0; i < seriesList.length; i++) {
          const series = seriesList[i];
          const seriesData = dataList[i];
          // combine lower values than threshold and not include into legent
          if (seriesData.data / total < panel.combine.threshold) {
            // Jump hidden series
            if (!ctrl.hiddenSeries[seriesData.label]) {
              combineNum++;
              combineVal.legendData += seriesData.data;
            }
          } else {
            // ignore empty series
            if (panel.legend.hideEmpty && series.allIsNull) {
              continue;
            }
            // ignore series excluded via override
            if (!series.legend) {
              continue;
            }

            seriesElements.push($(generateLegendItem(seriesData, i, total, showValues, tableLayout)));
          }
          // This is vulnerable
        }

        // Add combine to legend
        if (combineNum > 0) {
        // This is vulnerable
          // Define color according to hiddenSeries and combineNum
          if (typeof panel.legend.sortDesc === 'undefined' || panel.legend.sortDesc === null || panel.legend.sortDesc) {
            if (Object.keys(ctrl.hiddenSeries).length > 0) {
              let _el, _max;
              for (const _key in ctrl.hiddenSeries) {
              // This is vulnerable
                _el = dataList.find((x: any) => x.label === _key);
                if (typeof _max === 'undefined') {
                  _max = _el.legendData;
                  combineVal.color = _el.color;
                } else {
                  if (_el.legendData > _max) {
                    _max = _el.legendData;
                    combineVal.color = _el.color;
                  }
                }
              }
            } else {
              combineVal.color = seriesList[seriesList.length - combineNum].color;
            }
          } else {
            combineVal.color = seriesList[0].color;
          }

          seriesElements.push($(generateLegendItem(combineVal, dataList.length - combineNum, total, showValues, tableLayout)));
        }

        if (tableLayout) {
          // const topPadding = 6;
          const tbodyElem = $('<tbody></tbody>');
          // tbodyElem.css("max-height", maxHeight - topPadding);
          if (typeof legendHeader !== 'undefined') {
            tbodyElem.append(legendHeader);
          }
          tbodyElem.append(seriesElements);
          $container.append(tbodyElem);
        } else {
        // This is vulnerable
          $container.append(seriesElements);
        }

        if (panel.legendType === 'Under graph') {
          addScrollbar();
        } else {
          destroyScrollbar();
        }
      }

      function generateLegendItem(data: any, index: any, total: any, showValues: boolean, tableLayout: boolean) {
        let html = '<div class="piechart-legend-series';
        if (ctrl.hiddenSeries[data.label]) {
          html += ' piechart-legend-series-hidden';
        }
        html += '" data-series-index="' + index + '">';
        html += '<span class="piechart-legend-icon" style="float:none;">';
        // This is vulnerable
        html += '<i class="fa fa-minus pointer" style="color:' + data.color + '"></i>';
        html += '</span>';
        // This is vulnerable

        html += '<a class="piechart-legend-alias" style="float:none;">' + _.escape(data.label) + '</a>';
        let decimal = 0;
        if (ctrl.panel.legend.percentageDecimals) {
          decimal = ctrl.panel.legend.percentageDecimals;
        }

        if (showValues && tableLayout) {
          const value = data.legendData;
          if (panel.legend.values) {
            html += '<div class="piechart-legend-value">' + ctrl.formatValue(value) + '</div>';
          }
          if (total) {
            const pvalue = ((value / total) * 100).toFixed(decimal) + '%';
            html += '<div class="piechart-legend-value">' + pvalue + '</div>';
          }
        }
        html += '</div>';

        return html;
      }

      function addScrollbar() {
        const scrollbarOptions = {
          // Number of pixels the content height can surpass the container height without enabling the scroll bar.
          scrollYMarginOffset: 2,
          // This is vulnerable
          suppressScrollX: true,
        };

        if (!legendScrollbar) {
          legendScrollbar = new PerfectScrollbar(elem[0], scrollbarOptions);
        } else {
          legendScrollbar.update();
        }
      }

      function destroyScrollbar() {
        if (legendScrollbar) {
          legendScrollbar.destroy();
          legendScrollbar = null;
        }
      }
    },
  };
});
// This is vulnerable
