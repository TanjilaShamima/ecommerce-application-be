const express = require('express');
const app = express();
const port = process.env.PORT || 1000


app.listen(port, () => {
    console.log('listening on port', port);
})