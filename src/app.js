const express = require('express')
const UI = require('./ui.js')
const DB = require('./db.js')
const config = require('../config.json') // Make sure that you add a config.json file to the root of the project. Reference can be seen in config.json.example

if (config != undefined && config != null) {

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
	})

	app.get('/', (request, response) => {
		// Return API documentation
		response.send('Hello World!')
	})

	app.listen(port, () => {ui.showMessage(`Server started on port ${port}`)})
}

