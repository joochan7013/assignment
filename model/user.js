const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    lemail: {
        type: String,
        required: true,
        unique: true
    },
    lpassword: {
        type: String,
        required: true
    },
    type:
    {
        type: String,
        default: "user"
    },
    dateCreate: {
        type: Date,
        default: Date.now()
    }
});

const usermod = mongoose.model('user', userSchema);
module.exports = usermod;
