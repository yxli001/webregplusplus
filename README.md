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

cd webregplusplus

### Install dependencies

**Frontend**

cd frontend pnpm install

**Backend**

cd ../backend pnpm install

### Run the app locally

**Backend**

- In `index.ts`, uncomment the call to `updateSchedules()` on line 138
- Start the server with `pnpm run dev`, it will now scrape schedule of classes and populate your local database
- THIS SHOULD ONLY BE DONE ONCE (it may run multiple instances, be wary of this and make sure to end the program or it may populate your tables multiple times)
- Comment out line 138 again
- `pnpm run dev` will now give you access to the API Endpoints below


API Endpoints:
- GET `/api/course`
    - No params
    - Returns list of all courses, only containing the course subject and code 
    - Intended to be used to generate the course dropdown list
- GET `/api/course/details?courses=[courses]`
    - Returns course full detail for the list of courses specified in the `courses` param
    - `courses` param should be a string of comma separate course full names, e.g. `"CSE 100,CSE101,MATH183"`
      
Steps to test:
- First configure a local PostgreSQL instance and put the following fields in the backend `.env` file
    - `PORT`
    - `FRONTEND_ORIGIN`
    - `POSTGRES_HOST`
    - `POSTGRES_PORT`
    - `POSTGRES_USER`
    - `POSTGRES_PASSWORD`
    - `POSTGRES_DB`
 
  

**Frontend (in a separate terminal)**
`cd ../frontend pnpm run dev`

The app should now be running on `http://localhost:3000`.

Note: The frontend application runs slowly in dev mode. For a more optimized program, use pnpm run build followed by pnpm start

## Algorithm Overview

The scheduling logic in `scheduler.ts` works by:

- Generating 5 random schedules initially
- Selecting a random lecture or subsection to mutate
- Attempting replacement through `mutateMainSection` or `mutateSubSection`
- Accepting replacements only if they improve schedule fitness or pass a probabilistic check using Monte Carlo acceptance
- Caching evaluated schedules to avoid recomputation

This results in an optimized schedule that balances user preferences and constraints.

## Issues
If you select a class which has a location, time, instructor listed as TBA, it will not show in the scheduler and hence create a schedule with missing values.

## Screenshots

_Screenshots will be added soon._

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Maintainers

- [@yxli001](https://github.com/yxli001)
- [@b-jonathan](https://github.com/b-jonathan)

Issues and suggestions are welcome. Let's build a better scheduling experience for students.
