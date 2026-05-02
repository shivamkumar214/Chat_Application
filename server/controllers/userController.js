import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


//signup a new user
export const signup = async (req, res) => {
    const {fullName, email , password, bio} = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({
                success: false,
                message: "Missing Details"
            })    
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message:"Account already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password:hashPassword, bio
        });

        const token = generateToken(newUser._id);

        res.json({success:true, userData: newUser, token, message:"Account created successfully"})
    }catch(err){
        console.log(err);
        res.json({success:false, message:err.message})
    }
}

//login a user
export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if( !email || !password ){
            return res.json({
                success: false,
                message: "Missing Details!"
            })    
        }

        const userData = await User.findOne({email})
        if(!userData){
            return res.json({
                success: false,
                message: "User not found!"
            })    
        }
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({
                success: false,
                message: "Invalid Password"
            })    
        }

        const token = generateToken(userData._id);
        res.json({
            success: true, 
            userData, 
            token, 
            message: "Account created successfully"
        })
    }catch(err){
        console.log(err.message);
        res.json({success:false, message: err.message});
    }
}

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({success:true, user: req.user});
}

// Controller to update user profile details
export const updateProfile = async(req, res) => {
    try{
        const {profilePic, bio, fullName} = req.body;

        const userId = req.user._id;
        let updateUser;

        if(!profilePic){
            updateUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:true});  
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updateUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new:true});  
        }
        res.json({success: true, user: updateUser})
    }catch(err){
        console.log(err.message);
        res.json({success:false, message: err.message});
    }
}