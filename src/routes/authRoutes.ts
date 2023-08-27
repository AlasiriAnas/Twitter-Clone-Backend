import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import  jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 24;
const JWT_SECRET = process.env.JWT_SECRET

// generate a random 8 digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

//generate JWT token.
function generateAuthToken(tokenId: number): string{
    const jwtPayload = {tokenId};

    // To make sure that JWT_SECRET is always defined.
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET must be defined');
      }

    return jwt.sign(jwtPayload, JWT_SECRET ,{
        algorithm:"HS256",
        noTimestamp:true
    });
};

// endpoints

//Create a new user if it doesn't exist,
//generate emailToken and send it to their email.
router.post("/login", async (req, res) => {
  const { email } = req.body;

  //generate a token
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });

    console.log(createdToken);
    // send emailToken to user's email.
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "failed to authenticate the user" });
  }
});

// validate the emailToken
// generate long-lived JWT token
router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;

  try {
    const dbEmailToken = await prisma.token.findUnique({
      where: {
        emailToken,
      },
      include: {
        user: true,
      },
    });

    // Check if token is found
    if (!dbEmailToken || !dbEmailToken.valid) {
      return res.status(401).json({ error: "Token not found" });
    }

    // Check if token has expired
    if (dbEmailToken.expiration < new Date()) {
      return res.status(401).json({ error: "Token expired" });
    }

    // Check if the token belongs to the user's email.
    
    if (dbEmailToken?.user?.email !== email){
        return res.sendStatus(401);
    }

    // we validated the user is the owner of the email.
    
    //generate the api token.
    const expiration = new Date(
        new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
      );
    const apiToken = await prisma.token.create({
        data:{
            type:'API',
            expiration,
            user:{
                connect:{
                    email,
                },
            },
        },
    });

    // invalidate the email token.
    await prisma.token.update({
        where:{
            id: dbEmailToken.id ,
        },
        data:{
            valid:false
        },
    });

    // generate the JWT token.

    const authToken = generateAuthToken(apiToken.id);

     res.json({authToken});

  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "unauthenticated" });
  }
});

export default router;
