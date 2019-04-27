const APP_PORT = 80;    // express port
const CLIENT_ID = "";   // client ID for GitHub auth
const CLIENT_SECRET = "";   // client secret for GitHub auth
const DB_SERVER = "localhost";  // mongodb hostname
const DB_PORT = 27017;  // mongodb port
const DB_NAME = "whoami";   // mongodb database name

module.exports = {
    APP_PORT: APP_PORT,
    CLIENT_ID: CLIENT_ID,
    CLIENT_SECRET: CLIENT_SECRET,
    DB_SERVER: DB_SERVER,
    DB_PORT: DB_PORT,
    DB_NAME: DB_NAME
};