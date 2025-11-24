/**
 * Example preferences file
 * Copy this to .local/preferences.js and customize with your preferences
 */

export const preferences = {
  // Search terms for job boards (used by Adzuna and other scrapers/integrations)
  search: {
    what: "engineering manager", // Primary search term
    whatExclude:
      "electrical mechanical civil aerospace structural chemical biomedical nuclear",
  },

  // Roles to exclude
  excludeRoles: ["Staff", "Principal", "Tech Lead"],

  // Location preferences
  location: {
    where: "Seattle, WA", // Location to search (e.g., "Seattle, WA", "King County", "San Francisco, CA")
    // Location type: 'in-person', 'hybrid', 'remote'
    locationTypes: ["in-person", "hybrid", "remote"],
  },

  // Keywords to include/exclude in job descriptions
  keywords: {
    include: [], // Optional: jobs must contain these
    exclude: [], // Optional: jobs must not contain these
  },

  // Freshness preferences
  freshness: {
    preferredDaysOld: 3, // Prioritize jobs posted within this many days
    maxDaysOld: 14, // Ignore jobs older than this
  },
};
