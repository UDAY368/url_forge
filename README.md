# url_forge

`url_forge` is a full-stack JavaScript URL shortener.

The project uses a React.js frontend and a Node.js/Express.js backend.

## Overview

`url_forge` provides a React interface for creating short links and an Express API for URL validation, slug creation, redirects, click tracking, and recent-link history.

## Tech Stack

- React.js for the frontend
- Node.js for the runtime
- Express.js for the backend API
- Vite for frontend development and builds
- npm for package management

## Getting Started

Clone the repository and move into the project directory:

```bash
git clone <repository-url>
cd url_forge
```

Install dependencies:

```bash
npm install
```

## Running The Project

Start the React frontend and Express backend together:

```bash
npm run dev
```

If the frontend and backend run separately:

```bash
npm run dev --workspace client
npm run dev --workspace server
```

The React app typically runs at:

```text
http://localhost:5173
```

The Express API typically runs at:

```text
http://localhost:3000
```

Update these URLs if your project uses different ports.

## Project Structure

```text
url_forge/
|-- client/
|   |-- src/
|   `-- package.json
|-- docs/
|-- server/
|   |-- src/
|   |-- test/
|   `-- package.json
|-- tests/
|-- package.json
`-- README.md
```

## API

The backend is powered by Express.js.

Available endpoints:

```text
GET /api/health
POST /api/urls
GET /api/urls
GET /api/urls/:slug
GET /:slug
```

See `docs/api.md` for request and response details.

## Development

Recommended workflow:

1. Create a focused branch for each change.
2. Keep changes small and easy to review.
3. Add or update tests for behavior changes.
4. Run formatting, linting, and tests before submitting changes.

## Testing

Run backend tests with:

```bash
npm test
```

Run black-box integration tests against a running server with:

```bash
npm run test:integration
```

## License

Add license information here.
