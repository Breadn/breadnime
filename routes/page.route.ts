// File responsible for handling generic webpage navigation routing
import express from 'express'
import * as aniAPI from '../app/middleware/aniAPI.middleware'
import * as usrSess from '../app/middleware/userSession.middleware'
import * as viewControllers from '../app/controllers/view.controllers'

const router = express.Router();

router.get('/', aniAPI.getPopular, viewControllers.indexView);

router.get('/search', aniAPI.getSearch, viewControllers.galleryView);

router.get('/stream', aniAPI.getAnime, aniAPI.getEpisodeStreams, usrSess.testSesh, viewControllers.animeView);

router.get('/status', aniAPI.getStatus);

router.get('/test', aniAPI.test);

export = router;