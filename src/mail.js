const nodemailer = require('nodemailer');

module.exports = class Mail { 

    constructor(mail, ui) {
        this.mail = mail;
        this.ui = ui;
        this.receivers = this.mail.receivers;
    }

    async connect() {
        try {
            this.transporter = nodemailer.createTransport({
                host: this.mail.host,
                port: this.mail.port,
                secure: this.mail.secure,
                auth: {
                user: this.mail.username,
                pass: this.mail.username
                }
            });
            return true;
        } catch (error) {
            this.ui.showError(error);
            return false;
        }
    }

    createMessage(form, data) {
        let formattedData = "\n";
        for (let key in data) {
            formattedData += `${key}: ${data[key]}\n`;
        }        
        return `Hello there!\n
        You have received a new message from the form: ${form}.
        Here are the details:
        ${formattedData}
        Kind regards,
        
        Your friendly Form Submission System`;
    }

    async test() {
        const options = {
            from: "",
            to: "",
            subject: `TEST`,
            text: "TEST"
        };
        try {
            await this.transporter.sendMail(options);
            this.ui.showMessage("Mail sent successfully");
            return {success: true, message: "Test was successful"};
        } catch (error) {
            console.log("Failed to send mail");
            console.log(error)
            return {success: false, message: "There was an error sending the mail. Check the logs for more info."}
        }
    }
    
    async send(form, data) {
        this.ui.showMessage(`Trying to send mail to: ${this.receiver} from the form ${form} and with the message: ${this.createMessage(form, data)}`);
        const options = {
            from: this.mail.username,
            to: this.mail.receivers,
            subject: `New message from form: ${form}`,
            text: this.createMessage(form, data)
        };
        try {
            await this.transporter.sendMail(options);
            return {success: true, message: "Mail sent successfully"};
        } catch (error) {
            this.ui.showError(error);
            return {success: false, message: "There was an error sending the mail. Check the logs for more info."}
        }
    }
}