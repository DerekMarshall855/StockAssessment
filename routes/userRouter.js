import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Stock from '../models/stockModel.js'; // Import Stock as we need to get info for user account
import bcrypt from 'bcrypt';
import { generateToken } from '../util/midware.js';
import e from 'express';

const userRouter = express.Router();

// AUTH USER ROUTES

userRouter.post('/register', expressAsyncHandler(async(req, res) => {
    if(req.body.name.indexOf(' ') >= 0 || req.body.password.indexOf(' ') >= 0) {
        res.status(403).send({success: false, error: "Username and Password must not contain spaces"})
    } else {
        const user = new User({name: req.body.name, password: bcrypt.hashSync(req.body.password, 8)});
        const createdUser = await user.save()
        .catch(err => {
            res.status(401).send({
                success: false,
                err: err.message
            })
        });  // If user exists our default error sends code 500
        res.status(200).send({
            success: true,
            _id: createdUser._id,
            name: createdUser.name,
            token: generateToken(createdUser)
        });
    }
    
}));

userRouter.post('/signin', expressAsyncHandler(async(req, res) => {
    if (!req.body.name || !req.body.password) {
        res.status(400).send({success: false, error: "Missing Username or Password"});
    } else {
        const user = await User.findOne({name: req.body.name});
        if (user !== null) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.status(200).send({
                    success: true,
                    _id: user._id,
                    name: user.name,
                    token: generateToken(user),
                });
                return;
            } else {
                res.status(401).send({success: false, error: "Invalid Password"});
            }
        } else {
            res.status(406).send({success: false, error: "User doesn't exist"});
        }
    }
}));

// Account management ROUTES

// Update name and/or password
userRouter.put("/:id", expressAsyncHandler(async (req, res) => {
    // If we were adding admin feature do || req.body.isAdmin
    if (req.body.id === req.params.id) {
        if(req.body.name && req.body.name.indexOf(' ') >= 0) {
            res.status(403).send({success: false, error: "Username must not contain spaces"})
        } else {
            if (req.body.password) {
                if (req.body.password.indexOf(' ') >= 0) {
                    res.status(403).send({success: false, error: "Password must not contain spaces"})
                } else {
                    try {
                        req.body.password = bcrypt.hashSync(req.body.password, 8);
                    } catch (err) {
                        res.status(500).send({success: false, error: err});
                        return;
                    }
                }
                
            }
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }).catch(err => {
                res.status(500).send({success: false, error: err});
                return;
            })
            res.status(200).send({success: true, message: "User successfully updated"});
        }
    } else {
        res.status(401).send({success: false, error: "You can only update your own account"});
    }
}));

// Delete single user
userRouter.delete("/:id", expressAsyncHandler(async (req, res) => {
    if (req.body.id === req.params.id) {
        await User.findByIdAndDelete(req.params.id)
            .catch(err => {
                res.status(500).send({success: false, error: err});
                return;
            })
        res.status(200).send({success: true, message: "Account has been deleted"});
    } else {
        res.status(401).send({success: false, error: "You can only delete your own account"});
    }
}));

// Clear user Collection (ONLY USED FOR UNIT TESTING)
userRouter.delete('/remove/all', expressAsyncHandler(async (req, res) => {
    await User.deleteMany({});
    res.status(200).send({success: true, message:"All users have been deleted"});
}));

// Get user
userRouter.get('/:id', expressAsyncHandler( async( req, res) => {
    // If user doesnt exist error code 500
    const user = await User.findById(req.params.id)
        .catch(err => {
            res.status(500).send({success: false, error: err});
            return;
        });
    if (user !== null) {
        const {password, ...everythingElse} = user;  // Deconstruct user JSON to split password info from all other info, send this back
        res.status(200).send({success: true, message: everythingElse._doc});
    } else {
        res.status(406).send({success: false, error: "User doesn't exist"});
    }



}));

// HERE ID ALWAYS REFERS TO USERID, PASS STOCKCODE (code) THROUGH req.body

// Add to wallet (get amount, add amount to wallet with update)
userRouter.put("/add/wallet/:id", expressAsyncHandler( async(req, res) => {
    if (req.body.amount && req.body.amount > 0) {
        if (req.body.id === req.params.id) {
            const user = await User.findById(req.params.id,)
                .catch(err => {
                    res.status(500).send({success: false, error: err});
                    return;
                });
            if (user !== null) {
                const newVal = user.wallet + req.body.amount;
                await user.updateOne({wallet: newVal});
                res.status(200).send({success: true, message: "Wallet successfully updated"});
            } else {
                res.status(406).send({success:false, error: "User doesn't exist"})
            }

        } else {
            res.status(401).send({success: false, error: "You can only update your own wallet"});
        }
    } else {
        res.status(403).send({success: false, error: "You cannot add a negative value to wallet"})
    }
}));

// Get wallet (Get amount in wallet given userId [Should only be able to view own wallet])
userRouter.get("/wallet/:id", expressAsyncHandler( async(req, res) => {
    const user = await User.findById(req.params.id)
    .catch(err => {
        res.status(500).send({
            success: false,
            error: err
        });
        return;
    });
    if (user !== null) {
        res.status(200).send({
            success: true,
            message: user.wallet
        })
    } else {
        res.status(406).send({success:false, error: "User doesn't exist"})
    }
}));

