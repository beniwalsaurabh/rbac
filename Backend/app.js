import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();
connectDB();
const app = express();

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './frontend/build')));

//app.get('/', (req, res) => res.send('Store Rating API'));

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
