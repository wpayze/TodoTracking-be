var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParcelSchema = new Schema({
  number: {
      type: Number
  },
  received: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Object
  },
  active: {
    type: Boolean,
    default: true
  },
  tracking: {
    type: String
  },
  provider: {
    type: String
  },
  weight: {
    type: Number
  },
  total: {
    type: Number
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Parcel', ParcelSchema);