import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .populate('owner')
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res.status(500).send({ message: err.message }));

export const createCard = (req: Request, res: Response) => {
  const card = new Card(req.body);
  card.save()
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Передан некорректный ID карточки',
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

export const deleteCard = (req: Request, res: Response) => Card.deleteOne({ _id: req.params.id })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(400).send({
        message: 'Передан некорректный ID карточки',
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные',
      });
    }
    res.status(500).send({ message: err.message });
  });

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Передан некорректный ID карточки',
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

export const deleteLikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Передан некорректный ID карточки',
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
