/**
 * Example preferences file
 * Copy this to .local/preferences.js and customize with your preferences
 */

export const preferences = {
  // Search terms for job boards (used by Adzuna and other scrapers)
  search: {
    what: "engineering manager", // Primary search term (use "engineering manager" for broader results than "software engineering manager")
    whatExclude:
      "electrical mechanical civil aerospace structural chemical biomedical nuclear", // Exclude traditional engineering
  },

  // Roles to exclude (IC roles - use short keywords to catch variations)
  excludeRoles: [
    "Staff",
    "Principal",
    "Tech Lead",
    "Senior Software Engineer",
    "Senior Engineer",
  ],

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
