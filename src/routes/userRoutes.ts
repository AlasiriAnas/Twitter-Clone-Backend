import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//User CRUD

//create a new user
router.post("/", async (req, res) => {  
  const { email, name, username } = req.body;
  console.log(email, name, username);
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hi, I'm new on Twitter",
      },
    });
    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "username and email must be unique" });
  }
});

// get all users
router.get("/", async (req, res) => {
  //TODO manage for auth user only.  
  //TODO number of tweets.      
  try {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "there are no users!" });
  }
});

// get a user
router.get("/:id", async (req, res) => {
    
  //TODO number of tweets.    
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        tweets:true
      }
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "filed to find this user!" });
  }
});

// update a user
router.put("/:id", async (req, res) => {
  //TODO manage for auth user only.  
  const { id } = req.params;
  const { bio, name, image } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "failed to update the user!" });
  }
});

// delete a user
router.delete("/:id", async (req, res) => {
   //TODO manage for auth user only.    
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "failed to delete the user!" });
  }
});

export default router;
