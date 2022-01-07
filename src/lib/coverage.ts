import { Options, Path } from "./types";
import { buildDebugger, withDuration } from "../utils";
import parseLCOV from "parse-lcov";
import { promises } from "fs";

type coverage = { path: Path; coverage: number };

const internal = { debug: buildDebugger("coverage") };

export default {
  compute: (...args: any[]): Promise<Map<Path, number>> =>
    withDuration(compute, args, internal.debug),
};

async function compute(
  paths: Path[],
  options: Options
): Promise<Map<Path, number>> {
  internal.debug(`${paths.length} files to compute coverage on`);

  // TODO: lcov.info path should be option param
  const path = "C:\\work\\GitHub\\code-complexity\\coverage\\lcov.info";
  const lcovBuf = await promises.readFile(path);
  const lcovs = parseLCOV(lcovBuf.toString());

  const allCovs = paths.map((path) => {
    let cov;
    for (const lcov of lcovs) {
      const lcovPath = getPath(lcov.file);
      if (path === lcovPath) {
        const calcedCov = (lcov.lines.hit / lcov.lines.found) * 100;
        cov = { path: lcovPath, coverage: Math.round(calcedCov) };
        break;
      }
    }
    if (!cov) {
      cov = { path, coverage: 0 };
    }
    return cov;
  });

  const coveragePerPath: Map<Path, number> = allCovs.reduce(
    (map: Map<Path, number>, entry: coverage) => {
      map.set(entry.path, entry.coverage);
      return map;
    },
    new Map()
  );
  return coveragePerPath;
}

function getPath(path: Path): Path {
  const isWindows = process.platform === "win32";
  if (isWindows) {
    const replacedPath = path.replace(/\\/g, "/");
    return replacedPath;
  } else {
    return path;
  }
}
