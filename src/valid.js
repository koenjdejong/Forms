const DB = require('./db.js');
const UI = require('./ui.js');
const Mail = require('./mail.js');

module.exports = class Valid {
    constructor(config) {
        this.config = config;
    }

    validConfig() {
        return this.config === undefined || this.config === null || this.config === {};
    }
    
    validPort() {
        if (this.config.port === undefined || this.config.port === null) {
            return false;
        }
        try {
            return 0 < parseInt(this.config.port) < 65535;
        }
        catch (error) {
            return false;
        }
    }

    validDBCredentials() {
        if (! "credentials" in this.config && ! "db" in this.config.credentials) {
            return false;
        }
        if (! "port" in this.config) {
            return false;
        }
        let fields = ['host', 'port', 'user', 'password', 'database'];
        for (let field in fields) {
            if (! field in this.config.credentials.db){
                return false
            }
        }
        return true;
    }

    validDBConnection() {
        // replace with .then
        return new DB(this.config.credentials.db, new UI()).connect().then(reply => {console.log(reply)});
    }

    validMailCredentials() {
        if (! "mail" in this.config.credentials) {
            return false;
        }
        let fields = ['host', 'port', 'secure', 'username', 'password', 'receivers'];
        for (let field in fields) {
            if (! field in this.config.credentials.mail){
                return false
            }
            if (field === "receivers" && type(this.config.mail.receivers) !== "array") {
                return false;
            }
        }
        return true;
    }

    validMailConnection() {
        let mail = new Mail(this.config.credentials.mail, new UI())
        if (mail.connect()) {
            return mail.test().then(response => {console.log(response)});;
        }
        return false;
    }
}