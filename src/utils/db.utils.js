const mongoose = require('mongoose');
const colorette = require('colorette');

class MongoDBService {
    constructor(dbURI) {
        this.dbURI = dbURI;
        this.connection = null;
    }

    async connect() {
        try {
            this.connection = await mongoose.connect(this.dbURI);
            console.log(colorette.blue('MongoDB connected successfully'));
        } catch (error) {
            console.error('MongoDB: connection error:', error);
            process.exit(1);
        }
    }

    async disconnect() {
        if (this.connection) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected successfully');
        }
    }

    async create(Model, data) {
        try {
            const newDoc = new Model(data);
            await newDoc.save();
            return newDoc;
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    }

    async findOne(Model, criteria) {
        try {
            const document = await Model.findOne(criteria);
            return document;
        } catch (error) {
            console.error('Error finding document:', error);
            throw error;
        }
    }

    async find(Model, criteria) {
        try {
            const document = await Model.findOne(criteria);
            return document;
        } catch (error) {
            console.error('Error finding document:', error);
            throw error;
        }
    }


    async findAll(Model) {
        try {
            const documents = await Model.find();
            return documents;
        } catch (error) {
            console.error('Error finding documents:', error);
            throw error;
        }
    }

    async update(Model, criteria, updateData) {
        try {
            const updatedDoc = await Model.findOneAndUpdate(criteria, updateData, {
                new: true,
            });
            return updatedDoc;
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    async delete(Model, criteria) {
        try {
            const deletedDoc = await Model.findOneAndDelete(criteria);
            return deletedDoc;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }
}

module.exports = MongoDBService;
