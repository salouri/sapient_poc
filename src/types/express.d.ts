// extend the Express Request type definition

import type CardType from '../types/card.type';
import type UserType from '../types/user.type';

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
      card?: CardType;
    }
  }
}
