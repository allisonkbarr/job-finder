/**
 * Adzuna Jobs Scraper
 * Fetches jobs from Adzuna's API
 * API Docs: https://developer.adzuna.com/
 */

import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs";
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

/**
 * Scrapes jobs from Adzuna
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.what - Job title/keywords to search for
 * @param {string} searchParams.whatExclude - Keywords to exclude from search
 * @param {string} searchParams.where - Location to search in
 * @param {number} searchParams.maxDaysOld - Maximum age of jobs in days
 * @param {string} searchParams.country - Country code (default: 'us')
 * @param {number} searchParams.resultsPerPage - Number of results per page (default: 50)
 * @param {number} searchParams.page - Page number (default: 1)
 * @returns {Promise<Array>} Array of job objects
 */
export async function scrapeAdzunaJobs(searchParams = {}) {
  // Check for API credentials
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    console.error("❌ Adzuna API credentials not found!");
    console.error(
      "   Please set ADZUNA_APP_ID and ADZUNA_APP_KEY in your .env file",
    );
    console.error("   Get your API key from: https://developer.adzuna.com/");
    return [];
  }

  const {
    what = "engineering manager",
    whatExclude = "",
    where = "",
    maxDaysOld = null,
    country = "us",
    resultsPerPage = 50,
    page = 1,
  } = searchParams;

  try {
    console.log(`Fetching jobs from Adzuna (${country})...`);

    // Build the API URL
    const url = `${ADZUNA_BASE_URL}/${country}/search/${page}`;

    // Build query parameters
    const params = {
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
      results_per_page: resultsPerPage,
      "content-type": "application/json",
    };

    // Add optional parameters
    if (what) {
      params.what = what;
    }
    if (whatExclude) {
      params.what_exclude = whatExclude;
    }
    if (where) {
      params.where = where;
    }
    if (maxDaysOld !== null) {
      params.max_days_old = maxDaysOld;
    }

    const response = await axios.get(url, { params });

    if (!response.data || !response.data.results) {
      console.log("No results returned from Adzuna");
      return [];
    }

    const jobs = response.data.results;

    // Transform Adzuna data to our standard format
    const transformedJobs = jobs.map((job) => ({
      id: `adzuna-${job.id}`,
      title: job.title || "Unknown Position",
      company: job.company?.display_name || "Unknown Company",
      location: formatLocation(job.location),
      locationType: determineLocationType(job),
      description: job.description || "",
      url: job.redirect_url || "",
      applyUrl: job.redirect_url || null,
      postedDate: job.created ? new Date(job.created) : null,
      salary: extractSalary(job),
      tags: extractTags(job),
      source: "Adzuna",
      raw: job, // Keep raw data for debugging
    }));

    console.log(`✓ Fetched ${transformedJobs.length} jobs from Adzuna`);
    return transformedJobs;
  } catch (error) {
    if (error.response) {
      console.error(
        `Adzuna API error (${error.response.status}):`,
        error.response.data,
      );
    } else {
      console.error("Error scraping Adzuna:", error.message);
    }
    return [];
  }
}

/**
 * Formats location information from Adzuna job
 * @param {Object} location - Location object from Adzuna
 * @returns {string} Formatted location string
 */
function formatLocation(location) {
  if (!location) return "Unknown";

  if (location.display_name) {
    return location.display_name;
  }

  // Build location from area hierarchy
  const areas = [];
  if (location.area && location.area.length > 0) {
    // area is an array like ["California", "United States"]
    areas.push(...location.area);
  }

  return areas.length > 0 ? areas.join(", ") : "Unknown";
}

/**
 * Determines location type based on job data
 * @param {Object} job - Raw job object from Adzuna
 * @returns {string} Location type: 'remote', 'hybrid', or 'in-person'
 */
function determineLocationType(job) {
  const title = (job.title || "").toLowerCase();
  const description = (job.description || "").toLowerCase();
  const location = formatLocation(job.location).toLowerCase();

  // Check for remote indicators
  if (
    title.includes("remote") ||
    description.includes("remote") ||
    description.includes("work from home") ||
    location.includes("remote")
  ) {
    return "remote";
  }

  // Check for hybrid indicators
  if (title.includes("hybrid") || description.includes("hybrid")) {
    return "hybrid";
  }

  // Default to in-person
  return "in-person";
}

/**
 * Extracts salary information
 * @param {Object} job - Raw job object from Adzuna
 * @returns {Object|null} Salary object with min/max or null
 */
function extractSalary(job) {
  if (job.salary_min || job.salary_max) {
    return {
      min: job.salary_min || null,
      max: job.salary_max || null,
      currency: "USD", // Adzuna uses local currency, assuming USD for US jobs
      isPredicted: job.salary_is_predicted || false,
    };
  }
  return null;
}

/**
 * Extracts tags from job data
 * @param {Object} job - Raw job object from Adzuna
 * @returns {Array<string>} Array of tags
 */
function extractTags(job) {
  const tags = [];

  // Add category if available
  if (job.category) {
    if (job.category.label) {
      tags.push(job.category.label);
    }
    if (job.category.tag) {
      tags.push(job.category.tag);
    }
  }

  // Add contract type
  if (job.contract_type) {
    tags.push(job.contract_type);
  }

  // Add contract time (full-time, part-time)
  if (job.contract_time) {
    tags.push(job.contract_time);
  }

  return [...new Set(tags)]; // Remove duplicates
}
