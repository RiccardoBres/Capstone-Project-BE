const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 9090;
const app = express();

app.use(cors());
require('dotenv').config();
app.use(express.json());

const SchoolRoute = require('./ROUTE/SchoolRoute');
const UserRoute = require('./ROUTE/UserRoute');
const BeachRoute = require('./ROUTE/BeachRoute');
const LoginRoute = require('./ROUTE/LoginRoute');

app.use('/', SchoolRoute);
app.use('/', UserRoute);
app.use('/', BeachRoute);
app.use('/', LoginRoute);

mongoose.connect(process.env.MONGO_DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Errore di connessione al server'));
db.once('open', ()=>console.log('Database mongodb connesso'));

app.listen( PORT, ()=> console.log(`Server avviato ed in ascolto sulla porta ${PORT}`))
