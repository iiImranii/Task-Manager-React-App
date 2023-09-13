const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.headers["x-access-token"];
    if (!accessToken) {
        console.log("user not logged in")
        res.json({err: "User not logged in!"})
    } else {

        try {
            const validToken = verify(accessToken, "jwtsecret");
            
            if (validToken) {
                req.user = validToken
                next();
            }
        } catch (err) {
            res.json({auth: false, err: err})
        }
    }
};

//auth: Authorised


module.exports = {validateToken};