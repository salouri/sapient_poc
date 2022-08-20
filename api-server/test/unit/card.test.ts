'user strict';
import request from 'supertest';

import { checkLuhn } from '../../src/middlewares/cardvalid.middleware';

const baseURL = 'http://localhost:3000';

// check if card is valid Luhn algorithm
describe('Luhn Validation Function', () => {
  it('returns True if card number is a valid Luhn', () => {
    const isValidLuhn = checkLuhn('4111111111111111');
    expect(isValidLuhn).toBe(true);
  });
  it('returns False if card number is not a valid Luhn', () => {
    const isValidLuhn = checkLuhn('4111111111111112');
    expect(isValidLuhn).toBe(false);
  });
});

describe('GET api/cards', () => {
  const endpoint = '/api/cards';
  let id: number;
  const newCard = {
    name: 'whatever',
    limit: 100,
    balance: 0,
    cardNo: '4111111111111111',
  };
  beforeAll(async () => {
    // set up the todo
    const result = await request(baseURL).post(endpoint).send(newCard);
    console.log(`result.body: ${JSON.stringify(result.body, null, 2)}`);
    id = result.body.data?.card.id;
  });

  afterAll(async () => {
    await request(baseURL).delete(`${endpoint}/${id}`);
  });

  it('should return 200', async () => {
    const response = await request(baseURL).get(endpoint);
    expect(response.status).toBe(200);
  });

  it('responds with json', function (done) {
    request(baseURL)
      .get(endpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should return cards', async () => {
    const response = await request(baseURL).get('/api/cards');
    expect(response.status).toBe(200);

    const body = JSON.parse(response.text || '{}');
    expect(Number(body.results) >= 1).toBe(true);
  });
});

describe('POST api/cards', () => {
  const endpoint = '/api/cards';
  const newCard = {
    name: 'whatever',
    limit: 100,
    balance: 0,
    cardNo: '4111111111111112',
  };
  it('should return ERROR when cardNo is not Luhn valid', async () => {
    const response = await request(baseURL).post(endpoint).send(newCard);
    //expect status not to be 200
    expect(response.status).not.toBe(200);
  });
});
