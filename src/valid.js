module.exports = class Valid { 
    constructor(config) {
        this.config = config;
    }

    
    validDBCredentials() {
        if (! "credentials" in this.config) {
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
}