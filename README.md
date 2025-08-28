# WebReg++

WebReg++ is a smarter, student-friendly interface for class registration at UC San Diego. It features a schedule optimizer using fitness-based mutation logic and Monte Carlo acceptance to help students generate conflict-free, personalized class schedules.

Try it live: [https://webregplusplus.tech](https://webregplusplus.tech)

## Features

- Smart schedule generation based on student preferences
- Auto-scheduling with conflict detection
- Monte Carlo-based mutation acceptance
- Fitness function for evaluating schedule quality
- Interactive and responsive frontend interface

## Tech Stack

- Frontend: [Next.js](https://nextjs.org/docs), [TailwindCSS](https://tailwindcss.com/docs/styling-with-utility-classes), [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- Backend: [Node.js](https://nodejs.org/en), [Express.js](https://expressjs.com/), [PostgreSQL](https://www.postgresql.org/)
- Deployment: [Vercel](https://vercel.com/)
- Package Manager: [pnpm](https://pnpm.io/)

## Getting Started

### Tool installation

Make sure you have the following installed and configured:

- [Node.js](https://nodejs.org/en/download/) (>= 22.x)
- [PostgreSQL](https://www.postgresql.org/download/) (17)
- [pnpm](https://pnpm.io/) (10.12.1)

### Clone the repository

- `git clone https://github.com/yxli001/webregplusplus.git`

- `cd webregplusplus`

### Install dependencies

_Run in root directory_

- `pnpm install`

### Environment variables

**Backend**

Configure a local PostgreSQL instance and put the following fields in a `.env.development` file in the backend root directory:

- `PORT`
- `FRONTEND_ORIGIN`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

### Run the app locally

**Populate DB**

- From the backend directory, run `pnpm run cron-dev`, this should run the scraper (~20 minutes) and populate your local PostgreSQL database.

**Backend**

- `pnpm run dev` will now give you access to the API Endpoints below

**Frontend**

- Create a `.env` files in the frontend directory (NOT inside `src`).
  - Set `NEXT_PUBLIC_BACKEND_HOST` to the origin of your backend server. (e.g. `http://localhost:5000`)
- `pnpm run dev`

The app should now be running on `http://localhost:3000`.

Note: The frontend application runs slowly in dev mode. For a more production optimized build, use `pnpm run build` followed by `pnpm start`.

### Running lint checkers

To ensure code quality and consistency, pre-commit hooks are configured to automatically run lint checks. These can also be manually run via the following commands:

- `pnpm run lint-check`: Runs ESLint and Prettier checks and reports issues without editing files.
- `pnpm run lint-fix`: Automatically fixes simple linting and formatting issues.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Maintainers

- [@yxli001](https://github.com/yxli001)
- [@b-jonathan](https://github.com/b-jonathan)

Issues and suggestions are welcome. Let's build a better scheduling experience for students.
