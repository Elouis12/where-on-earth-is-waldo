let express = require('express');

let router = express.Router();

let JWTAuth = require("../controllers/JWTAuthController.js")

let userAuth = require("../controllers/userAuthController.js")


router.post('/register', userAuth.postRegister );
router.post('/login', userAuth.postLogin );
router.post('/user-info', userAuth.getUserInfo );
router.post('/update-user-info', userAuth.updateUserInfo );
router.post('/verify-token', JWTAuth.authenticateJWT );
router.post('/refresh-token', userAuth.getAccessToken );
router.get('/query', userAuth.verifyEmailToken );
router.get('/reset', /*JWTAuthController.authenticateJWT,*/ userAuth.getCreatePasswordPage )
router.post('/reset-password', userAuth.resetPassword );
router.post('/create-password', userAuth.createPassword );
router.post('/delete-account', userAuth.deleteAccount );
router.post('/logout', userAuth.deleteLogout );




module.exports = router;