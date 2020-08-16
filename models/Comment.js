const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: String,
    timestamp: Date
});

module.exports = mongoose.model('Comment', CommentSchema);
