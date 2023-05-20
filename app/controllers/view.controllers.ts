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
    let viewDataObj = {
        curr_epID: res.locals.data_curr_epID,
        // TODO: pack loaded sess data here
    }
    res.render('anime', { animeData: res.locals.data_anime, streamData: res.locals.data_episode, viewData: viewDataObj });
}