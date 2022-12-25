require('dotenv').config();
const authRouter = require('./routers/auth/auth-router');
const express = require('express');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.listen(process.env.SERVER_PORT, () => console.log('server is listening'));
