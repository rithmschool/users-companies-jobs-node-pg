# Express + PG - Users / Companies / Jobs

## Part I - Users

- Create a table for users, each user should have a:

  - first_name
  - last_name
  - email
  - photo

- Here is what a user object looks like:

  ```json
  {
    "id": 1,
    "first_name": "Michael",
    "last_name": "Hueter",
    "email": "michael@rithmschool.com",
    "photo": "https://avatars0.githubusercontent.com/u/13444851?s=460&v=4",
    "current_company_id": 1, // ONE-TO-ONE with Companies --> THIS IS IMPLEMENTED IN THE NEXT SECTION
    "applied_to": [2, 3] // MANY-TO-MANY with Jobs --> THIS IS IMPLEMENTED IN THE FINAL SECTION
  }
  ```

- Create an API that has the following five routes:

  - `POST /users` - this should create a new user
  - `GET /users` - this should return a list of all the user objects
  - `GET /users/:id` - this should return a single user found by its `id`
  - `PATCH /users/:id` - this should update an existing user and return the updated user
  - `DELETE /users/:id` - this should remove an existing user and return the deleted user

- **BONUS** - add a frontend that allows for seeing all the users, creating new users and deleting users. Do not worry about any kind of authentication/authorization.

- **BONUS** - add front-end functionality for updating users. This will involve writing quite a bit more jQuery to accomplish this task.

- **BONUS** - Use vanilla JavaScript instead of jQuery.

## Part II - Companies

**Before you continue, make sure you have completed the exercises in the previous section. This exercise builds off of the previous exercise.**

Create a table for `companies`, each company should have a:

- name
- logo

- Next, add a column to your users table called `current_company_id` which is a foreign key that references the companies table. In this relationship, one company has many users, and each user belongs to a single company. Make sure then when a company is deleted, all of the users associated with that company are deleted also.

- Create an API that has the following five routes:

  - `POST /companies` - this should create a new company
  - `GET /companies` - this should return a list of all the company objects
  - `GET /companies/:id` - this should return a single company found by its id
  - `PATCH /companies/:id` - this should update an existing company and return the updated company
  - `DELETE /companies/:id` - this should remove an existing company and return the deleted company

- When the API returns the companies, it should include all of the ids the company is associated with under an `employees` key.

- Here is what a company object looks like:

  ```json
  {
    "id": 1,
    "name": "Rithm School",
    "logo":
      "https://avatars3.githubusercontent.com/u/2553776?s=400&u=18c328dafb508c5189bda56889b03b8b722d5f22&v=4",
    "employees": [1, 2], // MANY-TO-ONE with Users
    "jobs": [2, 3] // ONE-TO-MANY with Jobs --> THIS IS IMPLEMENTED IN THE FINAL SECTION
  }
  ```

## Part III - Jobs

**Before you continue, make sure you have completed the exercises in the previous sections. This exercise builds off of the previous exercise.**

- Add a table for `jobs`, each job should have a:

  - title
  - salary
  - equity
  - company_id

- `jobs` has a one to many relationship with `companies` which means there is a foreign key in the jobs table that references the companies table. In this relationship, one company has many jobs, and each job belongs to a single company. Make sure then when a company is deleted, all of the jobs associated with that company are deleted also.

- `jobs` is also a many to many relationship with `users`, because a user can apply to many jobs. This means you'll also have to create a join table for these two associations. You can call that table `jobs_users` and it should contain a `job_id` and `user_id`. On the user response objects, you'll add a key called `applied` that lists the job IDs that a user has applied to.

- Make sure your application has the following routes:

`POST /jobs` - this route creats a new job
`GET /jobs` - this route should list all of the jobs.
`GET /jobs/:id` - this route should show information about a specific job
`PATCH /jobs/:id` - this route should let you update a job by its ID
`DELETE /jobs/:id` - this route lets you delete a job posting

- Here is what a job object looks like:

  ```js
  {
    "data": {
      "title": "Software Engineer",
      "salary": "100000",
      "equity": 4.5,
      "company_id": 1
    }
  }
  ```

### Solutions

To get any of these solutions running locally:

1.  Fork/clone the repository
2.  `cd` into a folder
3.  `npm install`
4.  `psql < schema.sql`
5.  `nodemon` or `node app.js`
