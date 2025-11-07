/**
 * RemoteOK Jobs Scraper
 * Fetches jobs from RemoteOK's public JSON API
 * API Docs: https://remoteok.com/api
 */

import axios from 'axios';

const REMOTEOK_API_URL = 'https://remoteok.com/api';

/**
 * Scrapes jobs from RemoteOK
 * @param {Object} searchParams - Search parameters (optional for RemoteOK)
 * @returns {Promise<Array>} Array of job objects
 */
export async function scrapeRemoteOKJobs(searchParams = {}) {
  try {
    console.log('Fetching jobs from RemoteOK...');

    const response = await axios.get(REMOTEOK_API_URL, {
      headers: {
        'User-Agent': 'Job-Finder-CLI/1.0 (Educational Project)',
      },
    });

    // First element is metadata/legal info, so skip it
    const jobs = response.data.slice(1);

    // Transform RemoteOK data to our standard format
    const transformedJobs = jobs.map(job => ({
      id: `remoteok-${job.id}`,
      title: job.position || 'Unknown Position',
      company: job.company || 'Unknown Company',
      location: job.location || 'Remote',
      locationType: determineLocationType(job.location),
      description: job.description || '',
      url: job.url || `https://remoteok.com/remote-jobs/${job.id}`,
      applyUrl: job.apply_url || null,
      postedDate: job.date ? new Date(job.date) : null,
      salary: extractSalary(job),
      tags: job.tags || [],
      source: 'RemoteOK',
      raw: job, // Keep raw data for debugging
    }));

    console.log(`✓ Fetched ${transformedJobs.length} jobs from RemoteOK`);
    return transformedJobs;

  } catch (error) {
    console.error('Error scraping RemoteOK:', error.message);
    return [];
  }
}

/**
 * Determines location type based on location string
 * @param {string} location - Location string from job
 * @returns {string} Location type: 'remote', 'hybrid', or 'in-person'
 */
function determineLocationType(location) {
  if (!location) return 'remote';

  const locationLower = location.toLowerCase();

  // RemoteOK is primarily remote jobs
  if (locationLower.includes('remote') || locationLower.includes('anywhere')) {
    return 'remote';
  }

  if (locationLower.includes('hybrid')) {
    return 'hybrid';
  }

  // If specific location is mentioned, it might be in-person or hybrid
  // Default to remote for RemoteOK since that's their focus
  return 'remote';
}

/**
 * Extracts salary information
 * @param {Object} job - Raw job object from RemoteOK
 * @returns {Object|null} Salary object with min/max or null
 */
function extractSalary(job) {
  if (job.salary_min || job.salary_max) {
    return {
      min: job.salary_min || null,
      max: job.salary_max || null,
      currency: 'USD', // RemoteOK typically uses USD
    };
  }
  return null;
}
