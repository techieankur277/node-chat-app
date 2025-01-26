const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            // ref: 'User',
            required: true,
        },

        type: {
            type: Number,
            required: true,
            enum: [1, 2],
            default: 1,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: {
            type: String,
        },
        timestamps: true,
    }
);

sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1200 });
const Session = mongoose.model('Session', sessionSchema);
module.exports = { Session };
