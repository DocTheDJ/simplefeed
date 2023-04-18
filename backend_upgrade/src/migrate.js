const Feed = require('./models/feed');
const Availability = require('./models/availability');

function migrate(sequelize){
    Availability.migrate(sequelize);
    Feed.migrate(sequelize);
}

module.exports = {migrate};