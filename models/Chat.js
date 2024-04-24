const mongoose = require('mongoose');

const Chat = {
    mem1: {
        type: String,
        required: true
    },
    mem2: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
    }
}

const ChatModel = mongoose.model("chat", Chat);

module.exports = ChatModel;