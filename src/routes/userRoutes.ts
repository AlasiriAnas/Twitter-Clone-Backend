import { Router } from "express";

const router = Router();


//User CRUD 

//create a new user
router.post('/', (req,res) => {
    res.status(501).json({error: 'Not implemented'});
});


// get all the users
router.get('/' , (req, res) => {
    res.status(501).json({error: 'Not implemented'});
});


// get one user
router.get('/:id' , (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: 'Not implemented'});
});

// update a user
router.put('/:id' , (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: 'Not implemented'});
});

// delete a user
router.delete('/:id' , (req, res) => {
    const {id} = req.params;
    res.status(501).json({error: 'Not implemented'});
});






export default router;