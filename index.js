import express from "express";
import expressLayouts from 'express-ejs-layouts';
import methodOverride from "method-override";
import session from "express-session";
import flash from 'connect-flash';
import cookieParser from "cookie-parser";
import ConnectMongoDBSession from "connect-mongodb-session";
import path from "path";
// import cors from "cors"

import { database } from "./config/Database.js";
import dashboard from "./routes/dashboard.js";
import authentication from "./routes/authentication.js";
import home from "./routes/home.js";

import {auth} from "./middleware/auth.js"



const app = express();
const port = process.env.PORT || 3000;
const MongoDBSession = ConnectMongoDBSession(session)
const store = new MongoDBSession({
  // uri: 'mongodb+srv://teguh:ganteng@cluster0.r0ah9.mongodb.net/pungutSuara?retryWrites=true&w=majority',
  uri: 'mongodb://teguh:ganteng@cluster0-shard-00-00.r0ah9.mongodb.net:27017,cluster0-shard-00-01.r0ah9.mongodb.net:27017,cluster0-shard-00-02.r0ah9.mongodb.net:27017/pungutSuara?ssl=true&replicaSet=atlas-58d3uw-shard-0&authSource=admin&retryWrites=true&w=majority',
  collection: 'mySession'
})

// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())

// SetUp EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use('/favicon.ico', express.static('images/favicon.ico'));

// SetUp Flash
app.use(cookieParser('secret'));
app.use(session({
  // cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(flash());
app.use('/public', express.static(path.join(path.resolve(), 'public')))

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'));

// Connect Database
database()

app.use('/dashboard', auth ,dashboard)
app.use('/auth',authentication)
app.use('/', home)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});