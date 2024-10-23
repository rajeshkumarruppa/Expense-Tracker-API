const Transaction=require('../models/Transaction')

const createTransaction=async(req,res)=>{
    try{
        const {type,category,amount,date,description}=req.body

        const transaction=new Transaction({
            type,category,amount,date,description
        })
        await transaction.save()
        res.status(201).json(transaction)
    }catch(error){
        console.log('there is an error:',error)
        res.status(500).json({message:'server error'})
    }
}
const getTransaction=async (req, res) => {
    try {
      const { page = 1, limit = 10, type, category } = req.query;
  
      // Parse pagination query params (default to page 1 and 10 items per page)
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
  
      // Build filter criteria based on optional query parameters
      const filter = {};
      if (type) filter.type = type; // Filter by type: 'Income' or 'Expense'
      if (category) filter.category = category; // Filter by category
  
      // Fetch the total number of matching transactions
      const totalTransactions = await Transaction.countDocuments(filter);
  
      // Fetch the transactions for the current page, limited by the page size
      const transactions = await Transaction.find(filter)
        .sort({ date: -1 }) // Sort transactions by date (most recent first)
        .skip((pageNum - 1) * limitNum) // Skip transactions from previous pages
        .limit(limitNum); // Limit the number of transactions per page
  
      res.status(200).json({
        totalTransactions,
        currentPage: pageNum,
        totalPages: Math.ceil(totalTransactions / limitNum),
        pageSize: transactions.length,
        transactions
      });
  
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
const singleTransaction=async(req,res)=>{
    try{
        const transactions=await Transaction.findById(req.params.id)
        res.status(200).json(transactions)
    }catch(error){
        console.log('there is an error:',error)
        res.status(500).json({message:"serverError"})
    }
}
const updateTransaction=async(req,res)=>{
    try{
        const{type,category,amount,date,description} =req.body
        const myTransaction=await Transaction.findByIdAndUpdate(req.params.id,{type,category,amount,date,description})
        if(!myTransaction){
            return res.status(404).json({message:"transaction not found"})
        }
        res.status(200).json(myTransaction)
        }catch(error){
            console.log('there is an error:',error)
            res.status(500).json({message:"serverError"})
        }
}
const deleteTransaction=async(req,res)=>{
    try{
        const deleteTransaction=await Transaction.findByIdAndDelete(req.params.id)
        if(!deleteTransaction){
            return res.status(404).json({message:"transaction not found"})
        }
        res.status(200).json({message:"transaction deleted successfully"})

    }catch(error){
        console.log('there is an error:',error)
        res.status(500).json({message:'server Error'})
    }
}

const getSummary= async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Validate date input format
      if ((startDate && isNaN(Date.parse(startDate))) || 
          (endDate && isNaN(Date.parse(endDate)))) {
        return res.status(400).json({ 
          message: 'Invalid date format. Use YYYY-MM-DD.' 
        });
      }
  
      // Ensure startDate is before endDate, if both are provided
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
          message: 'Start date must be earlier than end date.'
        });
      }
  
      // Build filter query for  date range
      const filter = {};
      if (startDate && endDate) {
        filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
  
      // Fetch all transactions matching the filter
      const transactions = await Transaction.find(filter);
  
      // If no transactions are found, respond with a 404
      if (transactions.length === 0) {
        return res.status(404).json({
          message: 'No transactions found for the given criteria.'
        });
      }
  
      // Calculate total income, total expenses, and balance
      let totalIncome = 0;
      let totalExpenses = 0;
  
      transactions.forEach((transaction) => {
        if (transaction.type === 'Income') {
          totalIncome += transaction.amount;
        } else if (transaction.type === 'Expense') {
          totalExpenses += transaction.amount;
        }
      });
      const numOfTransactions=transactions.length
      const balance = totalIncome - totalExpenses;
  
      // Send the summary as a response
      res.status(200).json({
        totalIncome,
        totalExpenses,
        balance,
        numOfTransactions,
        transactions
        
      });
  
    } catch (error) {
      console.error('Error fetching summary:', error);
  
      // Handle database connection errors gracefully
      if (error instanceof mongoose.Error) {
        return res.status(500).json({ 
          message: 'Database error. Please try again later.' 
        });
      }
  
      // Handle any other unexpected errors
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
const getReports=async (req, res) => {
    try {
      const { month, year } = req.query;
  
      // Validate month and year inputs
      if (!month || !year) {
        return res.status(400).json({ 
          message: 'Month and year are required. Use format: ?month=10&year=2024.' 
        });
      }
  
      // Parse the date range for the given month and year
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(`${year}-${month}-01`);
      endDate.setMonth(endDate.getMonth() + 1); // Move to the next month
  
      // Fetch all expenses for the given month, grouped by category
      const transactions = await Transaction.aggregate([
        {
          $match: {
            type: 'Expense',
            date: { $gte: startDate, $lt: endDate }
          }
        },
        {
          $group: {
            _id: '$category',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { totalAmount: -1 } // Sort categories by spending in descending order
        }
      ]);
  
      if (transactions.length === 0) {
        return res.status(404).json({ 
          message: 'No expenses found for the given month and year.' 
        });
      }
  
      // Respond with the report
      res.status(200).json({
        month,
        year,
        report: transactions
      });
  
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
module.exports={createTransaction,getTransaction,singleTransaction,updateTransaction,deleteTransaction,getSummary,getReports}