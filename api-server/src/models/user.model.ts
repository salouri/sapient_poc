// services take care of the heavy lifting like calling the database, processing and formatting data, handling algorithms based on business rules, etc. (things not specific to the HTTP layer)
import { Model } from 'objection';
import db from '../utils/database/index.js';

Model.knex(db);

class UserModel extends Model {
  id!: number;
  sub!: string;
  email!: string;
  phone!: string;
  name!: string;
  created_at!: string;
  updated_at!: string;

  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['sub', 'phone', 'name'], // for insertions only
      properties: {
        id: { type: 'integer' },
        sub: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        phone: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        created_at: { type: 'string', default: new Date().toISOString() },
        updated_at: { type: 'string', default: new Date().toISOString() },
      },
    };
  }
}

export default UserModel;
