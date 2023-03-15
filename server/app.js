import axios from 'axios'
import fs from 'fs'
import exctractUrls from 'extract-urls'

let count = 0
const limit = 100
const baseURL = 'https://www.reddit.com/r/ArsivUnutmaz/'

const getNewPosts = async (before, after) => {
    if (before) {
        return axios
            .get(`${baseURL}new.json?before=${before}&limit=${limit}`)
            .then((res) => res.data.data.children)
    }
    if (after) {
        return axios
            .get(`${baseURL}new.json?after=${after}&limit=${limit}`)
            .then((res) => res.data.data.children)
    }
    return axios
        .get(`${baseURL}new.json?limit=${limit}`)
        .then((res) => res.data.data.children)
}

const getComments = async (id) => {
    return axios
        .get(`${baseURL}comments/${id}.json`)
        .then((res) => res.data[1].data.children)
        .catch((err) => console.log(err))
}

const getCommentText = async (id) => {
    return axios
        .get(`https://www.reddit.com/api/info.json?id=${id}`)
        .then((res) => res.data.data.children[0].data.body)
        .catch((err) => console.log(err))
}

const findSource = async (comments) => {
    for (let i = 0; i < comments.length; i++) {
        let author = comments[i].data.author
        if (author === 'AutoModerator') {
            const commentId =
                comments[i].data?.replies?.data?.children[0]?.data?.name
            if (!commentId) return
            const commentText = await getCommentText(commentId)
            return commentText
        }
    }
}

const simplifyPosts = (posts) => {
    return posts.map((post) => {
        return {
            index: count++,
            name: post.data.name,
            title: post.data.title,
            url: post.data.url,
            id: post.data.id,
            permalink: post.data.permalink,
            selftext: post.data.selftext,
        }
    })
}

const addSource = async (posts) => {
    for (let i = 0; i < posts.length; i++) {
        let comments = await getComments(posts[i].id)
        const source = await findSource(comments)
        if (source) {
            posts[i].source = source
        } else {
            if (!posts[i].url.includes('reddit.com')) {
                posts[i].source = posts[i].url
            } else {
                posts[i].source = null
            }
        }
    }
    return posts
}

const getAllPosts = async () => {
    let posts = await getNewPosts()
    posts = simplifyPosts(posts)
    posts = await addSource(posts)
    let lastPost = posts[posts.length - 1].name
    let allPosts = posts

    fs.writeFileSync('posts.json', JSON.stringify(allPosts))

    while (posts.length > 0) {
        console.log('all posts', allPosts.length)
        posts = await getNewPosts(null, lastPost)
        posts = simplifyPosts(posts)
        posts = await addSource(posts)
        lastPost = posts[posts.length - 1]?.name
        allPosts = allPosts.concat(posts)
        fs.writeFileSync('posts.json', JSON.stringify(allPosts))
    }
}

function linkify(text) {
    var urlRegex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>'
    })
}

const printAllSources = async () => {
    const posts = JSON.parse(fs.readFileSync('posts.json'))
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i]
        const source = post.source
        if (source) {
            if (typeof source === 'string') {
                let sources = exctractUrls(source)
                post.source = sources
            }
            for (let j = 0; j < post.source.length; j++) {
                if (post.source[j].includes('redd.it')) {
                    console.log('redd.it')
                    continue
                }
                console.log('source', post.source[j])
                const source = post.source[j]
                try {
                    const response = await axios.get(source)
                    const html = response.data
                    post.html = html
                } catch (err) {
                    console.log('error')
                }
            }
        }
    }
    fs.writeFileSync('posts_html_source_array.json', JSON.stringify(posts))
}

// printAllSources()

getAllPosts()
