let express = require('express');

let router = express.Router();

let applicationController = require("../controllers/applicationController.js")

let JWTAuthController = require("../controllers/JWTAuthController.js")



router.get('/', applicationController.getAboutPage )

router.get('/about', applicationController.getAboutPage )

router.get('/play', applicationController.getPlayPage );

router.get('/stats', applicationController.getStatsPage );

router.get('/register', /*JWTAuthController.authenticateJWT,*/ applicationController.getRegisterPage )

router.get('/login', /*JWTAuthController.authenticateJWT,*/ applicationController.getLoginPage )

router.post('/save-stats', /*JWTAuthController.authenticateJWT,*/ applicationController.postUserStats )

router.post('/get-stats', /*JWTAuthController.authenticateJWT,*/ applicationController.getUserStats )

router.post('/save-streaks', /*JWTAuthController.authenticateJWT,*/ applicationController.postStreak )

router.get('/*', applicationController.get404Page );


module.exports = router;