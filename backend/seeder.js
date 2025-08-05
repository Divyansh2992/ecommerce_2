const mongoose=require("mongoose");
const dotenv=require("dotenv");
const Product=require("./models/Product");
const User=require("./models/User");
const products=require("./data/products");
const Cart=require("./models/Cart");

dotenv.config();

//Function to seed Data
const seedData=async()=>{
    try{
        //Connect to mongodb
        await mongoose.connect(process.env.MONGO_URI);
        //Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        //Create a default admin user
        // If your User model does not hash passwords automatically, hash here.
        const createdUser=await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:"123456", // Make sure this is hashed in the model
            role:"admin",
        });

        //Assign the default user ID to each product
        const userID=createdUser._id;

        const sampleProducts=products.map((product)=>{
            return {...product,user:userID};
        });

        //Insert the products into database
        await Product.insertMany(sampleProducts);
        console.log("Product data seeded successfully");
        await mongoose.disconnect();
        process.exit();
    }catch(error){
        console.log("Error seeding the data",error);
        await mongoose.disconnect();
        process.exit();
    }
};

seedData();