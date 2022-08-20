import { Model, QueryContext } from 'objection';
import db from '../utils/database/index.js';
import UserModel from '../models/user.model.js';

Model.knex(db);

class MessageModel extends Model {
  id!: number;
  user_id!: number;
  text!: string;
  created_at!: Date;
  updated_at!: Date;

  static get tableName() {
    return 'messages';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['sub', 'phone', 'name'], // for insertions only
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        text: { type: 'string', minLength: 1, maxLength: 255 },
        created_at: { type: 'date' },
        updated_at: { type: 'date' },
      },
    };
  }

  static get relationMappings() {
    return {
      writer: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'messages.user_id',
          to: 'users.id',
        },
      },
    };
  }

  $beforeInsert(queryContext: QueryContext): void | Promise<any> {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate(opt: any, queryContext: QueryContext): void | Promise<any> {
    this.updated_at = new Date();
  }
}

export default MessageModel;
