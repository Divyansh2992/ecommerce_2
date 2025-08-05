const express=require("express");
const router=express.Router();
const Subscriber=require("../models/Subscriber");

//route POST /api/subscribe
// @dec Handle newsletter subscription
// @access Public
router.post("/subscribe",async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.status(400).json({message:"Email is required"});
    }
    try{
        //check if the email is already Subscribed
        let subscriber=await Subscriber.findOne({email});
        if(subscriber){
            return res.status(400).json({message:"Email is already subscribed"});
        }

        //Create a new Subscriber
        subscriber=new Subscriber({email});
        await subscriber.save();

        res.status(201).json({message:"Successfully subscribed to the newsletter"});
    }catch(error){
          console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

module.exports=router;