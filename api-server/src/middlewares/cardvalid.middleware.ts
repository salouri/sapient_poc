import type { Request, Response, NextFunction } from 'express';

export function checkLuhn(cardNo: string): boolean {
  let sum = 0;
  const numDigits = cardNo.length;
  const odd = numDigits & 1; // bitwise "AND" with 1 to get the last bit
  for (let i = 0; i < numDigits; i++) {
    // get the next digit in the card number
    let digit = parseInt(cardNo.charAt(i));
    // if it's an odd digit, double it
    if (!((i & 1) ^ odd)) { // last bit XORed with 1 => 1 if odd, 0 if even
      digit *= 2;
      if (digit > 9) digit -= 9; // e.g. 16: (1,6) => 1+6 = 7, 16-9 = 7
    }
    sum += digit;
  }
  return sum % 10 == 0;
}

function isAllDigits(str: string): boolean {
  // check if all the characters are digits
  return /^\d+$/.test(str);
}

export default function validateCard(req: Request, res: Response, next: NextFunction) {
  const cardNo = req.body?.cardNo as string;
  // assumption: validation priority: cardNo Exists > is Numeric >  has acceptable length > is Luhn valid
  const isNumeric = cardNo && isAllDigits(cardNo);
  const isValidLength = isNumeric && cardNo.length >= 13 && cardNo.length <= 19;
  const isValidLuhn = isValidLength && checkLuhn(cardNo);

  if (!cardNo || !isValidLuhn || !isNumeric || !isValidLength) {
    const message = cardNo ? 'Invalid card number' : 'Missing card number';

    res.status(400).json({
      status: 'error',
      message,
    });
  } else {
    next();
  }
}
