const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: String,
    from: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);
