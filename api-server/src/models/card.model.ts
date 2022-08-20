import { Model, QueryContext } from 'objection';
import db from '../utils/database/index.js';

Model.knex(db);

class CardModel extends Model {
  static get tableName() {
    return 'cards';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['cardNo', 'name', 'limit'], // for insertions only
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 256 },
        cardNo: { type: 'string', minLength: 1, maxLength: 19 },
        limit: { type: 'integer' }, // fk to card_types table
        balance: { type: 'integer', default: 0 },
        created_at: { type: 'string', default: new Date().toISOString() },
        updated_at: { type: 'string', default: new Date().toISOString() },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext): Promise<any> {
    await super.$beforeInsert(queryContext);
    // await this.doPossiblyAsyncStuff();
  }

  async $beforeUpdate(opt: any, queryContext: QueryContext): Promise<any> {
    await super.$beforeUpdate(opt, queryContext);
    // await this.doPossiblyAsyncStuff();
  }
}

export default CardModel;
