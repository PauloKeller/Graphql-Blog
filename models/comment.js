const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    body: String,
    authorId: String,
    postId: String
})

module.exports = mongoose.model('Comment', commentSchema)