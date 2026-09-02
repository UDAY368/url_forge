# url_forge

`url_forge` is a full-stack JavaScript project for building tools around URL creation, parsing, validation, or transformation.

The project uses a React.js frontend and a Node.js/Express.js backend.

## Overview

`url_forge` provides a frontend interface for working with URLs and a backend API for handling URL-related logic such as validation, transformation, storage, or metadata processing.

## Tech Stack

- React.js for the frontend
- Node.js for the runtime
- Express.js for the backend API
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

If the frontend and backend have separate package files, install dependencies in each folder:

```bash
cd client
npm install

cd ../server
npm install
```

## Running The Project

Start the development server:

```bash
npm run dev
```

If the frontend and backend run separately:

```bash
# Frontend
cd client
npm run dev

# Backend
cd server
npm run dev
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
|-- server/
|   |-- src/
|   `-- package.json
|-- package.json
`-- README.md
```

## API

The backend is powered by Express.js. Add API route documentation here as endpoints are implemented.

Example endpoints:

```text
GET /api/health
POST /api/urls
GET /api/urls/:id
```

## Development

Recommended workflow:

1. Create a focused branch for each change.
2. Keep changes small and easy to review.
3. Add or update tests for behavior changes.
4. Run formatting, linting, and tests before submitting changes.

## Testing

Run tests with:

```bash
npm test
```

If frontend and backend tests are separate, run them from their respective folders.

## License

Add license information here.
