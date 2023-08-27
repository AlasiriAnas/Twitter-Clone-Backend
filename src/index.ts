import express from 'express';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middelwares/authMiddelware';


const app = express();
app.use(express.json());
const port = 8000;


app.use('/user',authenticateToken,userRoutes);
app.use('/tweet',authenticateToken ,tweetRoutes);
app.use('/auth', authRoutes);



 
app.get('/', (req,res) =>{
    res.send("Hello world. Updated");
});




app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
});
