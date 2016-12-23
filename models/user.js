var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

function toLower (v) {
  return v.toLowerCase();
}

var userSchema = new Schema({
  email: {type: String, required: true, set: toLower},
  password: {type: String, required: true},
  username: {type: String, required: true, set: toLower}
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
