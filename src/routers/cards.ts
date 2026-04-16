import { Router } from 'express';
import {
  getCards, createCard, deleteCard, likeCard, deleteLikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:id', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', deleteLikeCard);

export default router;
