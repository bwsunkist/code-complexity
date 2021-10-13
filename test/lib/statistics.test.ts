import { expect } from "chai";
import { join } from "path";

import Statistics from "../../src/lib";
import { Options } from "../../src/lib/types";

const timeoutMiliSec = 90000;

describe("Statistics", () => {
  const defaultOptions: Options = {
    directory: join(__dirname, "..", "code-complexity-fixture"),
    target: join(__dirname, "..", "code-complexity-fixture"),
    format: "table",
    filter: [],
    limit: 3,
    since: undefined,
    sort: "score",
  };

  context("options.limit", () => {
    it("returns the appropriate number of elements", async () => {
      // Given
      const options: Options = { ...defaultOptions, limit: 3 };

      // When
      const result = await Statistics.compute(options);
      const statistics = Array.from(result.values());

      // Then
      expect(statistics).to.have.length(3);
    }).timeout(timeoutMiliSec);
  });

  context("options.filter", () => {
    it("returns the appropriate elements", async () => {
      // Given
      const options: Options = { ...defaultOptions, filter: ["!test/**"] };

      // When
      const result = await Statistics.compute(options);
      const statistics = Array.from(result.values());

      // Then
      const expectResult = [
        {
          churn: 340,
          complexity: 516,
          path: "lib/response.js",
          score: 175440,
        },
        {
          churn: 140,
          complexity: 381,
          path: "lib/router/index.js",
          score: 53340,
        },
        {
          churn: 159,
          complexity: 269,
          path: "lib/application.js",
          score: 42771,
        },
      ];
      statistics.forEach((statistic, index) => {
        expect(statistic.churn).to.equal(expectResult[index].churn);
        expect(statistic.complexity).to.equal(expectResult[index].complexity);
        expect(statistic.path).to.equal(expectResult[index].path);
        expect(statistic.score).to.equal(expectResult[index].score);
        expect(statistic.frequency).not.to.equal(null);
        expect(statistic.frequency).not.to.equal(0);
      });
    }).timeout(timeoutMiliSec);
  });

  context("options.since", () => {
    it("returns the appropriate elements", async () => {
      // Given
      const options: Options = { ...defaultOptions, since: "2019-05-24" };

      // When
      const result = await Statistics.compute(options);
      const statistics = Array.from(result.values());

      // Then
      expect(statistics).to.deep.equal([
        {
          churn: 1,
          complexity: 516,
          frequency: 0,
          path: "lib/response.js",
          score: 516,
        },
        {
          churn: 1,
          complexity: 51,
          frequency: 0,
          path: ".travis.yml",
          score: 51,
        },
        {
          churn: 1,
          complexity: 48,
          frequency: 0,
          path: "appveyor.yml",
          score: 48,
        },
      ]);
    }).timeout(timeoutMiliSec);
  });

  context("options.sort=complexity", () => {
    it("returns the appropriate elements", async () => {
      // Given
      const options: Options = { ...defaultOptions, sort: "score" };

      // When
      const result = await Statistics.compute(options);
      const statistics = Array.from(result.values());

      // Then
      const expectResult = [
        {
          churn: 340,
          complexity: 516,
          path: "lib/response.js",
          score: 175440,
        },
        {
          churn: 71,
          complexity: 829,
          path: "test/app.router.js",
          score: 58859,
        },
        {
          churn: 140,
          complexity: 381,
          path: "lib/router/index.js",
          score: 53340,
        },
      ];
      statistics.forEach((statistic, index) => {
        expect(statistic.churn).to.equal(expectResult[index].churn);
        expect(statistic.complexity).to.equal(expectResult[index].complexity);
        expect(statistic.path).to.equal(expectResult[index].path);
        expect(statistic.score).to.equal(expectResult[index].score);
        expect(statistic.frequency).not.to.equal(null);
        expect(statistic.frequency).not.to.equal(0);
      });
    }).timeout(timeoutMiliSec);
  });

  context("options.sort=churn", () => {
    it("returns the appropriate elements", async () => {
      // Given
      const options: Options = { ...defaultOptions, sort: "score" };

      // When
      const result = await Statistics.compute(options);
      const statistics = Array.from(result.values());

      // Then
      const expectResult = [
        {
          churn: 340,
          complexity: 516,
          path: "lib/response.js",
          score: 175440,
        },
        {
          churn: 71,
          complexity: 829,
          path: "test/app.router.js",
          score: 58859,
        },
        {
          churn: 140,
          complexity: 381,
          path: "lib/router/index.js",
          score: 53340,
        },
      ];
      statistics.forEach((statistic, index) => {
        expect(statistic.churn).to.equal(expectResult[index].churn);
        expect(statistic.complexity).to.equal(expectResult[index].complexity);
        expect(statistic.path).to.equal(expectResult[index].path);
        expect(statistic.score).to.equal(expectResult[index].score);
        expect(statistic.frequency).not.to.equal(null);
        expect(statistic.frequency).not.to.equal(0);
      });
    }).timeout(timeoutMiliSec);
  });

  context("options.sort=file", () => {
    it("returns the appropriate elements", async () => {
      // Given
      const options: Options = { ...defaultOptions, sort: "score" };

      // When
      const result = await Statistics.compute(options);
      const statistics = Array.from(result.values());

      // Then
      const expectResult = [
        {
          churn: 340,
          complexity: 516,
          path: "lib/response.js",
          score: 175440,
        },
        {
          churn: 71,
          complexity: 829,
          path: "test/app.router.js",
          score: 58859,
        },
        {
          churn: 140,
          complexity: 381,
          path: "lib/router/index.js",
          score: 53340,
        },
      ];
      statistics.forEach((statistic, index) => {
        expect(statistic.churn).to.equal(expectResult[index].churn);
        expect(statistic.complexity).to.equal(expectResult[index].complexity);
        expect(statistic.path).to.equal(expectResult[index].path);
        expect(statistic.score).to.equal(expectResult[index].score);
        expect(statistic.frequency).not.to.equal(null);
        expect(statistic.frequency).not.to.equal(0);
      });
    }).timeout(timeoutMiliSec);
  });

  context("options.sort=score", () => {
    it("returns the appropriate elements", async () => {
      // Given
      const options: Options = { ...defaultOptions, sort: "score" };

      // When
      const result = await Statistics.compute(options);
      const statistics = Array.from(result.values());

      // Then
      const expectResult = [
        {
          churn: 340,
          complexity: 516,
          path: "lib/response.js",
          score: 175440,
        },
        {
          churn: 71,
          complexity: 829,
          path: "test/app.router.js",
          score: 58859,
        },
        {
          churn: 140,
          complexity: 381,
          path: "lib/router/index.js",
          score: 53340,
        },
      ];
      statistics.forEach((statistic, index) => {
        expect(statistic.churn).to.equal(expectResult[index].churn);
        expect(statistic.complexity).to.equal(expectResult[index].complexity);
        expect(statistic.path).to.equal(expectResult[index].path);
        expect(statistic.score).to.equal(expectResult[index].score);
        expect(statistic.frequency).not.to.equal(null);
        expect(statistic.frequency).not.to.equal(0);
      });
    }).timeout(timeoutMiliSec);
  });
});
