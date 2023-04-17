const { DataTypes, Model } = require('sequelize');

class Feed extends Model{

};

function migrate(sequelize){
    Feed.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        feed_link: DataTypes.TEXT,
        usage: DataTypes.STRING(1),
        name: {
            type: DataTypes.STRING(128),
            allowNull: true
        },
        master_feed: {
            type: DataTypes.BIGINT,
            references: {
                model: Feed,
                key: 'id',
            },
            allowNull: true,
            onDelete: 'cascade'
        },
        source: {
            type: DataTypes.STRING(1),
            allowNull: true
        }
    }, {sequelize});
}

module.exports = {Feed, migrate}