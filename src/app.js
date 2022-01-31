let requirements = ['express', 'mongodb',]
for (let requirement in requirements) {
	try {
		require(requirement);
	} catch (e) {
		console.log(`Could not import ${requirement}`);
	}
}


const express = require('express')
const UI = require('./ui.js')
const DB = require('./db.js')
const Valid = require('./validdd.js')
const config = require('../config.json') // Make sure that you add a config.json file to the root of the project. Reference can be seen in config.json.example

if (config != undefined && config != null) {
<<<<<<< Updated upstream
	const ui = new UI(console);
	const db = new DB(config.credentials.db, ui)
	//validate config
=======
	validator = new Valid();

	if (validator.validDBCredentials()) {
		const db = new DB(config.credentials.db);
		db.connect();

	
>>>>>>> Stashed changes


<<<<<<< Updated upstream
	let response = db.connect();
	response.then((success) => {ui.showMessage(`MongoDB connection: ${success ? "succeeded" : "failed"}`)})

	app.get('/server/status', (request, response) => {
		response.send({
			success: true,
			status: "OK",
			message: "Server is running",
			uptime: process.uptime()
=======

		const ui = new UI(console);
		//validate config

		const app = express()
		const port = 3000

		app.get('/server/status', (request, response) => {
			response.send({
				success: true,
				status: "OK",
				message: "Server is running",
				uptime: process.uptime()
			})
>>>>>>> Stashed changes
		})

		app.get('/', (request, response) => {
			// Return API documentation
			response.send('Hello World!')
		})

<<<<<<< Updated upstream
	app.post('/forms/:form/submit', (request, response) => {
		let dbResponse = db.insertForm(request.params.form, request.body);
		dbResponse.then((success, message) => {
			response.send({
				success: success,
				message: message
			})
		})
	})

	app.listen(port, () => {ui.showMessage(`Server started on port ${port}`)})
=======
		app.listen(port, () => {ui.showMessage(`Server started on port ${port}`)})
	}
>>>>>>> Stashed changes
}

