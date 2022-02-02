const {MongoClient} = require('mongodb');

module.exports = class DB { 

    constructor(db, ui) {
        this.db = db;
        this.ui = ui;
        this.uri = `mongodb://${encodeURIComponent(this.db.username)}:${encodeURIComponent(this.db.password)}@${encodeURIComponent(this.db.host)}`;
        this.restrictedCollections = ["api_keys", "users", "main"];
        console.log(JSON.stringify(this.db));
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
                return {success: true, message: "Form data inserted successfully"};
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
            if (api_key == this.db.api_key) {
                if (!(await this.getForms(db)).includes(form)) {
                    await db.createCollection(form);
                    return {success: true, message: "Collection created successfully"};
                }
                return {success: false, message: "Collection already exists"};
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
        if (api_key == this.db.api_key) {
            return {success: true, message: "Valid API key"};
        }
        return {success: false, message: "Invalid API key"};
    }
}