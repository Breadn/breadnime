/*
 *  Middleware providing abstraction for breadnime interaction with consumet API
 */

import { Request, Response } from 'express'
import { ANIME } from '@consumet/extensions'

const API_PROVIDER = new ANIME.Gogoanime();

/* GET query @params: search */
// Function returning JSON data on anime searched by keywords
export async function getSearch(req: Request, res: Response, next: Function) {
    const searchTerms = String(req.query.search || "");
    const result = await API_PROVIDER.search(searchTerms)
    .then(data => {
        console.log(`Fetched search data for ${searchTerms}`);
        // console.log(data);
        return data;
    });

    // Pass data to view renderer...
    res.locals.data = result;
    next();
}


/* GET query @params: animeid, episodeid */
// Function for returning JSON data specific to anime ID
export async function getAnime(req: Request, res: Response, next: Function) {
    const animeID = String(req.query.animeid || "");
    const result = await API_PROVIDER.fetchAnimeInfo(animeID)
    .then(data => {
        console.log(`Fetched anime detail for ${animeID}`);
        // console.log(data);
        return data;
    });

    res.locals.data_anime = result;
    next();
}

// Function for returning M3U8 streaming URLs of specific episode ID
export async function getEpisodeStreams(req: Request, res: Response, next: Function) {
    const episodeID = String(req.query.episodeid || "");
    const result = await API_PROVIDER.fetchEpisodeSources(episodeID)
    .then(data => {
        console.log(`Fetched stream sources for ${episodeID}`);
        // console.log(data);
        return data;
    })
    .catch(err => {
        res.locals.data_episode = {};
        console.log(err);
        next();
    });

    res.locals.data_episode = result;
    next();
}

// Function returning JSON data on current popular anime
export async function getPopular(req: Request, res: Response, next: Function) {
    const result = await API_PROVIDER.fetchTopAiring()
    .then(data => {
        console.log(`Fetched top airing detail`);
        // console.log(data);
        return data;
    });

    res.locals.data = result;
    next();
}