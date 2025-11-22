/**
 * Freshness Filter
 * Filters jobs based on posted date and prioritizes recent postings
 */

import { differenceInDays } from "date-fns";

/**
 * Filters jobs by freshness and sorts by recency
 * @param {Array} jobs - Array of job objects
 * @param {Object} preferences - User preferences with freshness settings
 * @returns {Array} Filtered and sorted jobs
 */
export function filterByFreshness(jobs, preferences) {
  if (!jobs || jobs.length === 0) {
    return [];
  }

  const maxDaysOld = preferences.freshness?.maxDaysOld || 30;
  const preferredDaysOld = preferences.freshness?.preferredDaysOld || 7;
  const now = new Date();

  // Filter out jobs older than maxDaysOld
  const filtered = jobs.filter((job) => {
    // If no posted date, keep the job (assume it's recent)
    if (!job.postedDate) {
      return true;
    }

    const daysOld = differenceInDays(now, new Date(job.postedDate));
    return daysOld <= maxDaysOld;
  });

  // Sort jobs by freshness (newest first) and prioritize preferred freshness
  const sorted = filtered.sort((a, b) => {
    const aDate = a.postedDate ? new Date(a.postedDate) : new Date(0);
    const bDate = b.postedDate ? new Date(b.postedDate) : new Date(0);

    const aDaysOld = differenceInDays(now, aDate);
    const bDaysOld = differenceInDays(now, bDate);

    // Prioritize jobs within preferred freshness window
    const aIsPreferred = aDaysOld <= preferredDaysOld;
    const bIsPreferred = bDaysOld <= preferredDaysOld;

    if (aIsPreferred && !bIsPreferred) return -1;
    if (!aIsPreferred && bIsPreferred) return 1;

    // Within same preference tier, sort by date (newest first)
    return bDate - aDate;
  });

  return sorted;
}

/**
 * Adds freshness metadata to jobs
 * @param {Array} jobs - Array of job objects
 * @returns {Array} Jobs with freshness metadata
 */
export function addFreshnessMetadata(jobs) {
  const now = new Date();

  return jobs.map((job) => {
    if (!job.postedDate) {
      return {
        ...job,
        daysOld: null,
        freshnessLabel: "Unknown",
      };
    }

    const daysOld = differenceInDays(now, new Date(job.postedDate));
    let freshnessLabel;

    if (daysOld === 0) {
      freshnessLabel = "Today";
    } else if (daysOld === 1) {
      freshnessLabel = "Yesterday";
    } else if (daysOld < 7) {
      freshnessLabel = `${daysOld} days ago`;
    } else if (daysOld < 14) {
      freshnessLabel = "1-2 weeks ago";
    } else if (daysOld < 30) {
      freshnessLabel = "2-4 weeks ago";
    } else {
      freshnessLabel = "Over a month ago";
    }

    return {
      ...job,
      daysOld,
      freshnessLabel,
    };
  });
}
