import axios from 'axios'
import fs from 'fs'
const baseURL = 'https://www.reddit.com/r/ArsivUnutmaz/'

const getHotPosts = async (before, after) => {
    if (before) {
        return axios
            .get(`${baseURL}hot.json?before=${before}`)
            .then((res) => res.data.data.children)
    }
    if (after) {
        return axios
            .get(`${baseURL}hot.json?after=${after}`)
            .then((res) => res.data.data.children)
    }
    return axios.get(`${baseURL}hot.json`).then((res) => res.data.data.children)
}

const getComments = async (id) => {
    return axios
        .get(`${baseURL}comments/${id}.json`)
        .then((res) => res.data[1].data.children)
        .catch((err) => console.log(err))
}

const getCommentText = async (id) => {
    console.log(`https://www.reddit.com/api/info.json?id=${id}`)
    return axios
        .get(`https://www.reddit.com/api/info.json?id=${id}`)
        .then((res) => res.data.data.children[0].data.body)
        .catch((err) => console.log(err))
}

const findSource = async (comments) => {
    for (let i = 0; i < comments.length; i++) {
        let author = comments[i].data.author
        if (author === 'AutoModerator') {
            if (
                !comments[i].data ||
                !comments[i].data.replies ||
                !comments[i].data.replies.data ||
                !comments[i].data.replies.data.children ||
                !comments[i].data.replies.data.children[0]
            ) {
                return null
            }
            const commentId =
                comments[i].data.replies.data.children[0].data.name
            const commentText = await getCommentText(commentId)
            console.log(commentText)
            return commentText
        }
    }
}

const simplifyPosts = (posts) => {
    console.log(posts[0])
    return posts.map((post) => {
        return {
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
        }
    }
    return posts
}

const getAllPosts = async () => {
    let posts = await getHotPosts()
    posts = simplifyPosts(posts)
    posts = await addSource(posts)
    let lastPost = posts[posts.length - 1].name
    let allPosts = posts
    let count = 0

    while (false) {
        count++
        posts = await getHotPosts(null, lastPost)
        posts = simplifyPosts(posts)
        posts = await addSource(posts)
        allPosts = allPosts.concat(posts)
    }
    fs.writeFileSync('posts.json', JSON.stringify(allPosts))
}

getAllPosts()