// Buy Stock (Check stock value, check if user wallet funds ok, sub stock value from wallet, add stock to map)
userRouter.put("/buy/stock/:id", expressAsyncHandler( async(req, res) => {
    if (req.body.id === req.params.id) {
        const stock = await Stock.findOne({"code": req.body.code})
            .catch(err => {
                res.status(500).send({
                    success: false,
                    error: err
                });
            });
        if (stock !== null) {
            const user = await User.findById(req.params.id)
                .catch(err => {
                    res.status(500).send({success: false, error: err});
                    return;
                });
            if (user !== null) {
                const amount = req.body.amount != null ? req.body.amount : 1;  // Either sent # to purchase or default 1
                const newVal = user.wallet - (stock.value * amount);  
                if (newVal >= 0) {
                    let shares = user.heldShares;
                    if (user.heldShares.has(req.body.code)) {
                        shares.set(req.body.code, shares.get(req.body.code) + (amount));
                    } else {
                        shares.set(req.body.code, amount);
                    }
                    await user.updateOne({wallet: newVal, heldShares: shares})
                        .catch(err => {
                            res.status(500).send({success: false, error: err});
                            return;
                        });
                    res.status(200).send({success: true, message: "Share purchase successful"});
                } else {
                    res.status(401).send({success: false, error: "Insufficient funds"});
                }
            } else {
                res.status(406).send({success:false, error: "User doesn't exist"})
            }
            
        } else {
            res.status(406).send({success: false, error: "Requested stock doesn't exist"});
        }
    } else {
        res.status(401).send({success: false, error: "You can only buy stocks for your own account"});
    }
}));

// Sell stock (Check if amount of stock in map, calc total value of stock, remove from map, add val to wallet)
userRouter.put("/sell/stock/:id", expressAsyncHandler( async(req, res) => {
    if (req.body.id === req.params.id) {
        const stock = await Stock.findOne({"code": req.body.code})
            .catch(err => {
                res.status(500).send({
                    success: false,
                    error: err
                });
            });
        if (stock !== null) {
            const user = await User.findById(req.params.id)
                .catch(err => {
                    res.status(500).send({success: false, error: err});
                    return;
                });
            if (user !== null) {
                // Check if user has shares, if they do check if they have the amount they want to sell
                const amount = req.body.amount != null ? req.body.amount : 1;
                if (user.heldShares.has(req.body.code) && user.heldShares.get(req.body.code) > amount) {
                    const newVal = user.wallet + (stock.value * amount);
                    let shares = user.heldShares;
                    shares.set(req.body.code, shares.get(req.body.code) - amount);
                    await user.updateOne({
                        wallet: newVal,
                        heldShares: shares
                    }).catch(err => {
                        res.status(500).send({success: false, error: err});
                    })
                    res.status(200).send({
                        success: true,
                        message: "Shares successfully sold"
                    });
                } else {
                    res.status(401).send({
                        success: false,
                        error: "You can't sell shares you don't own"
                    })
                }
            } else {
                res.status(406).send({success: false, error: "User doesn't exist"})
            }

        } else {
            res.status(406).send({success: false, error: "Requested stock doesn't exist"});
        }
    } else {
        res.status(401).send({success: false, error: "You can only sell stocks for your own account"});
    }
}));
// Subscribe (Add stockId to subscription endpoints)
userRouter.put("/subscribe/:id", expressAsyncHandler( async(req, res) => {
    if (req.body.id === req.params.id) {
        try {  //Use try/catch here for clarity since potential errors on > 1 operation
            const stock = await Stock.findOne({"code": req.body.code})
            if (stock !== null) {
                const user = await User.findById(req.params.id);
                if (user !== null) {
                    if (!user.subscriptions.includes(req.body.code)) {
                        // Update followers of target and following of current user
                        await user.updateOne({ $push: { subscriptions: req.body.code }});
                        res.status(200).send({success: true, message: "Endpoint successfully subscribed to"})
                    } else {
                        res.status(403).send({success: false, error: "You already subscribe to this endpoint"});
                    }
                } else {
                    res.status(406).send({success: false, error: "User doesn't exist"})
                }
                
            } else {
                res.status(406).send({success: false, error: "Endpoint doesn't exist"});
            }
        } catch (err) {
            res.status(500).send({success: false, error: err});
        }
    } else {
        res.status(401).send({success: false, error: "You can only edit your own subscriptions"});
    }
}));
// Unsubscribe (Pull stockId from subscriptions)
userRouter.put("/unsubscribe/:id", expressAsyncHandler( async(req, res) => {
    if (req.body.id === req.params.id) {
        try {  //Use try/catch here for clarity since potential errors on > 1 operation
            const stock = await Stock.findOne({"code": req.body.code});
            if (stock !== null) {
                const user = await User.findById(req.params.id);
                if (user !== null) {
                    if (user.subscriptions.includes(req.body.code)) {
                        // Update followers of target and following of current user
                        await user.updateOne({ $pull: { subscriptions: req.body.code }});
                        res.status(200).send({success: true, message: "Endpoint successfully unsubscribed to"})
                    } else {
                        res.status(403).send({success: false, error: "You aren't subscribed to this endpoint"});
                    }
                } else {
                    res.status(406).send({success: false, error: "User doesn't exist"})
                }
            } else {
                res.status(406).send({success: false, error: "Endpoint doesn't exist"})
            }
        } catch (err) {
            res.status(500).send({success: false, error: err});
        }
    } else {
        res.status(401).send({success: false, error: "You can only edit your own subscriptions"});
    }
}))
// Get portfolio (Get map, use forEach to add each stock + amount to array, return array)
userRouter.get("/portfolio/:id", expressAsyncHandler( async(req, res) => {
    const user = await User.findById(req.params.id)
        .catch(err => {
            res.status(500).send({
                success: false,
                error: err
            });
        });
    if (user !== null) {
        res.status(200).send({
            success: true,
            message: user.heldShares
        });
    } else {
        res.status(406).send({
            success: false,
            error: "User doesn't exist"
        });
    }
}));

export default userRouter;