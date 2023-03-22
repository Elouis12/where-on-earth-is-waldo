let express = require('express');

let router = express.Router();

let socketController = require('../controllers/socketController');


router.post('/validID', socketController.validID );
router.post('/valid-room-name', socketController.validRoomName );
router.post('/valid-room', socketController.validRoom );
router.post('/game-started', socketController.gameStarted );
router.post('/room-full', socketController.roomFull);
router.post('/reduce-user-count', socketController.reduceUserCount );

module.exports = router;