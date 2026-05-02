import mongoose from "mongoose";

//Function to connect to the mongodb database
export const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/QuickChat-app`);
        console.log("connected to DB")
    }catch(err){
        console.log(err);
    }
} 