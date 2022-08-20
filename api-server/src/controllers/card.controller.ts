import CardModel from '../models/card.model.js';
import CRUD from '../utils/crudFactory.js';

// const cardModel = new CardModel();
const modelCrud = new CRUD(CardModel);
const cacheIt = true;
export const createCard = modelCrud.createOne(cacheIt, 'cards');
export const deleteCard = modelCrud.deleteOne;

export const getAllCards = modelCrud.getAll;
