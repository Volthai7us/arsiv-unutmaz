import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const posts = JSON.parse(fs.readFileSync('./posts.json'))

// _id: ObjectId('641203ca19ba6f77ab16db04')
// index: 16
// name: 't3_11lqpkj'
// title: "Sene 2014 Başbakan Davutoğlu,Kılıçdaroğlu'nu insanlığa ihanetle suçlad…"
// url: 'https://v.redd.it/ie0hr72b6hma1'
// id: '11lqpkj'
// permalink: '/r/ArsivUnutmaz/comments/11lqpkj/sene_2014_başbakan_davutoğlukılıçdaro…'
// selftext: ''
// source: 'https://youtu.be/y24ay8l6ceY'
let db
try {
    mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    db = mongoose.connection
    console.log('Connected to MongoDB')
} catch (err) {
    console.log(err)
}

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

app.get('/', (req, res) => {
    res.send('Hello World')
})
app.listen(3000, () => {
    console.log('Listening on port 3000')
})

app.get('/api/:id', (req, res) => {
    Post.findOne({ index: req.params.id }).then((post) => {
        res.json(post)
    })
})
