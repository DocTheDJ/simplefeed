const {getConnection} = require('./src/dbacces')
const {Feed, migrate} = require('./src/models')

async function main(){
   const sequelize = await getConnection('patrik');
   migrate(sequelize);
   await sequelize.sync();
   console.log('boobs');
   await Feed.create({feed_link: 'https://www.sedaci-pytle.cz/mall_feed.xml', usage: 'm', name: 'Sedaci pytle'}, {sequelize})
   sequelize.close();
}

main();