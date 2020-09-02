const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {type: Number, unique: true},
    username: {type: String},
    email: {type: String, unique: true},
    password : {type: String}
 })

const user = mongoose.model('user', userSchema);
let admin = {
    email: 'hashim@gmail.com',
    password: '1234'
}


exports.user = user;
exports.admin = admin;