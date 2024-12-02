const express = require('express')
const User = require('../src/modules/userSchema')
const {body, validationResult} = require('express-validator')
const router = express.Router();

router.post('/signup',
    [
        body("email").isEmail().withMessage("Has to be email"),
        body("password").notEmpty().withMessage("Has to be password")
    ],
    async (req, res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        try {
            const newUser = new User(req.body);
            await newUser.save();
            console.log(newUser)
            res.send({Message: "User Saved", User: newUser})
        } catch (e){ 
           res.status(500).json({Message: e.message, status: false})
}});




router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;

        const found = await User.findOne({
            email: email,
            password: password,
        });
        if(found){
            res.send({Message: "Welcome!", user: found})
        } else {
            res.status(401).json(`${email} doesn't exist or invalid credentials`)
        } 
    } catch(e){
        res.status(500).json({Message: "Couldnt log" + e.message})
    }
})

module.exports = router;



