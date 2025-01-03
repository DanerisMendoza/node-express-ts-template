// schema.ts
require('dotenv').config();
const mongoose = require('mongoose')
const mongoDatabaseURL = process.env.MONGODB_URL;
mongoose.connect(mongoDatabaseURL)
const ExpensesSchema = new mongoose.Schema({
    user_id: String,
    title: String,
    spent_at: Date,
    amount: Number,
}, { timestamps: true })
const ExpensesModel = mongoose.model("expenses", ExpensesSchema)

export { ExpensesModel, ExpensesSchema };