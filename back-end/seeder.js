const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const products = require('./data/products');

dotenv.config();

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

//Function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // create a default  admin user
    const createUser = await User.create({
      name: 'Admin User',
      email:'admin@example.com',
        password:"123456",
        role:'admin',
    });
    //assign the default user Id to the products
    const userId = createUser._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: userId };
    });
    // insert sample products into the database
    await Product.insertMany(sampleProducts);
    console.log('Data seeded successfully!');
    process.exit();
  }
  catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Call the seedData function
seedData()