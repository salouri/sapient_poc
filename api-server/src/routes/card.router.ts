import express from 'express';
// import * as Auth from 'middlewares/auth.js';
import * as cardController from '../controllers/card.controller.js';
import validateCard from '../middlewares/cardvalid.middleware.js';


const router = express.Router();


// router.use(Auth.isAuthorized); // below are only-authorized routes

router.get('/', cardController.getAllCards);
router.post('/', validateCard, cardController.createCard);
router.delete('/:id', cardController.deleteCard);


export default router;
