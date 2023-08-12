import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//User CRUD

//create a new tweet
router.post("/", async (req, res) => {
  //TODO manage based on auth user
  const { content, image, userId } = req.body;
  
  try {
    const newTweet = await prisma.tweet.create({
      data: {
        content,
        image,
        userId,
      },
    });
    res.status(200).json(newTweet);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "failed to create a tweet" });
  }
});

// get all tweets
router.get("/", async (req, res) => {
  // TODO manage auth user to see its tweets only
  try {
    const Tweets = await prisma.tweet.findMany({
        include:{
            user:{
                select:{
                name:true,
                id:true,
                username:true,
                image:true,
                bio:true
            }}
        }
    });
    res.status(200).json(Tweets);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "failed to get all tweets" });
  }
});

// get a tweet
router.get("/:id", async (req, res) => {
  //TODO manage get a tweet by user who created it.
  const { id } = req.params;

  try {
    const retrievedTweet = await prisma.tweet.findUnique({
      where: {
        id: Number(id),
      },
      include:{
        user:true
      }
    });
    res.status(200).json(retrievedTweet);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "failed to get a tweet" });
  }
});

// update a tweet
router.put("/:id", async (req, res) => {
  //TODO manage update a tweet by user who created it.
  const { id } = req.params;
  const { tweet } = req.body;

  try {
    const updatedTweet = await prisma.tweet.update({
      where: {
        id: Number(id),
      },
      data: {
        content: tweet,
      },
    });
    res.status(200).json(updatedTweet);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "failed to update a tweet" });
  }
});

// delete a  tweet
router.delete("/:id", async (req, res) => {
  //TODO manage delete a tweet by user who        created it.
  const { id } = req.params;
  try {
    const deletedTweet = await prisma.tweet.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(deletedTweet);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "failed to delete a tweet" });
  }
});

export default router;
