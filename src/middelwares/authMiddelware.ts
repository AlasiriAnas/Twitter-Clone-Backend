import { Request , Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
import  jwt from 'jsonwebtoken';



const prisma = new PrismaClient();


const JWT_SECRET = process.env.JWT_SECRET


type AuthRequest = Request & {user?: User}

export async function authenticateToken(req:AuthRequest, res: Response, next: NextFunction){

    //Authentication
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }
  const jwtToken = authHeader?.split(' ')[1];
  if(!jwtToken){
    res.sendStatus(401);
  }

  // decode the jwt token.

  try {
    // To make sure that JWT_SECRET is always defined.
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET must be defined');
      }

    const payload = await jwt.verify(jwtToken, JWT_SECRET) as {tokenId:number};
    if(!payload?.tokenId){
        res.sendStatus(401);
    }
    const dbToken = await prisma.token.findUnique({
        where:{
            id:payload.tokenId
        },
        include:{
            user:true
        },
    });

    console.log(dbToken);

    if(!dbToken?.valid || dbToken.expiration < new Date()){
        return res.status(401).json({error: "api token expired"})
    };

    req.user = dbToken.user
         
    
  } catch (error) {
    res.sendStatus(401);
  }

   next();

}