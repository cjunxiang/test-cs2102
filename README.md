## CS2102 Team 3
AY20/21 Semester 1 

## Setting Up

- Create a `.env` file under `/node-server` , template is .env.template
- Get the credentials from the team

## Development Workflow

- Checkout a new branch from `master`
- Make your changes
- Create a PR to merge back into `master`

- Frontend on port 3000, Backend on port 3001

### Front-End Development
- Instead of NPM, we will use YARN
  - `yarn add <package_name> (equivilant to npm i <package_name>)`
  - `yarn (equivilant to npm install)`
  - `yarn remove <package>`
- Each Page/Component placed in `/src` (there is no organisation because the module doesn't require it)
  
### Server Development
- Each set of queries are placed in individual abstracted .js file in `node-server/database`
- entry file serving the express server is `node-server/index.js`
- API routings are handled in `node-server/api.js`

- hosted on https://cs2102-petshop.herokuapp.com/

## Scripts
### On `Root Folder`:
- Run `npm start:all` to run both backend and frontend concurrently
- Run `npm start` to run only backend
- Run `npm run start-fe` to run only frontend

### in `/node-server`
- Run `npm run lint` to check for linting errors/warnings
- Run `npm run lint-fix` to let eslint fix errors/warnings
- Run `npm run prettier` to let Prettier make formatting changes
- Run `npm run prettier-check` to see list of files that require changes by Prettier
- Run `node index.js` to start server


### What's the difference between [Prettier and eslint](https://prettier.io/docs/en/comparison.html)?

tldr: use Prettier for formatting and eslint for catching bugs.

eslint rules can be found [here](https://eslint.org/docs/rules/).

<br>

#### Contributed by:
- Aw Meng Shen A0167441E
- Lim Jun Hup A0189778X
- Chew Kah Meng A0167500M
- Chong Jin Hwa Brandon A0180295B
- Cheng Jun Xiang A0167580X


## Preliminary Constraints
1. A user is identified by their email, and their payment credentials must be recorded.
1. Caretakers must have their availability date ranges (consist of a start date and end date each) recorded.
1. When a new User creates a new account, if they are a pet owner, they must create at least one profile for their pet(s) during account registration.
1. Each Pet is identified by their name and Pet Owner email.
1. Each Pet Owner cannot name two pets with the same name.
1. Each bid is identified by Caretaker email and Pet Owner email.
1. Each user is either a PCS administrator, Caretaker or a Pet Owner. 
1. Each caretaker is either a full time employee or part time employee. 
1. Each caretaker can only receive at most one paycheck every month.
1. Each Caretaker can only take care of pets they can care for.
1. A Caretaker may take care of more than one pet at a given time.
1. If a part-time caretaker does not accept a successful bid after a given duration, and there are more than one successful bids for this caretaker, the bid with the highest price will be automatically allocated to the caretaker.
1. A caretaker can take care of up to 5 pets at any one time.
1. When there is a bid by a Pet Owner, a full-time caretaker will always accept the job immediately if the Caretaker is available during the date range and is not currently taking care of 5 pets.
1. Each full-time caretaker must work for a minimum of 2 x 150 consecutive days a year.
1. Full-time caretaker cannot apply for leave if there is at least one Pet under their care.
1. Part-time caretaker cannot take care of more than 2 pets unless they have a good rating (>= 4 out of 5)
1. Base daily price will increase with the rating of the caretaker but will never be below the base price.
1. Full-time caretaker will receive a salary of $3000 per month for up to 60 pet days. 
1. For any excess pet-day, they will receive 80% of their price as bonus.
1. For part-time caretaker, PCS will take 25% of their price as payment (caretaker receives 75% of their stated price)

## ER Diagram
![ER Diagram](https://github.com/CS2102-Team3/cs2102_2021_S1_Team3/blob/master/team3_cs2102_erd.png?raw=true)
