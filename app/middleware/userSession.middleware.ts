import { Request, Response } from 'express'

export function testSesh(req: Request, res: Response, next: Function) {
    console.log(req.session);

    if (!req.session.user) {
        console.log("no user");
        req.session.user = "your new name!";
    }
    else {
        console.log("wb user!");
    }
    console.log(req.session.user);

    next();
}

// Function responsible for recording anime stream session data from previous aniAPI
// middleware calls
export function recordData(req: Request, res: Response, next: Function) {

}

// Function responsible for determining relevant anime stream data to pass to view
// controller
export function loadData(req: Request, res: Response, next: Function) {
    // TODO: load last episode user was on, previously viewed eps
}