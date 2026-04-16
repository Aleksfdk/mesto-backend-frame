import {NextFunction, Request, Response} from 'express';
import Card from '../models/card';

interface CustomRequest extends Request {
    user?: {
        _id: string;
    };
}

interface IError extends Error {
    statusCode?: number;
}

export const getCards = (req: Request, res: Response, next: NextFunction) => {
    return Card.find({})
        .populate('owner')
        .then(cards => res.send({data: cards}))
        .catch(err => {
            const error = new Error(err.message) as IError;
            error.statusCode = 500;

            return next(error);
        })
}

export const createCard = (req: Request, res: Response, next: NextFunction) => {
    const card = new Card(req.body);
    card.save()
        .then(card => res.send({data: card}))
        .catch(err => {
            if (err.name === 'CastError') {
                const error = new Error("Передан некорректный ID карточки") as IError;
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

export const deleteCard = (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const cardId = req.params.id;

    Card.findById(cardId)
        .then(card => {
            if (!card) {
                const error = new Error("Карточка не найдена") as IError;
                error.statusCode = 404;

                return next(error);
            }

            if (card.owner.toString() !== userId) {
                const error = new Error("Нет прав для удаления чужой карточки") as IError;
                error.statusCode = 403;

                return next(error);
            }

            card.deleteOne()
                .then(() => {
                    res.send({message: "Карточка успешно удалена", data: card});
                    return;
                });
        })
        .catch(err => {
            if (err.name === 'CastError') {
                const error = new Error( "Передан некорректный ID карточки") as IError;
                error.statusCode = 400;

                return next(error);

            }
            if (err.name === 'ValidationError') {
                const error = new Error( "Переданы некорректные данные") as IError;
                error.statusCode = 400;

                return next(error);
            }
            const error = new Error( err.message) as IError;
            error.statusCode = 500;

            return next(error);
        })
}

export const likeCard = (req: CustomRequest, res: Response) => {
    const cardId = req.params.cardId;
    const userId = req.user?._id;
    return Card.findByIdAndUpdate(
        cardId,
        {$addToSet: {likes: userId}},
        {new: true},
    )
        .then(card => {
            if (!card) {
                return res.status(404).send({message: "Карточка не найдена"})
            }
            res.send({data: card})
        })
        .catch(err => {
            if (err.name === 'CastError') {
                return res.status(400).send({
                    message: "Передан некорректный ID карточки"
                });
            }
            if (err.name === 'ValidationError') {
                return res.status(400).send({
                    message: "Переданы некорректные данные"
                });
            }
            res.status(500).send({message: err.message});
        })
}

export const deleteLikeCard = (req: CustomRequest, res: Response) => {
    const cardId = req.params.cardId;
    const userId = req.user?._id;
    return Card.findByIdAndUpdate(
        cardId,
        {$pull: {likes: userId}},
        {new: true},
    )
        .then(card => {
            if (!card) {
                return res.status(404).send({message: "Карточка не найдена"})
            }
            res.send({data: card})
        })
        .catch(err => {
            if (err.name === 'CastError') {
                return res.status(400).send({
                    message: "Передан некорректный ID карточки"
                });
            }
            if (err.name === 'ValidationError') {
                return res.status(400).send({
                    message: "Переданы некорректные данные"
                });
            }
            res.status(500).send({message: err.message})
        })
}
