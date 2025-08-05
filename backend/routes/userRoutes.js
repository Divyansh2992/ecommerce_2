const express=require("express");
const User=require("../models/User");
const jwt=require("jsonwebtoken");
const {protect, admin}=require("../middleware/authMiddleware");

const router=express.Router();

//@route POST /api/users/register
//@desc Register a new user
// @ access Public

router.post("/register",async(req,res)=>{
    console.log("/register req.body:", req.body);
    const {name,email,password}=req.body;
    try{
        //registration logic
        //res.send({name,email,password});


        let user=await User.findOne({email});

        if(user) return res.status(400).json({message:"User already exists"});

        user=new User({name,email,password});
        await user.save();

        //Create JWT Payload
        const payload={user:{id:user._id,role:user.role}};

        //Sign and return the token along with user data
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
            if(err) throw err;

            //send the user and token in response
            res.status(201).json({
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                },
                token,
            })
        });

    }catch(error){
        console.log(error);
        res.status(500).send("Server Error");
    }
});


// @route POST /api/users/login
// @desc Authenticate User
// @access Public
router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        //Find teh user by email
        let user=await User.findOne({email});

        if(!user)return res.status(400).json({message:"Invalid Credentials"});
        const isMatch=await user.matchPassword(password);

        if(!isMatch)
            return res.status(400).json({message:"Invalid Credentials"});

        const payload={user:{id:user._id,role:user.role}};

        //Sign and return the token along with user data
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
            if(err) throw err;

            //send the user and token in response
            res.json({
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                },
                token,
            })
        });

    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
});


// @route GET /api/users/profile
// @desc Get logged in user's profile (Protected route)
// @access Private

router.get("/profile",protect,async (req,res)=>{
    res.json(req.user);
})

// @route GET /api/users
// @desc Get all users (admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


module.exports=router;