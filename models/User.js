const mongoose = require('mongoose');

const User = {
    username: {
        type: String,
        requied: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    profileUrl: {
        type: String,
        required: false,
        unique: false,
    }
}

const UserModel = mongoose.model("user", User);

module.exports = UserModel;