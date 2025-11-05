#!/usr/bin/env node

/**
 * Job Finder CLI - Main Entry Point
 * Aggregates engineering management jobs from multiple job boards
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Job Finder CLI');
console.log('==============\n');

// Check if preferences file exists
const preferencesPath = join(__dirname, '..', '.local', 'preferences.js');
if (!existsSync(preferencesPath)) {
  console.error('❌ Preferences file not found!');
  console.error(`   Please create .local/preferences.js based on config/preferences.example.js\n`);
  process.exit(1);
}

// Load preferences
try {
  const preferencesModule = await import(`file://${preferencesPath}`);
  const preferences = preferencesModule.preferences;
  console.log('✅ Preferences loaded\n');
  
  // TODO: Implement job scraping and filtering
  console.log('🚧 Implementation in progress...\n');
  console.log('Your preferences:', JSON.stringify(preferences, null, 2));
  
} catch (error) {
  console.error('❌ Error loading preferences:', error.message);
  process.exit(1);
}

