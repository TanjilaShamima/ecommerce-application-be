const app = require('..');
const { serverPort } = require('./secret');
const port = serverPort || 2000


app.listen(port, () => {
    console.log('listening on port', port);
})