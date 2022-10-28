import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// Create an app to start an express server.
const app = express();
const port = 3000;

// Enable the app to secure HTTP requests.
app.use(helmet());
// Enable the app to create a cookie parser middleware.
app.use(cookieParser());
// Enable the app to process POST request.
app.use(express.json());

// Set a route for root URL.
// The app responds with a message for requests to the root URL. 
app.get('/', (req, res) => {
    // Check if a user is logged in.
    let username = req.cookies.username;
    if (username) {
        res.send(`Hello ${username}!`);
    } else {
        res.send('Hello world!!!');
    }
});

// Set a route for user to login.
app.get('/login', (req, res) => {
    // Check if login failed by checking if the path contains a query parameter with the valu 'failed'.
    let failedLogin = req.query.status === 'failed' ? true : false;

    if (failedLogin) {
        res.send('Login failed. Invalid username or password.');
    } else {
        res.send('Please enter your username and password to login.');
    }
});

app.get('/welcome', (req, res) => {
    let username = req.cookies.username;
    res.send(`Welcome back, ${username}!`);
})

// Set a route to handle POST request for login.
app.post('/login', (req, res) => {
    const userDetails = {
        username: "Billy",
        password: "abc123",
    };

    let { username, password } = req.body;
    if (username === 'Billy' && password === 'abc123') {
        res.cookie("username", username);
        //res.send('Login successful.');
        return res.redirect('/welcome');
    } else {
        //res.send('Login failed.');
        return res.redirect('/login?status=failed')
    }
});

// Set a route for user to logout. 
// Delete the username cookie when user logged out.
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/login');
});

// Set a route for sending a cookie from the server to a client.
app.get('/setCookie', (req, res) => {
    const cookieName = 'username';
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
    res.clearCookie('username');
    res.send('Cookies deleted');
});

// The app listen on port 3000 for connetions.
app.listen(port, () => console.log(`REST server is running at port ${port}.`));