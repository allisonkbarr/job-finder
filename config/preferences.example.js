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

  // Role levels to match (Engineering Manager, Senior EM, Director, etc.)
  roleLevels: [
    "Engineering Manager",
    "Senior Engineering Manager",
    "Director of Engineering",
    "Head of Engineering",
  ],

  // Roles to exclude (IC roles)
  excludeRoles: [
    "Staff Engineer",
    "Principal Engineer",
    "Tech Lead",
    "Senior Software Engineer",
  ],

  // Company stage preferences
  companyStage: {
    preferred: ["startup", "scaleup"],
    maxCompanySize: 500, // Employees
  },

  // Location preferences
  location: {
    preferred: [
      "Seattle",
      "Bellevue",
      "Redmond",
      "Kirkland",
      "Bothell",
      "Renton",
    ],
    // Location type: 'in-person', 'hybrid', 'remote'
    locationTypes: ["in-person", "hybrid"], // Exclude 'remote'
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
