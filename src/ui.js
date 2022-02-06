module.exports = class UI { 
    constructor(output) {
        this.output = output;
    }
    
    showMessage(message) {
        this.output.log(`Time: ${(new Date).toLocaleString()}; Message: ${String(message || "undefined").replace(/(\r\n|\n|\r)/gm, "")}`);
    }

    showError(error) {
        this.output.log(`Time: ${(new Date).toLocaleString()}; Error: \x1b[31m${String(error || "undefined").replace(/(\r\n|\n|\r)/gm, "")}\x1b[0m`);
    }
}