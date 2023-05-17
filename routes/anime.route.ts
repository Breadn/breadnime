// File responsible for handling misc routes
import express from 'express'
import * as aniFnc from '../app/middleware/aniFunctions.middleware'
import * as aniAPI from '../app/middleware/aniAPI.middleware'
import * as usrSess from '../app/middleware/userSession.middleware'
import * as viewControllers from '../app/controllers/view.controllers'

// TODO: get random
const router = express.Router();

router.get('/random', aniFnc.searchRandomAnime, aniAPI.getAnime, aniAPI.getEpisodeStreams, viewControllers.animeView);

export = router;