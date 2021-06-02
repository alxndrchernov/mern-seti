const {Schema, model, Types} = require('mongoose')

const schema = new Schema(
    {
        title: {
            type: String,
            required: false,
            trim: true
        },
        description: {
            type: String,
            required: false,
            trim: true
        },
        file_path: {
            type: String,
            required: false
        },
        file_mimetype: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('File', schema)