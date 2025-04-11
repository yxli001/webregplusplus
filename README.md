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
- Backend: Express.js, TypeScript
- Deployment: Vercel (frontend), Render or similar (backend)

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

cd frontend npm install

**Backend**

cd ../backend npm install

### Run the app locally

**Backend**

pnpm run dev


**Frontend (in a separate terminal)**
cd ../frontend pnpm run dev

The app should now be running on `http://localhost:3000`.

Note: The frontend application runs slowly in dev mode. For a more optimized program, use pnpm run build followed by pnpm start

## Algorithm Overview

The scheduling logic in `mutate.ts` works by:

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
