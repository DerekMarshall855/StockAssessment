import mongoose from 'mongoose';


const stockSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, minLength: 3, maxLength: 3, unique: [true, "Code already in use"]},  // Share code like GMT | HAM | etc...
        value: { type: Number, required: true },
    },
    { timestamps: true }
);

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;