/*
 *  Middleware providing abstraction for breadnime interaction with consumet API
 */

import { Request, Response } from 'express'
import { ANIME } from '@consumet/extensions'

const API_PROVIDER = new ANIME.Gogoanime();

/////// breadnime routing consumet API functions ///////
/* GET query @params: search */
// Function returning JSON data on anime searched by keywords
export async function getSearch(req: Request, res: Response, next: Function) {
    console.log("Get search middleware");

    const searchTerms = String(req.query.search || "");
    const result = await API_PROVIDER.search(searchTerms)
    .then(data => {
        console.log(`Fetched search data for ${searchTerms}`);
        // console.log(data);
        return data;
    });

    // Pass data to view renderer...
    res.locals.data = result;
    res.locals.searchTerms = searchTerms;
    next();
}


/* GET query @params: animeid, episodeid */
// Function for returning JSON data specific to anime ID
export async function getAnime(req: Request, res: Response, next: Function) {
    console.log("Get anime middleware");

    const animeID = String(req.query.animeid || "");
    const result = await API_PROVIDER.fetchAnimeInfo(animeID)
    .then(data => {
        console.log(`Fetched anime detail for ${animeID}`);
        // console.log(data);
        return data;
    })
    .catch(err => {
        console.log(err);
        return null;
    });

    if (result) {
        res.locals.data_anime = result;
        next();
    }
    else
        res.status(404);
        res.render('404');
}

// Function for returning M3U8 streaming URLs of specific episode ID
export async function getEpisodeStreams(req: Request, res: Response, next: Function) {
    console.log("Get streams middleware");

    const episodeID = String(req.query.episodeid || "");
    const result = await API_PROVIDER.fetchEpisodeSources(episodeID)
    .then(data => {
        console.log(`Fetched stream sources for ${episodeID}`);
        // console.log(data);
        return data;
    })
    .catch(err => {
        console.log(err);
        return null;
    });

    if (result) {
        res.locals.data_episode = result;
        res.locals.data_episode.curr_epID = episodeID;
        next();
    }
    else
        res.status(404);
        res.render('404');
}

// Function returning JSON data on current popular anime
export async function getPopular(req: Request, res: Response, next: Function) {
    console.log("Get popular middleware");

    const result = await API_PROVIDER.fetchTopAiring()
    .then(data => {
        console.log(`Fetched top airing detail`);
        // console.log(data);
        return data;
    });

    res.locals.data = result;
    next();
}


////// Helper functions ///////
// Raw search function
export async function getSearch_raw(searchTerms: string) {
    const result = await API_PROVIDER.search(searchTerms)
    .then(data => {
        console.log(`Fetched raw search data for ${searchTerms}`);
        return data;
    });

    return result;
}