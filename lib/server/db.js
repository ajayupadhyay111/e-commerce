import mongoose from 'mongoose'

const MONGODB_URL = process.env.MONGO_URI

let cache = global.mongoose;

if (!cache) {
    cache = global.mongoose = {
        connection: null,
        promise: null,
    }
}

export const connectDB = async () => {
    if (cache.connection) {
        return cache.connection
    }
    if (!cache.promise) {
        cache.promise = mongoose.connect(MONGODB_URL, {
            dbName: "e-commerce",
            bufferCommands: false
        })
    }

    cache.connection = await cache.promise
    return cache.connection

}