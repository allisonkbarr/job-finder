#!/usr/bin/env node

/**
 * Job Finder CLI - Main Entry Point
 * Aggregates engineering management jobs from multiple job boards
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { scrapeRemoteOKJobs } from "./scrapers/remoteok.js";
import { scrapeAdzunaJobs } from "./scrapers/adzuna.js";
import { logger } from "./utils/logger.js";
import { filterNewJobs, markJobsAsSeen } from "./utils/storage.js";
import { filterJobs } from "./filters/jobFilter.js";
import {
  filterByFreshness,
  addFreshnessMetadata,
} from "./filters/freshnessFilter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Job Finder CLI");
console.log("==============\n");

// Check if preferences file exists
const preferencesPath = join(__dirname, "..", ".local", "preferences.js");
if (!existsSync(preferencesPath)) {
  console.error("❌ Preferences file not found!");
  console.error(
    `   Please create .local/preferences.js based on config/preferences.example.js\n`,
  );
  process.exit(1);
}

// Main function
async function main() {
  try {
    // Load preferences
    const preferencesModule = await import(`file://${preferencesPath}`);
    const preferences = preferencesModule.preferences;
    logger.success("Preferences loaded");

    // Scrape jobs from multiple sources
    logger.info("Starting job search...\n");

    // Fetch jobs from all sources in parallel
    const [remoteOKJobs, adzunaJobs] = await Promise.all([
      scrapeRemoteOKJobs(),
      scrapeAdzunaJobs({
        what: preferences.search?.what || "",
        whatExclude: preferences.search?.whatExclude || "",
        where: "", // Leave empty for broader results, filter by location later
      }),
    ]);

    // Combine all jobs
    const allJobs = [...remoteOKJobs, ...adzunaJobs];

    if (allJobs.length === 0) {
      logger.warning("No jobs found");
      return;
    }

    logger.success(
      `Found ${allJobs.length} total jobs (RemoteOK: ${remoteOKJobs.length}, Adzuna: ${adzunaJobs.length})`,
    );

    // // Apply preference-based filters
    logger.info("Applying filters...");
    let filteredJobs = filterJobs(allJobs, preferences);
    logger.info(`${filteredJobs.length} jobs after filtering by preferences`);

    // Apply freshness filter and sort
    filteredJobs = filterByFreshness(filteredJobs, preferences);
    logger.info(`${filteredJobs.length} jobs after freshness filter`);

    // Add freshness metadata for display
    filteredJobs = addFreshnessMetadata(filteredJobs);

    // Filter out jobs we've already seen
    const newJobs = await filterNewJobs(filteredJobs);
    logger.info(
      `${newJobs.length} new jobs (${filteredJobs.length - newJobs.length} already seen)\n`,
    );

    if (newJobs.length === 0) {
      logger.info("No new jobs to display");
      return;
    }

    // Display jobs (for now, show first 10)
    const jobsToDisplay = newJobs.slice(0, 10);
    logger.info(`Showing first ${jobsToDisplay.length} new jobs:\n`);

    jobsToDisplay.forEach((job, index) => {
      console.log(`\n${index + 1}. ${job.title}`);
      logger.job(job);
    });

    // Mark these jobs as seen
    await markJobsAsSeen(newJobs);
    logger.success(`Marked ${newJobs.length} jobs as seen`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();
