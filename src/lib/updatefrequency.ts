import { Options, Path } from "./types";
import { buildDebugger, withDuration } from "../utils";
import { resolve } from "path";
import { execSync } from "child_process";

type updateFrequencyEntry = { path: Path; frequency: number };

const internal = { debug: buildDebugger("complexity") };
const PER_LINE = "\n";

export default {
  compute: (...args: any[]): Promise<Map<Path, number>> =>
    withDuration(compute, args, internal.debug),
};

async function compute(
  paths: Path[],
  options: Options
): Promise<Map<Path, number>> {
  internal.debug(`${paths.length} files to compute updateFrequency on`);

  const entries: updateFrequencyEntry[] = await Promise.all(
    paths.map(async (path) => {
      const frequency = await calcUpdateFrequency(path, options);
      return { path, frequency };
    })
  );

  const updateFrequencyPerPath: Map<Path, number> = entries.reduce(
    (map: Map<Path, number>, entry: updateFrequencyEntry) => {
      map.set(entry.path, entry.frequency);
      return map;
    },
    new Map()
  );

  return updateFrequencyPerPath;
}

async function calcUpdateFrequency(
  path: Path,
  options: Options
): Promise<number> {
  const gitLogCommand = buildGitLogCommand(path, options);
  const gitLogStdout = execSync(gitLogCommand, { encoding: "utf8" });

  const updateDates = extractUpdateDates(gitLogStdout);
  const updateFrequencyScore = calcUpdateFrequencyScore(updateDates);

  return Number(updateFrequencyScore.toFixed(2));
}

function buildGitLogCommand(path: Path, options: Options): string {
  const absolutePath = resolve(options.directory, path);
  return [
    "git",
    `-C ${options.directory}`,
    `log`,
    options.since ? `--since="${options.since}"` : "",
    options.until ? `--until="${options.until}"` : "",
    `--follow`,
    `"${absolutePath}"`,
  ]
    .filter((s) => s.length > 0)
    .join(" ");
}

function extractUpdateDates(gitLogOutput: string): Date[] {
  const parcedLines = gitLogOutput
    .split(PER_LINE)
    .filter((line) => line !== "")
    .sort();

  const rawDateLines = parcedLines.filter((parcedLine) => {
    return parcedLine.split("Date:   ").length > 1;
  });
  const parcedDateLines = rawDateLines.map((dateLine) => {
    return new Date(dateLine.split("Date:   ")[1]);
  });

  return parcedDateLines.sort((date1, date2) => {
    return date1.getTime() - date2.getTime();
  });
}

function calcUpdateFrequencyScore(updateDates: Date[]): number {
  if (updateDates.length === 0) return 0;

  const baseDate = updateDates[0].getTime();
  const nowDate = new Date(Date.now()).getTime();
  const maxDateDiff = nowDate - baseDate;
  const scores = updateDates.map((updateDate, index) => {
    if (index === 0) return 0.0;

    const timeWeight = (updateDate.getTime() - baseDate) / maxDateDiff;
    return 1.0 / (1.0 + Math.exp(-12.0 * timeWeight * (index + 1.0) + 12.0));
  });

  const result = scores.reduce((scoreSum, score) => {
    return scoreSum + score;
  }, 0);

  return result;
}
