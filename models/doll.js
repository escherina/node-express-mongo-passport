var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dollSchema = new Schema({
  name: {type: String, required: true},
  type-body: {type: String, required: true},
  type-head: {type: String, required: true},
  image: {type: String}
});

module.exports = mongoose.model('Doll', dollSchema);
