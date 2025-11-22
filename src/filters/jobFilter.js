/**
 * Job Filter
 * Applies user preferences to filter jobs
 */

/**
 * Filters jobs based on all user preferences
 * @param {Array} jobs - Array of job objects
 * @param {Object} preferences - User preferences
 * @returns {Array} Filtered jobs
 */
export function filterJobs(jobs, preferences) {
  if (!jobs || jobs.length === 0) {
    return [];
  }

  let filtered = jobs;

  // Apply role level filtering
  if (preferences.roleLevels && preferences.roleLevels.length > 0) {
    filtered = filterByRoleLevel(filtered, preferences.roleLevels);
  }

  // Apply role exclusion filtering
  if (preferences.excludeRoles && preferences.excludeRoles.length > 0) {
    filtered = filterOutExcludedRoles(filtered, preferences.excludeRoles);
  }

  // Apply location filtering
  if (
    preferences.location?.preferred &&
    preferences.location.preferred.length > 0
  ) {
    filtered = filterByLocation(filtered, preferences.location.preferred);
  }

  // Apply location type filtering
  if (
    preferences.location?.locationTypes &&
    preferences.location.locationTypes.length > 0
  ) {
    filtered = filterByLocationType(
      filtered,
      preferences.location.locationTypes,
    );
  }

  // Apply keyword filtering
  if (preferences.keywords) {
    filtered = filterByKeywords(filtered, preferences.keywords);
  }

  return filtered;
}

/**
 * Filters jobs by role level (case-insensitive partial match)
 * @param {Array} jobs - Array of job objects
 * @param {Array<string>} roleLevels - Acceptable role levels
 * @returns {Array} Filtered jobs
 */
function filterByRoleLevel(jobs, roleLevels) {
  return jobs.filter((job) => {
    const title = job.title.toLowerCase();

    // Check if job title matches any of the preferred role levels
    return roleLevels.some((role) => {
      const roleLower = role.toLowerCase();
      return title.includes(roleLower);
    });
  });
}

/**
 * Filters out jobs with excluded role keywords
 * @param {Array} jobs - Array of job objects
 * @param {Array<string>} excludeRoles - Roles to exclude
 * @returns {Array} Filtered jobs
 */
function filterOutExcludedRoles(jobs, excludeRoles) {
  return jobs.filter((job) => {
    const title = job.title.toLowerCase();

    // Check if job title contains any excluded role keywords
    const hasExcludedRole = excludeRoles.some((role) => {
      const roleLower = role.toLowerCase();
      return title.includes(roleLower);
    });

    return !hasExcludedRole;
  });
}

/**
 * Filters jobs by location (matches if any preferred location is found)
 * @param {Array} jobs - Array of job objects
 * @param {Array<string>} preferredLocations - Preferred locations
 * @returns {Array} Filtered jobs
 */
function filterByLocation(jobs, preferredLocations) {
  return jobs.filter((job) => {
    const location = job.location.toLowerCase();

    // If location is "remote" or "anywhere", always include it
    if (location.includes("remote") || location.includes("anywhere")) {
      return true;
    }

    // Check if job location matches any preferred location
    // Also check for county names (e.g., King County for Seattle area)
    return preferredLocations.some((prefLoc) => {
      const prefLocLower = prefLoc.toLowerCase();

      // Direct match
      if (location.includes(prefLocLower)) {
        return true;
      }

      // Seattle area special handling - accept King County
      const seattleAreaCities = [
        "seattle",
        "bellevue",
        "redmond",
        "kirkland",
        "bothell",
        "renton",
      ];
      if (
        seattleAreaCities.includes(prefLocLower) &&
        location.includes("king county")
      ) {
        return true;
      }

      return false;
    });
  });
}

/**
 * Filters jobs by location type (remote, hybrid, in-person)
 * @param {Array} jobs - Array of job objects
 * @param {Array<string>} locationTypes - Acceptable location types
 * @returns {Array} Filtered jobs
 */
function filterByLocationType(jobs, locationTypes) {
  return jobs.filter((job) => {
    return locationTypes.includes(job.locationType);
  });
}

/**
 * Filters jobs by keywords (include and exclude)
 * @param {Array} jobs - Array of job objects
 * @param {Object} keywords - Keywords object with include and exclude arrays
 * @returns {Array} Filtered jobs
 */
function filterByKeywords(jobs, keywords) {
  return jobs.filter((job) => {
    const searchText = `${job.title} ${job.description}`.toLowerCase();

    // If include keywords are specified, job must contain at least one
    if (keywords.include && keywords.include.length > 0) {
      const hasIncludeKeyword = keywords.include.some((keyword) =>
        searchText.includes(keyword.toLowerCase()),
      );
      if (!hasIncludeKeyword) {
        return false;
      }
    }

    // If exclude keywords are specified, job must not contain any
    if (keywords.exclude && keywords.exclude.length > 0) {
      const hasExcludeKeyword = keywords.exclude.some((keyword) =>
        searchText.includes(keyword.toLowerCase()),
      );
      if (hasExcludeKeyword) {
        return false;
      }
    }

    return true;
  });
}
