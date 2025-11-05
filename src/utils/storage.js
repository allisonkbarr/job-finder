/**
 * Job Storage
 * Tracks seen jobs to avoid duplicates
 * TODO: Implement job tracking
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORAGE_FILE = join(__dirname, '..', '..', '.local', 'seen-jobs.json');

export async function getSeenJobs() {
  if (!existsSync(STORAGE_FILE)) {
    return [];
  }
  
  try {
    const data = await readFile(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function saveSeenJobs(jobIds) {
  await writeFile(STORAGE_FILE, JSON.stringify(jobIds, null, 2));
}

export async function markJobsAsSeen(jobs) {
  const seenJobs = await getSeenJobs();
  const newJobIds = jobs.map(job => job.id);
  const updatedSeenJobs = [...new Set([...seenJobs, ...newJobIds])];
  await saveSeenJobs(updatedSeenJobs);
}

export async function filterNewJobs(jobs) {
  const seenJobs = await getSeenJobs();
  return jobs.filter(job => !seenJobs.includes(job.id));
}

