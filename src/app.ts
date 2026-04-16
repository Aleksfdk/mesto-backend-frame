import express, { Request, Response, NextFunction}  from 'express';
import mongoose from 'mongoose';
import usersRouter from "./routers/users";
import cardsRouter from "./routers/cards";
import authMiddleware from "./middlewares/auth";
import {createUser, login} from "./controllers/users";
import { requestLogger, errorLogger } from './middlewares/logger';

interface IError extends Error {
    statusCode?: number;
}

const { PORT = 3000 } = process.env;
const app = express();

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
            };
        }
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware);
app.use(usersRouter);
app.use(cardsRouter);

app.use(errorLogger);

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    const {statusCode = 500, message} = err;
    res.status(statusCode).send({ message: message });
});

app.listen(+PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
