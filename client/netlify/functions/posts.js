import dotenv from 'dotenv'
dotenv.config()
const { MongoClient } = require('mongodb')

const mongoClient = new MongoClient(process.env.MONGODB_URI)

const clientPromise = mongoClient.connect()

export const handler = async (event, context) => {
    const { page, search } = event.queryStringParameters
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE)
    const collection = database.collection(process.env.MONGODB_COLLECTION)

    if (search) {
        const posts = await collection
            .find({
                $or: [
                    { selftext: { $regex: new RegExp(search, 'i') } },
                    { title: { $regex: new RegExp(search, 'i') } },
                ],
            })
            .toArray()

        return {
            statusCode: 200,
            body: JSON.stringify(posts),
        }
    }

    const posts = await collection
        .find({})
        .skip(page * 10)
        .limit(10)
        .toArray()

    return {
        statusCode: 200,
        body: JSON.stringify(posts),
    }
}
