const path = require('path');
const express = require('express')
const UI = require('./ui.js')
const DB = require('./db.js')
const Mail = require('./mail.js')
const Valid = require('./valid.js')
const config = require('../config.json'); // Make sure that you add a config.json file to the root of the project. Reference can be seen in config.json.example
const { exit } = require('process');

const ui = new UI(console);

function test() {
	const valid = new Valid(config);
	if (valid.validConfig()) {
		ui.showMessage("No valid config.json file found. Please make sure that you have a config.json file in the root of the project and it uses the correct format specified in config.json.example.")
		return false;
	}
	if (!valid.validMailCredentials()) {
		ui.showError("Undefined mail credentials in config.json file. Please refer to config.json.example for more info.");
		return false;
	}
	if (!valid.validMailConnection()) {
		ui.showError("Could not connect to mail server. Please check your credentials in config.json file.");
		return false;
	}
	if (!valid.validDBCredentials()) {
		ui.showError("Undefined database credentials in config.json file. Please refer to config.json.example for more info.");
		return false;
	}
	if (!valid.validDBConnection()) {
		ui.showError("All database details were found, but a connection could not be made. Please check your database credentials.");
		return false;
	}
	if (!valid.validPort()) {
		ui.showError("Invalid port number in config.json file. Please refer to config.json.example for more info. Port number should be between 0 and 65535.");
		return false;
	}
	if (config.port === undefined || config.port === null) {
		ui.showError("Undefined port in config.json file. Please refer to config.json.example for more info.");
		return false;
	}
	return true;
}

function main() {
	const mail = new Mail(config.credentials.mail, ui)
	mail.connect()
	const db = new DB(config.credentials.db, ui, mail)

	const app = express()
	const port = config.port
	app.use(express.json())
	app.use(express.static('../static'))

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
}

const args = process.argv.slice(2)
if (!args.includes("--no-test")) {
	let success = test();
	success ? ui.showMessage("Test completed without errors.") : ui.showError("Test failed. Errors shown above.")
	success ? main() : exit(1)
} else {
	main()
}
