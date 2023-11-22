import mongoose from 'mongoose'

const Schema = mongoose.Schema

const suggestionSchema = new Schema ({
    title: String,
    category: String,
    description: String,
    status: String,
    upvotes: Number,
    userId: Schema.Types.ObjectId,
    comments: [{
        _id: Schema.ObjectId,
        content: String,
        user: {
            image: String,
            name: String,
            username: String,
            userId: Schema.Types.ObjectId
        },
        replies: [{
            content: String,
            replyingTo: String,
            user: {
                image: String,
                name: String,
                username: String,
                userId: Schema.Types.ObjectId
            }
        }]
    }]
})

const Suggestion = mongoose.model("Suggestion", suggestionSchema)

export default Suggestion