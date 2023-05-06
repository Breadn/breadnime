// ES6 imports
import express from 'express'
import session from 'express-session'
import filestoreImport from 'session-file-store'
import qs from 'querystring'

import pageRouter = require('./routes/page.route');

// DEBUG: custon .d.ts file in custom_types not working? specified typeRoots dir in tsconfig??
declare module 'express-session' {
    export interface SessionData {
        user: string;
    }
}

// App setup
const app = express();
const port = 3000;
const filestore = filestoreImport(session);
app.set('title', 'breadnime!');

// Session setup
app.use(session({
    name: 'session-id',
    secret: 'kXp2r5u8x/A?D(G+',
    saveUninitialized: false,
    resave: false,
    store: new filestore()
}));

// Query Parser setup
app.set('query parser', (str: string) => {
    return qs.parse(str);
});

// Note: session declarations in node_modules/@types/express-session/index.d.ts:222
app.get('/session.html', (req, res) => { // TODO: implement sessions in respective pages
    console.log(req.session);

    if (!req.session.user) {
        console.log("no user")
        req.session.user = "your new name!";
    }
    console.log(req.session.user);

    res.send(req.session.user);
});


// Middlewares
// app.use(express.static('public'));
// app.use(express.static('views'));
app.use('/', pageRouter);

// test
app.use((req, res) => {
    console.log(`HTTP request made to server at time: ${Date.now()}`);
});

// Listen for connections
app.listen(port, () => {
    console.log("Server listening on port 3000");
});