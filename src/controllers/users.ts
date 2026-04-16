import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const getUserId = (req: Request, res: Response) => User.findById(req.params.id)
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const createUser = (req: Request, res: Response) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      const user = new User(req.body);
      user.save()
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
          if (err.name === 'CastError') {
            return res.status(400).send({
              message: 'Передан некорректный ID пользователя',
            });
          }
          if (err.name === 'ValidationError') {
            return res.status(400).send({
              message: 'Переданы некорректные данные',
            });
          }
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => res.status(400).send(err));
};

export const changeProfile = (req: Request, res: Response) => {
  const userId = req.user?._id;

  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Передан некорректный ID пользователя',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      }
      res.status(500).send({ message: err.message });
    });
};

export const changeProfileAvatar = (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Передан некорректный ID пользователя',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      }
      res.status(500).send({ message: err.message });
    });
};
