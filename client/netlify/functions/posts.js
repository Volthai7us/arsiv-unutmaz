import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let postSchema = new mongoose.Schema({
    _id: String,
    index: Number,
    name: String,
    title: String,
    url: String,
    id: String,
    permalink: String,
    selftext: String,
    source: String,
})

let Post = mongoose.model('Post', postSchema)
export const handler = async (event, context) => {
    const { page } = event.queryStringParameters

    const posts = await Post.find()
        .skip(page * 10)
        .limit(10)
        .then((posts) => {
            return posts
        })

    return {
        statusCode: 200,
        body: JSON.stringify(posts),
    }
}
