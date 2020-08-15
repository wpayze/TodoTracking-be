var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    last_name: {
        type: String,
        required:true
    },
    locker: {
        type: Number,
        required:true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    identification: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    cellphone: {
        type: Number
    },
    telephone: {
        type: Number
    }

}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);