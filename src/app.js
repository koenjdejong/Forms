const path = require('path');
const express = require('express')
const UI = require('./ui.js')
const DB = require('./db.js')
const Valid = require('./valid.js')
const config = require('../config.json') // Make sure that you add a config.json file to the root of the project. Reference can be seen in config.json.example

const ui = new UI(console);

if (config != undefined && config != null && new Valid(config).validDBCredentials()) {
	const db = new DB(config.credentials.db, ui)

	const app = express()
	const port = config.port
	app.use(express.json())
	app.use(express.static('../static'))

	db.connect().then((success) => {ui.showMessage(`MongoDB connection: ${success ? "succeeded" : "failed"}`)});

	app.get('/server/status', (request, response) => {
		response.send({
			success: true,
			status: "OK",
			message: "Server is running",
			uptime: process.uptime()
		})
	})

	app.get('/', (request, response) => {
		// response.send({success: true, message: 'Currently no API documentation published!'})
		response.sendFile(path.join(__dirname, '../static/docs/index.html'))
	})

	app.post('/forms/:form/submit', (request, response) => {
		if (request.params.form === undefined || request.params.form === null) {
			response.send({success: false, message: "No form name provided"})
			return
		}
		if (request.body === undefined || request.body === null || request.body === {}) {
			response.send({success: false, message: "No data provided"})
			return
		}
		db.insertForm(request.params.form, request.body).then((reply) => {response.send(reply)}).catch((error) => {ui.showError(error); response.send({success: false, message: "An unforeseen error occured"})})
	})

	app.post("/forms/:form/create", (request, response) => {
		if (request.get("api-key") === undefined || request.get("api-key") === null) {
			response.send({success: false, message: "No API key provided"})
			return
		}
		if (request.params.form === undefined || request.params.form === null) {
			response.send({success: false, message: "No form name provided"})
			return
		}
		db.createForm(request.params.form, request.get("api-key")).then((reply) => {response.send(reply)}).catch((error) => {ui.showError(error); response.send({success: false, message: "An unforeseen error occured"})})
	})	

	app.listen(port, () => {ui.showMessage(`Server started on port ${port}`)})
} else {
	ui.showMessage(`No valid config.json file found. Please make sure that you have a config.json file in the root of the project and it uses the correct format specified in config.json.example.`)
}
