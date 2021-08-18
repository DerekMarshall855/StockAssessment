import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Stock from '../models/stockModel.js';

const stockRouter = express.Router();

// Realistically this should be admin only, but for the sake of the assessment (isAdmin not required) anyone can edit stocks

// Add stock (Create stock, db should inforce uniqueness of idCode)
stockRouter.post("/", expressAsyncHandler( async(req, res) => {
    const newStock = new Stock(req.body);
    const createdStock = newStock.save()
        .catch(err => {
            res.status(500).send({success: false, error: err});
            return;
        })
    res.status(200).send({
        success: true,
        message: createdStock
    });
}));
// Remove stock (Remove stock with given ID code)
stockRouter.delete("/:stockId", expressAsyncHandler( async(req, res) => {
    await Stock.findByIdAndDelete(req.params.stockId)
        .catch(err => {
            res.status(500).send({success: false, error: err});
            return;
        })
    res.status(200).send({success: true, message: "Stock has been deleted"});
}));
// REMOVE ALL JUST FOR TESTING
stockRouter.delete("/remove/all", expressAsyncHandler( async(req, res) => {
    await Stock.deleteMany({});
    res.status(200).send({success: true, message:"All stocks have been deleted"});
}));
// Change stock value (Get stock, change value to given new value)
stockRouter.put("/value/:stockId", expressAsyncHandler( async(req, res) => {
    //TODO -> pass new value in req.body.newValue
    if (req.body.newValue && req.body.newValue >= 0) {
        const stock = await Stock.findByIdAndUpdate(req.params.stockId, {
            $set: req.body
        }).catch(err => {
            // error 500 should go if req.body.code is invalid (not 3 chars)
            res.status(500).send({success: false, error: err});
            return;
        })
        res.status(200).send({success: true, message: "User successfully updated"});
    } else {
        res.status(403).send({success: false, error: "Invalid stock value"});
    }
}));
// Get stock -> Uses stock code so users can subscribe to this endpoint
stockRouter.get("/:stockId", expressAsyncHandler( async(req, res) => {
    const stock = await Stock.findById(req.params.stockId)
        .catch(err => {
            res.status(500).send({
                success: false,
                error: err
            });
            return;
        });
    if (stock) {
        res.status(200).send({
            success: true,
            message: stock
        });
    } else {
        res.status(403).send({
            success: false,
            error: "Stock with that Id doesn't exist"
        });
    }
}));

export default stockRouter;