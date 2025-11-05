<!-- 80ce2eaf-7d44-4c71-b9b1-000f1b1bc8b9 07ef8820-06ab-4462-bb1a-446f0b0c3c8c -->
# Job Finder CLI Application

## Overview

A Node.js command-line tool that aggregates engineering management jobs from multiple job boards and applies rule-based filtering to match jobs to user preferences. This is the initial version without LLM integration.

## Setup Requirements

### Prerequisites to Install

1. **Node.js** (v18+ recommended)
   - Check: `node --version`
   - Install: Download from nodejs.org or use Homebrew: `brew install node`

2. **npm** (comes with Node.js)
   - Check: `npm --version`

3. **Git** (for version control)
   - Check: `git --version`
   - Install: `brew install git` (if needed)

## Project Structure

```
job-finder/
├── package.json                 # Dependencies and scripts
├── .env                        # API keys (gitignored, for future use)
├── .gitignore                  # Ignore node_modules, .env, .local/, etc.
├── config/
│   └── preferences.example.js  # Example preferences template (committed)
├── .local/                     # Local user config (gitignored)
│   └── preferences.js          # User job preferences (role, location, etc.)
├── src/
│   ├── index.js               # Main CLI entry point
│   ├── scrapers/
│   │   ├── linkedin.js        # LinkedIn Jobs scraper
│   │   ├── indeed.js          # Indeed scraper
│   │   ├── github.js          # GitHub Jobs API
│   │   ├── stackoverflow.js   # Stack Overflow Jobs API
│   │   ├── builtin.js         # BuiltIn scraper
│   │   └── welcometothejungle.js  # WTTJ with authentication
│   ├── filters/
│   │   ├── jobFilter.js       # Apply user preferences
│   │   └── freshnessFilter.js # Filter promoted/old jobs
│   ├── utils/
│   │   ├── logger.js          # CLI output formatting
│   │   └── storage.js         # Track seen jobs (avoid duplicates)
│   └── types/
│       └── Job.js             # Job data structure
└── README.md                   # Setup and usage instructions
```

## Implementation Plan

### Phase 1: Project Setup

- Initialize npm project with package.json
- Set up .gitignore
- Create basic project structure
- Configure environment variables template (no API keys needed yet)

### Phase 2: Data Discovery & Job Scraping

- **First, explore available data** from each job board to understand what structured information is available:
  - Job titles, descriptions, company names
  - Location and location type (remote/hybrid/in-person)
  - Company size/employee count (LinkedIn)
  - Posted dates, application counts
  - Funding stage information (if available)
  - Any additional metadata that could inform filtering
- Implement job board scrapers/APIs (prioritize LinkedIn, Indeed, BuiltIn)
- Prompt for Welcome to the Jungle username/password interactively on each run
- Use job board APIs where available (GitHub, Stack Overflow)
- Extract all available job data in structured format
- Handle rate limiting and error handling
- Document what data is available from each source

### Phase 3: Rule-Based Filtering System

- **Job level filtering**: 
  - Fuzzy matching on job titles for: "Engineering Manager", "Senior Engineering Manager", "Director of Engineering", "Head of Engineering", etc.
  - Regex patterns for common variations
  - Exclude: "Staff Engineer", "Principal Engineer", "Tech Lead" (IC roles)
- **Location filtering**:
  - Only show jobs where location type is "in-person" or "hybrid" (exclude "remote")
  - Location must be in greater Seattle area (Seattle, Bellevue, Redmond, etc.)
  - Fuzzy matching for location strings
- **Company stage filtering**: 
  - Use LinkedIn company size data when available (< 500 employees = startup/scaleup)
  - Research/implement company lookup for funding stage
  - Heuristics: company size < 500 + recent funding = startup/scaleup
- **Freshness filter**: Prioritize jobs < 3 days old, deprioritize promoted/high-application jobs
- **Keyword filtering**: Basic include/exclude keywords from user preferences

### Phase 4: CLI Interface

- Display formatted job list with:
  - Job title, company, location, location type
  - Filter match reasons (why it passed filters)
  - Job board source
  - Link to apply
  - Posted date and freshness indicator
- Color-coded output (green for high match, yellow for medium)
- Option to save jobs to file
- Deduplication across sources

### Phase 5: Job Tracking

- Store seen jobs in local file (JSON)
- Only show new jobs each day
- Mark jobs as seen after display

## Key Dependencies

- `puppeteer` or `playwright` - Web scraping (LinkedIn, Indeed, BuiltIn)
- `axios` - HTTP requests for APIs
- `cheerio` - HTML parsing
- `dotenv` - Environment variables (for future use)
- `chalk` - CLI colors
- `inquirer` - Interactive prompts (for WTTJ credentials)
- `date-fns` - Date formatting
- `fuse.js` or similar - Fuzzy matching for job titles/locations

## Configuration Files

**`.local/preferences.js`** - User-defined filters:

- Role levels: EM, Senior EM, Director (used for fuzzy matching patterns)
- Company stage: startup, scaleup (used for company size heuristics)
- Location: greater Seattle area (used for location filtering)
- Location type: in-person or hybrid only
- Keywords to include/exclude
- Freshness preference (days old)

## Technical Considerations

- Rate limiting: Add delays between requests to avoid being blocked
- Error handling: Graceful degradation if one job board fails
- Caching: Cache results for short periods to avoid repeated API calls
- Interactive credentials: Prompt for Welcome to the Jungle login on each run (not stored)

