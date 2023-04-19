import express from 'express';
import { getConnection } from "./src/dbacces.js";
import { migrate, createDefault } from "./src/migrate.js";
var app = express();
// const {getConnection} = require('./src/dbacces')
// const {migrate} = require('./src/migrate')
// const Feed = require('./src/models/feed')

app.get('/', (req, res) => {
   res.send('Hello world');
})
app.get('/default', async function(req, res) {
   const seq = await getConnection('patrik');
   // await migrate(seq);
   createDefault(seq, true);
   res.send('OK');
})


var server = app.listen(8000, () => {
   var host = server.address().host;
   var port = server.address().port;
   console.log("Server listening at http://%s:%s", host, port);
});

async function main(){
   const sequelize = await getConnection('patrik');
   await migrate(sequelize);
   sequelize?.close();
}

// main();