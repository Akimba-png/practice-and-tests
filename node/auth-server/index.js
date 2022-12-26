require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/auth/auth-router');
const offerRouter = require('./routers/offer/offer-router');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', authRouter);
app.use('/', offerRouter);
app.listen(process.env.SERVER_PORT, () => console.log('server is listening'));
