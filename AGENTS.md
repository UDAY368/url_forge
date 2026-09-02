# Repository Guidelines

## Project Structure & Module Organization

`url_forge` is currently a starter repository with project documentation only. The intended direction is a full-stack JavaScript app with a React frontend and a Node.js/Express.js backend.

Current layout:

```text
url_forge/
|-- README.md
`-- AGENTS.md
```

When implementation is added, prefer `client/` for the React app and `server/` for the Express API. Place frontend source under `client/src/`, backend source under `server/src/`, and tests near the code they validate.

## Build, Test, and Development Commands

No package files or runnable app commands exist yet. Add scripts to `package.json` as the project is implemented.

Expected future commands:

- `npm install` - install dependencies for the current package.
- `npm run dev` - run the local development app.
- `npm test` - run the configured test suite.
- `npm run build` - build production assets.

If frontend and backend packages are separate, run commands from `client/` and `server/`.

## Coding Style & Naming Conventions

Use modern JavaScript or TypeScript consistently within each package. Keep indentation at 2 spaces. Use `camelCase` for variables and functions, `PascalCase` for React components, and descriptive file names such as `App.jsx`, `urlRoutes.js`, or `urlService.js`.

Prefer clear API response shapes such as `{ "data": ... }` for success and `{ "error": ... }` for failures once backend routes are added.

## Testing Guidelines

No test framework is configured yet. When tests are introduced, document the framework and command in `README.md`.

Suggested locations:

- `client/src/**/*.test.jsx` for React component tests.
- `server/test/*.test.js` for Express route and service tests.

Run the full test suite before opening a pull request once `npm test` is available.

## Commit & Pull Request Guidelines

The current history contains a single concise commit: `Initial commit`. Continue using short imperative messages such as `Add README details`, `Create Express server`, or `Build React URL form`.

Pull requests should include a short summary, test results or a note that tests are not configured, setup notes, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit `.env` files, secrets, API keys, or generated credentials. When configuration is introduced, document required variables in `.env.example`, such as `PORT` or `BASE_URL`.
