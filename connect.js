const mongoose = require("mongoose");

const connectDB = async()=>{
    try{
        const res = await mongoose.connect("mongodb+srv://ashwinsathiya:Z5vv2njkgWI1PvjA@first.n1as9m8.mongodb.net/chatpalt?retryWrites=true&w=majority&appName=first");
        console.log("connected to db");
    }catch(err){
        console.log("not connect to db", err);
        process.exit(0);
    }
}

module.exports = connectDB