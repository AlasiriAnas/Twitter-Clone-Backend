import express from 'express';
import userRoutes from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes';
const app = express();
app.use(express.json());
const port = 8000;


app.use('/user',userRoutes);
app.use('/tweet', tweetRoutes);

app.get('/', (req,res) =>{
    res.send("Hello world. Updated");
});




app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`);
});
