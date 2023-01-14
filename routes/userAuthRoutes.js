let express = require('express');

let router = express.Router();

let JWTAuth = require("../controllers/JWTAuthController.js")

let userAuth = require("../controllers/userAuthController.js")


router.post('/register', userAuth.postRegister );
router.post('/login', userAuth.postLogin );
router.post('/user-info', userAuth.getUserInfo );
router.post('/refresh-token', userAuth.getAccessToken );
router.post('/logout', userAuth.deleteLogout );

router.post('/verify-token', JWTAuth.authenticateJWT );



module.exports = router;