import {NextFunction, Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from "../models/user";

interface CustomRequest extends Request {
    user?: {
        _id: string;
    };
}

interface IError extends Error {
    statusCode?: number;
}

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    return User.find({})
        .then(users => res.send({data: users}))
        .catch(err => {
            const error = new Error(err.message) as IError;
            error.statusCode = 500;
            return next(error);
        })
}

export const getUserId = (req: Request, res: Response, next: NextFunction) => {
    return User.findById(req.params.id)
        .then(user => res.send({data: user}))
        .catch(err => {
            const error = new Error(err.message) as IError;
            error.statusCode = 500;
            return next(error);
        })
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            req.body.password = hash;
            const user = new User(req.body);
            user.save()
                .then(user => res.send({data: user}))
        })
        .catch(err => {
            if (err.name === 'CastError') {
                const error = new Error("Передан некорректный ID пользователя") as IError;
                error.statusCode = 400;

                return next(error);
            }
            if (err.name === 'ValidationError') {
                const error = new Error("Переданы некорректные данные") as IError;
                error.statusCode = 400;

                return next(error);
            }

            if (err.code === 11000) {
                const error = new Error("Пользователь с таким email существует") as IError;
                error.statusCode = 409;

                return next(error);
            }
            const error = new Error(err.message) as IError;
            error.statusCode = 500;

            return next(error);
        })
}

export const changeProfile = (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const {name, about} = req.body;
    return User.findByIdAndUpdate(
        userId,
        {name, about},
        {
            new: true,
            runValidators: true
        }
    )
        .then(user => {
            if (!user) {
                return res.status(404).send({message: "Пользователь не найден"});
            }
            res.send({data: user});
        })
        .catch(err => {
            if (err.name === 'CastError') {
                const error = new Error("Передан некорректный ID пользователя") as IError;
                error.statusCode = 400;

                return next(error);
            }
            if (err.name === 'ValidationError') {
                const error = new Error("Переданы некорректные данные") as IError;
                error.statusCode = 400;

                return next(error);
            }
            const error = new Error(err.message) as IError;
            error.statusCode = 500;

            return next(error);
        })
}

export const changeProfileAvatar = (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const {avatar} = req.body;
    return User.findByIdAndUpdate(
        userId,
        {avatar},
        {
            new: true,
            runValidators: true
        }
    )
        .then(user => {
            if (!user) {
                return res.status(404).send({message: "Пользователь не найден"})
            }
            res.send({data: user})
        })
        .catch(err => {
            if (err.name === 'CastError') {
                const error = new Error("Передан некорректный ID пользователя") as IError;
                error.statusCode = 400;

                return next(error);
            }
            if (err.name === 'ValidationError') {
                const error = new Error("Переданы некорректные данные") as IError;
                error.statusCode = 400;

                return next(error);
            }
            const error = new Error(err.message) as IError;
            error.statusCode = 500;

            return next(error);
        })
}

export const login = (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    return User.findOne({email})
        .then(user => {
            if (!user) {
                return Promise.reject(new Error('Неправильный логин или пароль'));
            }
            return bcrypt.compare(password, user.password)
                .then(matched => {
                    if (!matched) {
                        return Promise.reject(new Error('Неправильный логин или пароль'));
                    }
                    const token = jwt.sign(
                        {_id: user._id},
                        'f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
                        {expiresIn: '7d'}
                    );
                    res.send({token});
                });
        })
        .catch((err) => {
            const error = new Error(err.message) as IError;
            error.statusCode = 401;

            return next(error);
        });
}
