import express from "express";
import cookieParser from "cookie-parser";

// Create an app to start an express server.
const app = express();
const port = 3000;

// Enable the app to create a cookie parser middleware.
app.use(cookieParser());

// Set a route for root URL.
// The app responds with a message for requests to the root URL. 
app.get('/', (req, res) => {
    res.send('Hello world!!!')
});

// Set a route for sending a cookie from the server to a client.
app.get('/setCookie', (req, res) => {
    const cookieName = 'userName';
    const cookieValue = 'Billy Wonka';
    res.cookie(cookieName, cookieValue, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true, // ensure cookie not accessible using JavaScript code
        secure: false, // server is on localhost
        sameSite: 'lax' // set cookie only when browser's domain matches cookie's domain (eliminates third party's domains)
    });
    res.send(`REST server sent a cookie to client: ${cookieName}=${cookieValue}`);
});

// Set a route to get a cookie which received from the server.
app.get('/getCookie', (req, res) => {
    res.send(`Client received a cookie: ${Object.keys(req.cookies)[0]}=${Object.values(req.cookies)[0]}`);
});

// Set a route to delete saved cookies
app.get('/deleteCookie', (req, res) => {
    res.clearCookie('userName');
    res.send('Cookies deleted');
});

// The app listen on port 3000 for connetions.
app.listen(port, () => console.log(`REST server is running at port ${port}.`));