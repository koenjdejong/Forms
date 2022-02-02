const {MongoClient} = require('mongodb');

module.exports = class DB { 

    constructor(db, ui) {
        this.db = db;
        this.ui = ui;
        this.uri = `mongodb://${encodeURIComponent(this.db.username)}:${encodeURIComponent(this.db.password)}@${encodeURIComponent(this.db.host)}`;
        console.log(this.uri);
    }
    
    async connect() {
        const client = new MongoClient(this.uri, {useNewUrlParser: true});
        try {
            await client.connect();
            return true;
        } catch (error) {
            this.ui.showError(error);
            return (false, "There was an database connection error. Check the logs for more info.");
        } finally {
            await client.close()
        }
    }    

    async createCollection(collection, api_key) {
        
    }

    async insertForm(collection, data) {
        this.ui.showMessage(`Inserting form data into ${JSON.stringify(data)}`);
        Object.keys(data)
        
        const client = new MongoClient(this.uri, {useNewUrlParser: true});
        try {
            await client.connect();
            const db = client.db(this.db.name);
            const collectionSelected = db.collection(collection);
            await collectionSelected.insertOne(data);
            return true;
        } catch (error) {
            this.ui.showError(error);
            return (false, "There was an database connection error. Check the logs for more info.");
        } finally {
            await client.close()
        }
    }

}