import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//User CRUD 

//create a new tweet
router.post('/', async (req,res) => {
   const userId = req.body;
   const tweet = req.body;

   try {
    const user = await prisma.user.findUnique({
        where:{
            id: Number(userId)
       }});
      
     if(user){  
     const newTweet = await prisma.tweet.create({
        data:{
            content: tweet,
            userId: Number(user) 
        }
     });
     res.json(newTweet);
    };
   } catch (error) {
    console.log(error)
    res.status(400).json({error: "failed to create a tweet"});
   }
});


// get all the tweet
router.get('/' , async (req, res) => {
    
    try {
        const Tweets = await prisma.tweet.findMany();
        res.json(Tweets);
    } catch (error) {
        console.log(error)
        res.status(400).json({error: "failed to get all tweets"});
    }

});


// get one tweet
router.get('/:id' , async (req, res) => {
     const {id} = req.params;
    
    try {
       const retrievedTweet = await prisma.tweet.findUnique({
        where:{
            id:Number(id)
        }
       })
       res.json(retrievedTweet);

    } catch (error) {
        console.log(error)
        res.status(400).json({error: "failed to get a tweet"});
    }
});

// update a tweet
router.put('/:id' , async (req, res) => {
        const {id} = req.params;
        const {tweet} = req.body;
        
    try {
        const updatedTweet = await prisma.tweet.update({
            where:{
                id: Number(id),
            },
            data:{
                content: tweet
            }
        });
        res.json(updatedTweet);
     } catch (error) {
        console.log(error)
        res.status(400).json({error: "failed to update a tweet"});
    }
});

// delete a  tweet
router.delete('/:id' , async (req, res) => {
    const {id} = req.params;
    try {
        const deletedTweet = await prisma.tweet.delete({
            where:{
                id: Number(id)
            },
        });
        res.json(deletedTweet);
    } catch (error) {
        console.log(error)
        res.status(400).json({error: "failed to delete a tweet"});
    }
   
});




export default router;