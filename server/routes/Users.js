const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');



//Endpoints
router.get('/getUser', validateToken ,async (req, res) => {
    const userId = req.user.id;

    const user = await Users.findOne({where:{id: userId}})

    if (user) {
        res.json({
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            auth: true
        })
    } else {
        res.json({err: "User doesnt exist"})
    }
})


//Creating a user
router.post("/register", async (req, res) => {
    //Do some checking to see if JSON file is valid

    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const gender = req.body.gender;

    const existingUsername = await Users.findOne({where : {username : username}});

    if (existingUsername) {
        res.json({err: "Username already exists!"})

    } else {
        bcrypt.hash(password, 10).then((hash) => {
            Users.create({
                firstname: firstname,
                lastname: lastname,
                gender: gender,
                username: username,
                password: hash,
            });
            res.json("Successfully created user!")
        });
    }
});

//Logging in
router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await Users.findOne({where : {username : username}});
    if (!user) {
        res.json({auth: false, err: "Username does not exist."})
    } else {
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                res.json({auth: false, err: "Username/Password combination is incorrect"})
            } else {
                const id = user.id;
                const userName = user.username;
                const firstname = user.firstname;
                const lastname = user.lastname;
                const token = jwt.sign({userName,  id, firstname, lastname}, "jwtsecret", {
                
                });

                res.json({auth: true, token: token, result: user}); 
            }
        })
    }
})
 


module.exports = router