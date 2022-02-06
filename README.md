# Form Submission API
___
> Author: [Koen de Jong](https://url.koendejong.net/github)
___

## Description
This API can be used for creating and submitting forms. It uses MongoDB for storing the form data, so when a form is edited, no change is required. 
A config.json file is required for the API to work. This file contains database and mail credentials. 
Test cases for the above specified file will be ran at the start of the program, but can be avoided by using the --no-test flag. 

## Libraries
- [NodeJS 14.x](https://nodejs.org/en/download/)
- [ExpressJS 4.x](https://expressjs.com/en/api.html)
- [MongoDB 4.x](https://docs.mongodb.com/drivers/node/current/)

## Installation
Required: NodeJS 14.x, MongoDB database access

Add your details to the `config.json` file. Use the config.json.example file as a template.

To run the API locally:
```node app.js```

For a production server, use this [guide](https://expressjs.com/en/advanced/best-practice-performance.html)

### TODO
- [ ] Create spamfilter
- [ ] Create logging mechanism to files
- [ ] Get IP from request and log, as well as other stuff
- [ ] Create static data for each request, such as IP, useragent, date and time etc
- [ ] Maybe have something every request needs to have, name, title and email and message or something
    - This is to make sure that the form is not filled in with random data
    - Can be done by a template when creating and storing that in db under specific name?