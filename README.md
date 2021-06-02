# Backend Challenge

## How to run:

- To run the project it is necessary to have [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/) installed

 <br />

- After install docker and docker-compose, clone this project:

```console
$ git clone https://github.com/antunesgabriel/backend-challenge && cd backend-challenge
```

 <br />

- After clone, copy .env.example to .env, set the values of the variables DB_PASSWORD and B_USERNAME:

```console
$ cp .env.example .env

$ vi .env
```

```.env
# development, production
 APP_ENV=development
 SERVER_PORT=3333
 DB_PASSWORD= #Your password
 DB_USERNAME= #Your username
 DB_DATABASE_NAME=challenge
```

  <br />

- After define .env, go up the containers:

```console
$ docker-compose up --build -d
```

  <br />

- Then your API will be available at http://localhost:3333:

```console
$ curl http://localhost:3333

// Hello World!
```

- Check API documentation in http://localhost:3333/docs

<br />

## How to run test:

- With the containers started, enter inside the api container:

```console
$ docker exec -it nest bash

root@ce8424e17fe1:/usr/src/app#
```

- Execute test command:

```console
root@ce8424e17fe1:/usr/src/app# npm run test:watch

No tests found related to files changed since last commit.
Press `a` to run all tests, or run Jest with `--watchAll`.

Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.

// chose your option // (a) run all tests
```
