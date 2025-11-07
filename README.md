# Job Finder CLI

A Node.js command-line tool that aggregates jobs from multiple job boards and applies rule-based filtering to match jobs to your preferences.

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

4. Set up API credentials (for Adzuna):
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

## Configuration

Edit `.local/preferences.js` to customize:
- Role levels
- Company stage preferences
- Location preferences
- Keywords to include/exclude
- Freshness preferences

## Job Boards Supported

Currently implemented:
- ✅ RemoteOK (free, no API key required)
- ✅ Adzuna (requires free API key)

Planned:
- LinkedIn Jobs
- Indeed
- BuiltIn
- Welcome to the Jungle

## Development Status

🚧 This project is in active development. Not all features are implemented yet.

## License

ISC

