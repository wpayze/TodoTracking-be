var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
  name: {
    type: String,
    required:true
  },
  rtn: {
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

module.exports = mongoose.model('Company', CompanySchema);