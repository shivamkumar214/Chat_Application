import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String, 
        require:true,
        unique: true
    },
    fullName: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6 
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
    }
}, {timestamps: true});

const User = mongoose.model("user", userSchema);

export default User;