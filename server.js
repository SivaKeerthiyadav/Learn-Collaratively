const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const db = require('./db'); 
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
  name: String,
  password: String
});
const User = mongoose.model('User', userSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'templates', 'login.hbs'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'templates', 'signup.hbs'));
});


app.post('/signup', async (req, res) => {
  try {
    
    const newUser = new User({
      name: req.body.name,
      password: req.body.password
    });

    await newUser.save();

    
    res.status(200).send('Account successfully created!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
