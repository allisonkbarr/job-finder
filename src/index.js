#!/usr/bin/env node

/**
 * Job Finder CLI - Main Entry Point
 * Aggregates engineering management jobs from job boards
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { scrapeAdzunaJobs } from "./scrapers/adzuna.js";
import { logger } from "./utils/logger.js";
import { filterJobs } from "./filters/jobFilter.js";
import {
  sortByFreshness,
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

    // Scrape jobs from Adzuna
    logger.info("Starting job search...\n");

    const jobs = await scrapeAdzunaJobs({
      what: preferences.search?.what || "engineering manager",
      whatExclude: preferences.search?.whatExclude || "",
      where: preferences.location?.where || "",
      maxDaysOld: preferences.freshness?.maxDaysOld || null,
      resultsPerPage: 50,
    });

    if (jobs.length === 0) {
      logger.warning("No jobs found");
      return;
    }

    logger.success(`Found ${jobs.length} jobs from Adzuna`);

    // Apply preference-based filters
    logger.info("Applying filters...");
    let filteredJobs = filterJobs(jobs, preferences);
    logger.info(`${filteredJobs.length} jobs after filtering by preferences`);

    // Sort by freshness (newest first)
    filteredJobs = sortByFreshness(filteredJobs, preferences);
    logger.info(`Jobs sorted by freshness\n`);

    if (filteredJobs.length === 0) {
      logger.info("No jobs matched your criteria");
      return;
    }

    // Add freshness metadata for display
    filteredJobs = addFreshnessMetadata(filteredJobs);

    // Display all matching jobs
    logger.info(`Showing ${filteredJobs.length} matching jobs:\n`);

    filteredJobs.forEach((job, index) => {
      console.log(`\n${index + 1}. ${job.title}`);
      logger.job(job);
    });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();
