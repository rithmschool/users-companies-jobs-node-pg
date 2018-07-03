# Express + PG - Users / Companies / Jobs

## Part I - Users

- Create a table for users, each user should have a:

  - first_name
  - last_name
  - email
  - photo

- Create an API that has the following five routes:

  - `GET /users` - this should return a list of all the user objects
  - `GET /users/:id` - this should return a single user found by its id
  - `POST /users` - this should create a new user
  - `PATCH /users/:id` - this should update an existing user and return the updated user
  - `DELETE /users/:id` - this should remove an existing user and return the deleted user

- **BONUS** - add a front-end that allows for seeing all the users, creating new users and deleting users. Do not worry about any kind of authentication/authorization.

- **SUPER BONUS** - add front-end functionality for updating users. This will involve writing quite a bit more jQuery to accomplish this task.

- **SUPER BONUS** - refactor your jQuery app to use vanilla JavaScript.

## Part II - Companies

**Before you continue, make sure you have completed the exercises in the previous section. This exercise builds off of the previous exercise.**

Create a table for `companies`, each company should have a:

- name
- logo

- Next, add a column to your users table called `company_id` which is a foreign key that references the companies table. In this relationship, one company has many users, and each user belongs to a single company. Make sure then when a company is deleted, all of the users associated with that company are deleted also.

* Create an API that has the following five routes:

  - `GET /companies` - this should return a list of all the company objects
  - `GET /companies/:id` - this should return a single company found by its id and include all the users associated with it
  - `POST /companies` - this should create a new company
  - `PATCH /companies/:id` - this should update an existing company and return the updated company
  - `DELETE /companies/:id` - this should remove an existing company and return the deleted company

* When the API returns the companies, it should include all of the users the company is associated with. When the API returns a single company object, it should include all of the users the company is associated with.

## Part III - Jobs

**Before you continue, make sure you have completed the exercises in the previous sections. This exercise builds off of the previous exercise.**

- Add a table for `jobs`, each job should have a:

  - title
  - salary
  - equity
  - company_id

- `jobs` has a one to many relationship with `companies` which means there is a foreign key in the jobs table that references the companies table. In this relationship, one company has many jobs, and each job belongs to a single company. Make sure then when a company is deleted, all of the jobs associated with that company are deleted also.

- `jobs` is also a many to many relationship with `users`. This means you'll also have to create a join table for these two associations. You can call that table `jobs_users` and it should contain a `job_id` and `user_id`.

- Make sure your application has the following routes:

`GET /jobs/:id` - this route should show information about a specific job as well as the company and all the users associated with that job
`GET /jobs` - this route should list all of the jobs and all of the users associated with those jobs.
`GET /companies` - this route should show information about all of the companies as well as all of the jobs associated with that company

### Solutions

To get any of these solutions running locally:

1.  Fork/clone the repository
2.  `cd` into a folder
3.  `npm install`
4.  `psql < schema.sql`
5.  `nodemon` or `node app.js`
