
import express from 'express';
// import * as Auth from '../middlewares/auth.middleware.js';
import * as appController from '../controllers/app.controller.js';

const router = express.Router();
router.get('/healthcheck', appController.healthCheck); // check db connection
router.get('/heartbeat', appController.heartBeat); // check server connection

// router.use(Auth.isAuthorized);
// // below are only-authorized routes
export default router;