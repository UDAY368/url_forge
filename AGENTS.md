# Repository Guidelines

## Project Structure & Module Organization

`url_forge` is a full-stack JavaScript URL shortener with a React frontend and a Node.js/Express.js backend.

Current layout:

```text
url_forge/
|-- client/        # Vite React frontend
|-- docs/          # API and testing documentation
|-- server/        # Express API and backend tests
|-- tests/         # Black-box integration tests
|-- README.md
`-- AGENTS.md
```

Place frontend source under `client/src/`, backend source under `server/src/`, backend tests under `server/test/`, and cross-service integration tests under `tests/integration/`.

## Build, Test, and Development Commands

- `npm install` - install workspace dependencies.
- `npm run dev` - run the API and Vite frontend together.
- `npm run build` - build the React frontend.
- `npm test` - run backend tests.
- `npm run test:integration` - run black-box HTTP tests against a running server.

## Coding Style & Naming Conventions

Use modern JavaScript ES modules. Keep indentation at 2 spaces. Use `camelCase` for variables and functions, `PascalCase` for React components, and descriptive file names such as `App.jsx`, `urlRoutes.js`, or `urlStore.js`.

API responses should use `{ "data": ... }` for success and `{ "error": ... }` for failures.

## Testing Guidelines

Tests use Node's built-in test runner for the backend and integration suite.

- Add backend tests in `server/test/*.test.js`.
- Add black-box HTTP tests in `tests/integration/*.test.mjs`.

Run `npm test` before opening a pull request. Run `npm run test:integration` when changing API behavior.

## Commit & Pull Request Guidelines

The current history uses concise imperative commits such as `Initial commit` and `Add repository contributor guide`. Continue with messages like `Add shorten endpoint` or `Build React URL form`.

Pull requests should include a short summary, test results or a note that tests are not configured, setup notes, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit `.env` files, secrets, API keys, or generated credentials. Use `.env.example` to document `PORT`, `BASE_URL`, and `CLIENT_ORIGIN`.
