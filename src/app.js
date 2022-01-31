const express = require('express')
const UI = require('./ui.js')
const DB = require('./db.js')
const config = require('../config.json') // Make sure that you add a config.json file to the root of the project. Reference can be seen in config.json.example

if (config != undefined && config != null) {
	const ui = new UI(console);
	const db = new DB(config.credentials.db, ui)
	//validate config

	const app = express()
	const port = 3000

	let response = db.connect();
	response.then((success) => {ui.showMessage(`MongoDB connection: ${success ? "succeeded" : "failed"}`)})

	app.get('/server/status', (request, response) => {
		response.send({
			success: true,
			status: "OK",
			message: "Server is running",
			uptime: process.uptime()
		})
	})

	app.get('/', (request, response) => {
		// Return API documentation
		response.send('Hello World!')
	})

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
}

