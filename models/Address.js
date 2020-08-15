var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
    line1: {
        type: String,
        required: true
    },
    line2: {
        type: String
    },
    city:{
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: "hn"
    },
    zipcode: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);