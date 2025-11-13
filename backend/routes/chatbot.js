import express from 'express';
import {
  sendMessage,
  getCommonQuestions
} from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/message', sendMessage);
router.get('/questions', getCommonQuestions);

export default router;
