import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routers/users';
import cardsRouter from './routers/cards';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '69df7b2537c6c79a278ca0ee',
  };

  next();
});

app.use(usersRouter);
app.use(cardsRouter);

app.listen(+PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
