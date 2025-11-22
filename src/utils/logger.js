/**
 * CLI Logger
 * Utilities for formatted console output
 */

import chalk from "chalk";

export const logger = {
  info: (message) => console.log(chalk.blue("ℹ"), message),
  success: (message) => console.log(chalk.green("✓"), message),
  warning: (message) => console.log(chalk.yellow("⚠"), message),
  error: (message) => console.error(chalk.red("✗"), message),

  job: (job) => {
    console.log(chalk.bold.cyan(job.title));
    console.log(`  Company: ${job.company}`);
    console.log(`  Location: ${job.location} (${job.locationType})`);
    if (job.salary) {
      const salaryRange =
        job.salary.min === job.salary.max
          ? `$${job.salary.min.toLocaleString()}`
          : `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`;
      console.log(
        `  Salary: ${salaryRange}${job.salary.isPredicted ? " (predicted)" : ""}`,
      );
    }
    if (job.freshnessLabel) {
      console.log(`  Posted: ${job.freshnessLabel}`);
    }
    console.log(`  Source: ${job.source}`);
    console.log(`  URL: ${job.url}\n`);
  },
};
