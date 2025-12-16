const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./utils/errorHandler')
const app = express();

require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');

mongoose.connect(process.env.MONGODB)
    .then(()=> console.log('MongoDB connected')
    ).catch((err) => {
        console.log(err);
    });

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
