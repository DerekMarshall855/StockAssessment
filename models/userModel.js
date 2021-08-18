import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        wallet: { type: Number, default: 0 },
        heldShares: { type: Map, of: String }, // Holds map where name of share points to amount user owns of that share
        subscriptions: { type: Array, default: [] },  // Array of endpoints user is subscribed to

    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;