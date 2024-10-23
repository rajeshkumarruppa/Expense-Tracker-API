const express=require('express')
const router=express.Router()
const transactionController=require("../controllers/transactionController")
const Transaction=require("../models/Transaction")

router.post('/add-trans',transactionController.createTransaction)
router.get('/',transactionController.getTransaction)
router.get('/transaction/:id',transactionController.singleTransaction)
router.put('/update/:id',transactionController.updateTransaction)
router.delete('/delete/:id',transactionController.deleteTransaction)
router.get('/summary',transactionController.getSummary)
router.get('/reports',transactionController.getReports)

module.exports = router 