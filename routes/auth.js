const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const router = express.Router();

// Signup
router.post('/signup', async (req,res)=>{
    try{
        console.log(req.body)
        const {email,password} = req.body;
        const usr = new User({email,password});
        console.log('entered signup with user', usr)
        await usr.save();
        res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
        res.status(400).json({ error: 'User creation failed', details: error });
        }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error });
  }
});

module.exports = router;
