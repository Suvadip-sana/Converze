import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";

const register = async(req, res) => {
    const{ name, username, password } = req.body;

    if(!name || !username || !password){
        return res.status(400).json({message: "Please fill all the field!"})
    }

    try{
        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message: "User already exists!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(httpStatus.CREATED).json({message: "User Registered!"});

    } catch(err) {
        return res.json({message: `Something went wrong!`, log: err.message});
    }
}

const login = async(req, res) => {

    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({message: "Please provide username and password!"})
    }

    try {
        const user = await User.findOne({ username }); // Always use 'findOne' for searching any single document from the DB. Because only if use 'find' then it return a array insted of returning any single document. So it give error.

        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found!"});
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password); // this return a promish which is basically true/false

        if(isPasswordCorrect){
            let token = crypto.randomBytes(20).toString("hex"); // Generate the token with the help of crypto.

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({token: token, message: "Login successfull!", userId: user._id, user: user.name});
        }else{
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Invalid Username or Password!"});
        }
    } catch (error) {
        return res.status(500).json({message: `Something went wrong!`, log: error.message});
    }
}



const getUserHistory = async (req, res) => {

    const { token } = req.query;
    try{
        const user = await User.findOne({token: token});
        const meetings = await Meeting.find({userid: user.username})
        res.json(meetings);
    } catch(e) {
        res.status(500).json({message: `Something went wrong!`, log: e.message});
    }

} 


const addToHistory = async (req, res) => {
    const { token, meetingcode } = req.body;
    try {
        const user = await User.findOne({token: token});

        if(!user){
            return res.status(401).json({message: "User not found or invalid token"});
        }
        
        const newMeeting = new Meeting({
            userid: user.username,
            meetingcode: meetingcode
        });

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({message: "History updated!"});
    } catch (error) {

        console.log(error);
        res.status(500).json({message: `Something went wrong!`, log: error.message});
        
    }

}


const clearHistory = async (req, res) => {
    const { token } = req.body;
    
    if(!token){
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Token is required!" });
    }

    try {
        const user = await User.findOne({token: token});
        if(!user){
            return res.status(httpStatus.BAD_REQUEST).json({ message: "User not found!" });
        }
        const result = await Meeting.deleteMany({ userid: user.username });
        res.status(httpStatus.OK).json({
            message: "History cleared successfully!",
            deleteCount: result.deletedCount
        });

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong!",
            log: error.message
        });
    }
}

export {login, register, getUserHistory, addToHistory, clearHistory};