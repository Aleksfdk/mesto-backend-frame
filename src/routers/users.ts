import { Router } from 'express';
import {
  getUsers, getUserId, createUser, changeProfile, changeProfileAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserId);
router.post('/users', createUser);
router.patch('/users/me', changeProfile);
router.patch('/users/me/avatar', changeProfileAvatar);

export default router;
