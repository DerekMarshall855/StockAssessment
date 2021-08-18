import mongoose from 'mongoose';


const stockSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, min: 3, max: 3, unique: true },  // Share code like GMT | HAM | etc...
        value: { type: Number, required: true },
    },
    { timestamps: true }
);

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;