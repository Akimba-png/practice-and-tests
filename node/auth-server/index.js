require('dotenv').config();
const express = require('express');
const authRouter = require('./routers/auth/auth-router');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.listen(process.env.SERVER_PORT, () => console.log('server is listening'));
