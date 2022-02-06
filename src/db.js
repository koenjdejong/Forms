const {MongoClient} = require('mongodb');

module.exports = class DB { 

    constructor(db, ui, mail) {
        this.db = db;
        this.ui = ui;
        this.mail = mail;
        this.uri = `mongodb://${encodeURIComponent(this.db.username)}:${encodeURIComponent(this.db.password)}@${encodeURIComponent(this.db.host)}`;
        this.restrictedCollections = ["api_keys", "users", "main"];
    }
    
    async connect() {
        const client = new MongoClient(this.uri, {useNewUrlParser: true});
        try {
            await client.connect();
            return {success: true, message: "MongoDB connection succeeded"};
        } catch (error) {
            this.ui.showError(error);
            return {success: false, message: "There was an database connection error. Check the logs for more info."}
        } finally {
            await client.close()
        }
    }    

    async getForms(db) {
        let collectionList = await db.listCollections().toArray();
        let collectionNames = [];
        for (let i = 0; i < collectionList.length; i++) {
            collectionNames.push(collectionList[i].name);
        }
        this.ui.showMessage(`Forms: ${JSON.stringify(collectionNames)}`);
        return collectionNames;
    }

    
    async insertForm(form, data) {
        this.ui.showMessage(`Trying to insert data: ${JSON.stringify(data)} to form: ${form}`);     
        const client = new MongoClient(this.uri, {useNewUrlParser: true});
        try {
            await client.connect();
            const db = client.db(this.db.database);
            if ((await this.getForms(db)).includes(form) && !this.restrictedCollections.includes(form)) {
                const formSelection = db.collection(form);
                await formSelection.insertOne(data);
                let reply = await this.mail.send(form, data);
                if (reply.success) {
                    return {success: true, message: "Data inserted successfully & mail sent successfully"};
                } else {
                    return {success: true, message: "Data inserted successfully, mail failed to send"};
                }
            }
            return {success: false, message: "Form does not exist"};
        } catch (error) {
            this.ui.showError(error);
            return {success: false, message: "There was an database connection error. Check the logs for more info."}
        } finally {
            await client.close()
        }
    }

    async createForm(form, api_key) {
        const client = new MongoClient(this.uri, {useNewUrlParser: true});
        try {
            await client.connect();
            const db = client.db(this.db.database);
            if ((await this.validAPIKey(db, api_key)).success) {
                if (!(await this.getForms(db)).includes(form)) {
                    await db.createCollection(form);
                    return {success: true, message: "Form Collection created successfully"};
                }
                return {success: false, message: "Form already exists"};
            }
            return {success: false, message: "Invalid API key"};
        } catch (error) {
            this.ui.showError(error);
            return {success: false, message: "There was an database connection error. Check the logs for more info."}
        } finally {
            await client.close()
        }
    }

    async validAPIKey(db, api_key) {
        const api_keys = db.collection("api_keys")
        let api_key_data = await api_keys.findOne({api_key: api_key});
        if (api_key_data) {
            return {success: true, message: "API key is valid"};
        }
        return {success: false, message: "API key is invalid"};
    }
}