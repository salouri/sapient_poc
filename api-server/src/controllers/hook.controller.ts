/* here we add handlers for different webhooks' events.
Here we handle events that trigger posts to external services based on orders (an API call) sent to our service
*/


import type { Request, Response } from 'express';

export function event1Handler(req: Request, res: Response) {
  // do something: send a post request to an external service
  res.status(200).send('OK');
}