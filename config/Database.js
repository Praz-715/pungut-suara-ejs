import mongoose from 'mongoose'


const MONGO_URI = 'mongodb+srv://teguh:ganteng@cluster0.r0ah9.mongodb.net/pungutSuara?retryWrites=true&w=majority'

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