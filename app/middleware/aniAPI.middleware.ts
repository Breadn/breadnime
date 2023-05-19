/*
 *  Middleware providing abstraction for breadnime interaction with consumet API
 */

import { Request, Response } from 'express'
import { ANIME } from '@consumet/extensions'

const API_PROVIDER = new ANIME.Gogoanime();

/////// breadnime routing consumet API functions ///////
// Function returning API provider status
export async function getStatus(req: Request, res: Response) {
    console.log("~~~ Status Report ~~~");
    console.log(API_PROVIDER.isWorking);
    res.send(`${API_PROVIDER.name} status: ${API_PROVIDER.isWorking ? "Up" : "Down"}`);
}

/* GET query @params: search */
// Function returning JSON data on anime searched by keywords
export async function getSearch(req: Request, res: Response, next: Function) {
    console.log("Get search middleware");

    const searchTerms = String(req.query.search || "");
    console.log(`Fetching search data for ${searchTerms}`);
    const result = await API_PROVIDER.search(searchTerms)
    .then(data => {
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
    console.log(`Fetching anime detail for ${animeID}`);
    const result = await API_PROVIDER.fetchAnimeInfo(animeID)
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(err => {
        next(err);
    });

    if (result) {
        res.locals.data_anime = result;
        next();
    }
}

// Function for returning M3U8 streaming URLs of specific episode ID
export async function getEpisodeStreams(req: Request, res: Response, next: Function) {
    console.log("Get streams middleware");

    const episodeID = String(req.query.episodeid || "");
    console.log(`Fetching stream sources for ${episodeID}`);
    const result = await API_PROVIDER.fetchEpisodeSources(episodeID)
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(err => {
        next(err);
    });

    if (result) {
        res.locals.data_episode = result;
        res.locals.data_episode.curr_epID = episodeID;
        next();
    }
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