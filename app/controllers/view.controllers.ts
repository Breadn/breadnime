// Controller endpoint responsible for rendering webpage views

import { Request, Response } from 'express'

export function indexView(req: Request, res: Response) {
    console.log("Ended request at indexView render");
    res.render('index', { data: res.locals.data });
}

export function galleryView(req: Request, res: Response) {
    console.log("Ended request at galleryView render");
    res.render('gallery', { data: res.locals.data, search: res.locals.searchTerms });
}

export function animeView(req: Request, res: Response) {
    console.log("Ended request at animeView render");
    res.render('anime', { animeData: res.locals.data_anime, streamData: res.locals.data_episode });
}