import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Stock from '../models/stockModel.js';

const stockRouter = express.Router();

// Realistically this should be admin only, but for the sake of the assessment (isAdmin not required) anyone can edit stocks

// Add stock (Create stock, db should inforce uniqueness of idCode)

// Remove stock (Remove stock with given ID code)

// Change stock value (Get stock, change value to given new value)

// Get stock -> Uses stock code so users can subscribe to this endpoint

export default stockRouter;