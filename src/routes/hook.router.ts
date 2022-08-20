import express from 'express';
import * as Auth from '../middlewares/auth.middleware.js';
import * as hookController from '../controllers/hook.controller.js';

const router = express.Router();

router.post('/event1', hookController.event1Handler);

// router.use(Auth.isAuthorized);
// below are only-authorized routes

export default router;
