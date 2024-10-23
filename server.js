const express=require("express")
const dotEnv=require("dotenv")
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const transactionRoutes=require('./routes/transactionRoutes')
const app=express()
const PORT=process.env.PORT || 5000
dotEnv.config()
app.use(bodyParser.json())
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        
        console.log("MongoDB Connected Successfully")
    })
    .catch((error)=>{
        console.log("Error Connecting to MongoDB",error)
    })
app.use('/transactions',transactionRoutes)
app.listen(PORT,()=>{
    console.log(`server Started and running at ${PORT}`)
})

