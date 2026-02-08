import express from 'express';
import { testApi, getVideoInfo, downloadVideo } from '../controller/videoController.js';

const router = express.Router();


router.get('/test', testApi);

router.post('/video-info', getVideoInfo);

router.get('/download/:formatId', downloadVideo);

export default router;