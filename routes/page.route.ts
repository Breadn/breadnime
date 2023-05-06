// File responsible for handling generic webpage navigation routing

import express from 'express'
import * as aniAPI from '../app/middleware/aniAPI.middleware'
import * as viewControllers from '../app/controllers/view.controllers'

const router = express.Router();

router.get('/', aniAPI.getPopular, viewControllers.indexView);

router.get('/search', aniAPI.getSearch, viewControllers.galleryView);

router.get('/stream', aniAPI.getAnime, aniAPI.getEpisodeStreams, viewControllers.animeView);

export = router;