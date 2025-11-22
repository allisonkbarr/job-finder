# Job Finder CLI

A Node.js command-line tool that finds engineering manager jobs from Adzuna with intelligent filtering based on your preferences.

## Setup

### Prerequisites

1. **Node.js** (v18+ recommended)
   - Check: `node --version`
   - Install: Download from [nodejs.org](https://nodejs.org/) or use Homebrew: `brew install node`

2. **npm** (comes with Node.js)
   - Check: `npm --version`

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your preferences:
   ```bash
   cp config/preferences.example.js .local/preferences.js
   ```
   Then edit `.local/preferences.js` with your preferences.

4. Set up API credentials:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Adzuna API credentials:
   - Register at [https://developer.adzuna.com/](https://developer.adzuna.com/)
   - Get your `app_id` and `app_key`
   - Add them to your `.env` file

## Usage

Run the job finder:
```bash
npm start
```

The app will:
1. Search Adzuna for engineering manager jobs in your preferred location
2. Filter results by your role preferences, location type, and keywords
3. Sort by freshness (newest first)
4. Display all matching jobs with salary, location, and posting date

## Configuration

Edit `.local/preferences.js` to customize:

### Search Terms
- `search.what` - Job search query (e.g., "engineering manager")
- `search.whatExclude` - Keywords to exclude (e.g., "electrical mechanical civil")

### Role Filtering
- `roleLevels` - Acceptable role titles (e.g., "Engineering Manager", "Director of Engineering")
- `excludeRoles` - Roles to filter out (e.g., IC positions like "Staff Engineer")

### Location Preferences
- `location.preferred` - Preferred cities (first one is used for Adzuna search)
- `location.locationTypes` - Acceptable location types: `remote`, `hybrid`, `in-person`

### Freshness
- `freshness.maxDaysOld` - Maximum job age in days (used for Adzuna API filtering)
- `freshness.preferredDaysOld` - Jobs within this window are prioritized in sorting

### Keywords
- `keywords.include` - Jobs must contain these keywords (optional)
- `keywords.exclude` - Jobs must not contain these keywords (optional)

## Features

### Implemented ✅
- **Adzuna integration** - Fetches jobs from Adzuna API
- **API-level filtering** - Location and freshness filtering at API level for better results
- **Role filtering** - Match engineering manager positions, exclude IC roles
- **Location filtering** - Seattle area (King County) support with remote job acceptance
- **Keyword filtering** - Include/exclude based on job description content
- **Freshness sorting** - Newest jobs first, with prioritization of very recent postings
- **Rich display** - Shows salary, location type, and posting date for each job

### Job Boards

Currently using:
- ✅ **Adzuna** (requires free API key)



## Example Output

```
Job Finder CLI
==============

✓ Preferences loaded
ℹ Starting job search...

✓ Fetched 50 jobs from Adzuna
✓ Found 50 jobs from Adzuna
ℹ Applying filters...
ℹ 10 jobs after filtering by preferences
ℹ Jobs sorted by freshness

ℹ Showing 10 matching jobs:

1. Senior Engineering Manager, Salesforce
   Company: DAT
   Location: Seattle, King County (in-person)
   Salary: $218,000 - $284,000 (predicted)
   Posted: 2 days ago
   Source: Adzuna
   URL: https://www.adzuna.com/details/5506548149
```

## License

ISC
