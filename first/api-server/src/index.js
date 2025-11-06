// api-server/src/index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import reportsRouter from './routes/reports.js';
import { initSocket } from './socket.js';


const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));


app.use('/api/reports', reportsRouter);


const server = app.listen(3000, ()=> console.log('API listening 3000'));
initSocket(server);