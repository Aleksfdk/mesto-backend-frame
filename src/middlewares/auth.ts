import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res
            .status(401)
            .send({ message: 'Необходима авторизация' });
    }
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
        payload = jwt.verify(token,'f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b') as { _id: string };
    } catch (err) {
        return res
            .status(401)
            .send({ message: 'Необходима авторизация' });
    }
    req.user = payload;

    next();
};
