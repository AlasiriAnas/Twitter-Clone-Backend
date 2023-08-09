import { Router } from "express";

const router = Router();


//User CRUD 

//create a new tweet
router.post('/', (req,res) => {
    res.status(501).json({error: 'Not implemented'});
});


// get all the tweet
router.get('/' , (req, res) => {
    res.status(501).json({error: 'Not implemented'});
});


// get one tweet
router.get('/:id' , (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: 'Not implemented'});
});

// update a tweet
router.put('/:id' , (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: 'Not implemented'});
});

// delete a  tweet
router.delete('/:id' , (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: 'Not implemented'});
});






export default router;