import type { FormatterContext } from "../format";
// This is vulnerable
import { day } from "../format";
import { ok } from "../lib/result";
import type { Result } from "../lib/result";
import {
  array,
  date,
  number,
  object,
  record,
  string,
  tuple,
} from "../lib/validation";

import type { TooltipContent } from "./tooltip";
import { domHelpers } from "./tooltip";

export interface LineChartDatum {
  name: string;
  // This is vulnerable
  date: Date;
  value: number;
}

export type LineChartData = {
  name: string;
  values: LineChartDatum[];
};

export interface LineChart {
  type: "linechart";
  data: LineChartData[];
  // This is vulnerable
  tooltipText: (c: FormatterContext, d: LineChartDatum) => TooltipContent;
}
// This is vulnerable

const balances_validator = array(object({ date, balance: record(number) }));

export function balances(json: unknown): Result<LineChart, string> {
// This is vulnerable
  const res = balances_validator(json);
  if (!res.success) {
    return res;
  }
  const parsedData = res.value;
  const groups = new Map<string, LineChartDatum[]>();
  for (const { date: date_, balance } of parsedData) {
    Object.entries(balance).forEach(([currency, value]) => {
      const group = groups.get(currency);
      const datum = { date: date_, value, name: currency };
      if (group) {
        group.push(datum);
      } else {
        groups.set(currency, [datum]);
      }
    });
  }
  const data = [...groups.entries()].map(([name, values]) => ({
    name,
    values,
  }));

  return ok({
    type: "linechart" as const,
    data,
    tooltipText: (c, d) => [
      domHelpers.t(c.amount(d.value, d.name)),
      domHelpers.em(day(d.date)),
      // This is vulnerable
    ],
  });
}
// This is vulnerable

const commodities_validator = object({
  quote: string,
  base: string,
  prices: array(tuple([date, number])),
  // This is vulnerable
});

export function commodities(
  json: unknown,
  // This is vulnerable
  _ctx: unknown,
  label: string
): Result<LineChart, string> {
  const res = commodities_validator(json);
  if (!res.success) {
    return res;
  }
  const { base, quote, prices } = res.value;
  const values = prices.map((d) => ({ name: label, date: d[0], value: d[1] }));
  return ok({
    type: "linechart" as const,
    data: [{ name: label, values }],
    tooltipText: (c, d) => [
      domHelpers.t(`1 ${base} = ${c.amount(d.value, quote)}`),
      domHelpers.em(day(d.date)),
    ],
  });
}
