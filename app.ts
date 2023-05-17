// ES6 imports
import express from 'express'
import session from 'express-session'
import filestoreImport from 'session-file-store'
import qs from 'querystring'

// Route imports
import pageRouter = require('./routes/page.route')
import animeRouter = require('./routes/anime.route');

// App setup
const app = express();
const port = 3000;
const filestore = filestoreImport(session);
app.set('title', 'breadnime!');

// App settings
app.set('query parser', (str: string) => {
    return qs.parse(str);
});
app.set('views', './views');
app.set('view engine', 'pug');

// Session setup
// Note: session declarations in node_modules/@types/express-session/index.d.ts:222
app.use(session({
    name: 'session-id',
    secret: 'kXp2r5u8x/A?D(G+',
    saveUninitialized: false,
    resave: false,
    store: new filestore()
}));

// Static setup
app.use('/static', express.static('public'));

// Routers
app.use('/', pageRouter);
app.use('/anime', animeRouter);

// Generic routes
app.all('*', (req, res) => {
    res.status(404);
    res.render('404');
});

// Server activity logger
app.use((req, res) => {
    console.log(`HTTP request made to server at time: ${Date.now()}`);
});

// Listen for connections
app.listen(port, () => {
    console.log("Server listening on port 3000");
});