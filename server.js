import express from 'express';
import userRouter from './routes/userRouter.js';
import dotenv from 'dotenv';
import db from './db/db.js';
import stockRouter from './routes/stockRouter.js';

dotenv.config();

const app = express();

// Express settings for CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connect with db
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// Routes
app.use('/api/user', userRouter);
app.use('/api/stock', stockRouter);

// Default
app.get('/', (req, res) => {
    res.status(200).send("Server is ready");
})

// Default/undefined error
app.use((err, res, req, next) => {
    res.status(500).send({message: err.message});
})

// Connection
const apiPort = process.env.PORT || 5000;
app.listen(apiPort, () => {
    console.log(`Server is ready at https://localhost:${apiPort}`);
})