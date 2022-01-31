module.exports = class UI { 
    constructor(output) {
        this.output = output;
    }
    
    showMessage(message) {
        this.output.log(`Time: ${(new Date).toLocaleString()}; Message: ${message}`);
    }

    showError(error) {
        this.output.log(`Time: ${(new Date).toLocaleString()}; Error: ${error}`);
    }
}