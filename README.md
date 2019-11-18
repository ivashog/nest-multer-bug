# nest-multer-bug

## Description

Repository for reproduce issue https://github.com/nestjs/nest/issues/3413

## Installation

```bash
$ git clone git@github.com:ivashog/nest-multer-bug.git
$ cd nest-multer-bug
$ npm install
```

## Running the app

Before first running app configure you project environments:

-   copy `.env.example` to `.env`
-   set up you environments variables for use app
-   run one of the following command:

```bash
# Development mode
$ npm run start

# Watch development mode
$ npm run start:dev
```

more scripts view in `package.json` file.

# Reproducing bug

-   Install and run app (dont't forget copy `.env.example` to `.env`)
-   Open something like Postman* and POST `multipart/form-data` request 
to http://localhost:3001/api/v1/csv/upload
 with test csv data from folder `./test-csv-data`:
    -   if you select less or equal files as CSV_MAX_FILES (2 by default) everything is OK
    -   but if you select more - you must get an error:
    ```UnhandledPromiseRejectionWarning: TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be one of type string or Buffer. Received type object ...```

*- You can not using swagger because swagger 2.0 don't support multiple files upload from ui



