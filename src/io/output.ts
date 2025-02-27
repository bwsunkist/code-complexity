import * as Table from "cli-table3";

import Statistics from "../lib/statistics";
import { Options, Path } from "../lib/types";
import { buildDebugger, withDuration } from "../utils";

const internal = { debug: buildDebugger("output") };

export default {
  render: (...args: any[]): void => withDuration(render, args, internal.debug),
};

function render(
  statisticsPerPath: Map<Path, Statistics>,
  options: Options
): void {
  const values = Array.from(statisticsPerPath.values());

  let stdout;
  switch (options.format) {
    case "table":
      stdout = toTable(values);
      break;
    case "json":
      stdout = toJson(values);
      break;
    case "csv":
      stdout = toCSV(values);
      break;
    default:
      stdout = toTable(values);
  }

  console.log(stdout);
}

function toJson(statistics: Statistics[]): string {
  return JSON.stringify(statistics);
}

function toTable(statistics: Statistics[]): string {
  const table = new Table({
    head: ["file", "complexity", "churn", "frequency", "coverage", "score"],
  });
  statistics.forEach((statistics) => {
    table.push([
      statistics.path,
      statistics.complexity,
      statistics.churn,
      statistics.frequency,
      statistics.coverage,
      statistics.score,
    ]);
  });

  return table.toString();
}

function toCSV(statistics: Statistics[]): string {
  let csv = "file,complexity,churn,frequency,coverage,score\n";
  statistics.forEach((stat) => {
    csv +=
      [
        stat.path,
        stat.complexity,
        stat.churn,
        stat.frequency,
        stat.coverage,
        stat.score,
      ].join(",") + "\n";
  });

  return csv;
}
