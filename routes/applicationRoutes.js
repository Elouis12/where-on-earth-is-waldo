let express = require('express');

let router = express.Router();

let applicationController = require("../controllers/applicationController.js")

let JWTAuthController = require("../controllers/JWTAuthController.js")


router.get('/', applicationController.getAboutPage )

router.get('/about', applicationController.getAboutPage )

router.get('/play', applicationController.getPlayPage );

router.get('/stats', applicationController.getStatsPage );

// SOCKET - refactor later
// router.get('/play/session', applicationController.getCreatorSessionPage)
router.get('/session', applicationController.getCreatorSessionPage)
router.get('/play/join/', applicationController.getJoinSessionPage)
router.post('/create-session', applicationController.createSession)

router.get('/register', /*JWTAuthController.authenticateJWT,*/ applicationController.getRegisterPage )

router.get('/login', /*JWTAuthController.authenticateJWT,*/ applicationController.getLoginPage )

router.get('/reset-password', /*JWTAuthController.authenticateJWT,*/ applicationController.getResetPasswordPage )

router.get('/settings', /*JWTAuthController.authenticateJWT,*/ applicationController.getSettingsPage )

router.post('/save-stats', /*JWTAuthController.authenticateJWT,*/ applicationController.postUserStats )

router.post('/get-stats', /*JWTAuthController.authenticateJWT,*/ applicationController.getUserStats )

router.post('/save-streaks', /*JWTAuthController.authenticateJWT,*/ applicationController.postStreak )

router.get('/*', applicationController.get404Page );


module.exports = router;