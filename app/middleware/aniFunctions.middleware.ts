// File containing breadnime specific anime site helper functionality
import { getSearch_raw } from './aniAPI.middleware';
import { Request, Response } from 'express'
import fs from 'fs'

// Read word bank
let wordbank: string[] = [];
const randomWordsPath = './src/ani/wordbank.txt';
fs.readFile(randomWordsPath, (err, data) => {
    if (err) throw err;
    wordbank = data.toString().split('\n');
});

// Returns random noun from wordbank
function chooseRandomNoun() {
    return wordbank[Math.floor(Math.random() * wordbank.length)];
}

// Returns random anime data to pass to episode and view renderer functions
export async function searchRandomAnime(req: Request, res: Response, next: Function) {
    console.log("Fetching random anime...");

    let result: any = {};
    do {
        result = await getSearch_raw(chooseRandomNoun());
    }
    while (!result.results.length);

    let randAni = result.results[Math.floor(Math.random() * result.results.length)];

    req.query.animeid = randAni.id;
    req.query.episodeid = "";
    next();
}