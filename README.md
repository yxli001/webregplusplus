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

- Frontend: Next.js, TypeScript, TailwindCSS
- Backend: Express.js, TypeScript, PostgreSQL
- Deployment: Vercel (frontend)

## Project Structure

webregplusplus/

├── frontend/ # Next.js frontend

├── backend/ # Express + TypeScript backend

├── .husky/ # Git hooks

├── .secret-scan/ # Secret scan rules

└── README.md

## Getting Started

### Clone the repository

git clone https://github.com/yxli001/webregplusplus.git

`cd webregplusplus`

### Install dependencies

_Run in root directory_
`pnpm install`

### Environment variables

**Backend**

Configure a local PostgreSQL instance and put the following fields in the backend `.env` file:

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

- `pnpm run dev`

The app should now be running on `http://localhost:3000`.

Note: The frontend application runs slowly in dev mode. For a more optimized program, use pnpm run build followed by pnpm start

### API Endpoints:

- GET `/api/course`
  - No params
  - Returns list of all courses, only containing the course subject and code
  - Intended to be used to generate the course dropdown list
- GET `/api/course/details?courses=[courses]`
  - Returns course full detail for the list of courses specified in the `courses` param
  - `courses` param should be a string of comma separated course full names joined by a `+`, e.g. `"CSE+100,CSE+101,MATH+183"`

Steps to test:

- First configure a local PostgreSQL instance and put the following fields in the backend `.env.development` file
  - `PORT`
  - `FRONTEND_ORIGIN`
  - `POSTGRES_HOST`
  - `POSTGRES_PORT`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`

## Algorithm Overview

The scheduling logic in `scheduler.ts` works by:

- Generating 5 random schedules initially
- Selecting a random lecture or subsection to mutate
- Attempting replacement through `mutateMainSection` or `mutateSubSection`
- Accepting replacements only if they improve schedule fitness or pass a probabilistic check using Monte Carlo acceptance
- Caching evaluated schedules to avoid recomputation

This results in an optimized schedule that balances user preferences and constraints.

## Screenshots

_Screenshots will be added soon._

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Maintainers

- [@yxli001](https://github.com/yxli001)
- [@b-jonathan](https://github.com/b-jonathan)

Issues and suggestions are welcome. Let's build a better scheduling experience for students.
