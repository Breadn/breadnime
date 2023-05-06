// Controller endpoint responsible for rendering webpage views

import { Request, Response } from 'express'

export function indexView(req: Request, res: Response) {
    console.log("Ended request at indexView render");
    res.send(res.locals.data);
}

export function galleryView(req: Request, res: Response) {
    console.log("Ended request at galleryView render");
    res.send(res.locals.data);
}

export function animeView(req: Request, res: Response) {
    console.log("Ended request at animeView render");
    console.log(`Received anime data: ${JSON.stringify(res.locals.data_anime)}`);
    res.send(res.locals.data_episode);
}