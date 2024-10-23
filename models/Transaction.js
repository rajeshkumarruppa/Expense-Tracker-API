const mongoose=require("mongoose")

const transactionSchema=new mongoose.Schema({
    //transactions: { type, category, amount, date, description }
      type: { type: String, required: true },
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, required: true, default: Date.now },
      description: { type: String }

}
);
module.exports = mongoose.model('Transaction', transactionSchema);