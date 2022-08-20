import AppError from '../utils/appError.js';
import decodeJWT from '../utils/decodeJWT.js';
import UserModel from '../models/user.model.js';
import type { Request, Response, NextFunction } from 'express';
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------

// "isAuthorized" MIDDLEWARE method
// Assumption: token-based authentication is used during signup and login. See the example before EOF.
export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if (JWT) token exists in the request header: Authorization
  try {
    let token;
    // consider the Bearer Schema => {"Authorization" : "Bearer <token>" }
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      // for requests coming from browsers
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please, log in to get access', 401)
      );
    }
    const payload = await decodeJWT(token);
    if (!payload) {
      return next(
        new AppError('You are not logged in! Please, log in to get access', 401)
      );
    }
    const user_id = payload.id;
    const existingUser = await UserModel.query().findOne({ user_id });

    if (!existingUser || existingUser === null) {
      return next(new AppError('User of this token no longer exists.', 401)); // 401: unauthorized (user doesn't exist)
    }

    req.user = existingUser;
    // res.locals.user = existingUser; // usefull for (views) web page rendering
    return next();
  } catch (error) {
    next(error);
  }
}; //end-of isAuthorized middleware

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
// example code for signing up a new user
// const signToken = (id) =>
//   JWT.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });

// export const signup = async (req, res, next) => {
//   // always specify the fields to be used to create a new user record
//   try {
//     const newUser = await UserModel.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       passwordConfirm: req.body.passwordConfirm,
//       role: req.body.role,
//       photo: req.body.photo,
//     });
//     const url = `${req.protocol}://${req.get('host')}/me`;

//     await new Email(newUser, url).sendWelcome();

//     const token = signToken(newUser.id);

//     if ('password' in newUser) newUser.password = undefined;

//     const cookieOptions = {
//       expires: new Date(
//         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//       ),
//       httpOnly: true, // prevents browser from accessing or modification cookie
//       // "req.secure" an attribute added by Express.js if https is used
//       // must add app.enable('trust proxy') in app.js to check on 'x-forwarded-proto' header

//       secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
//     };

//     res.cookie('jwt', token, cookieOptions);

//     res.status(201).json({
//       status: 'success'
//     });
//   } catch (error) {
//     next(error);
//   }
// }; // end-of signup handler