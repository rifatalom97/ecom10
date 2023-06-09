const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./schema/productSchema');
const Token = require('./token');

// middleware 
const AuthMiddleware = require('./express');

const app = express();

// 
app.use(cors());
app.use(express.json());

// connect mongoose
mongoose
  .connect('mongodb://127.0.0.1:27017/ecom', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected!');
    // Additional code here if needed
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });



// Routes
app.post('/get-token', async (req, res) => {
    try {
        const {userId}  =  req.body;

        const _token = Token(userId?userId:50, process.env.JWT_SECRET);

        res.json(_token);
    } catch (err) {
      res.status(500).json({ error: err });
    }
});



app.post('/products', AuthMiddleware, async (req, res) => {
    const { name, price, description } = req.body;
  
    const newProduct = new Product({
      name,
      price,
      description,
    });
  
    await newProduct.save()
    .then((result) => {
        console.log(result);
        res.status(201).json({ message: 'Product created successfully' });
    })
    .catch((error) => {
    res.status(500).json({ error: error });
    });
});
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
      } catch (error) {
        console.error('Error:', error);
        // Handle the error
      }  
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});