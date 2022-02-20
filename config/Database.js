import mongoose from 'mongoose'


// const MONGO_URI = 'mongodb+srv://teguh:ganteng@cluster0.r0ah9.mongodb.net/pungutSuara?retryWrites=true&w=majority'
// const MONGO_URI = 'mongodb://teguh:ganteng@cluster0-shard-00-00.r0ah9.mongodb.net:27017,cluster0-shard-00-01.r0ah9.mongodb.net:27017,cluster0-shard-00-02.r0ah9.mongodb.net:27017/pungutSuara?ssl=true&replicaSet=atlas-58d3uw-shard-0&authSource=admin&retryWrites=true&w=majority'
const MONGO_URI = 'mongodb://localhost:27017/pungutsuara'

export const database =()=>{

 mongoose
    .connect(MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    })
    .then(() => {
        console.log("Successfully connected to database");
    })
    .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
}