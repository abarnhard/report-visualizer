require('dotenv').config();

const app = require('./server/app');

const port = process.env.PORT || 8999;

app.listen(port);
console.log(`Server listening on port ${port}`);
