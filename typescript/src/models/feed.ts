// const { DataTypes, Model } = require('sequelize');
// const Availability = require('./availability');
// const Category = require('./category');
import { DataTypes, Model, Sequelize } from "sequelize";
import Availability from "./availability";
import Category from "./category";
import ParamName from "./paramname";
import Product from "./product";

class Feed extends Model{
    static migrate(sequelize: Sequelize){
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
            source: {
                type: DataTypes.STRING(1),
                allowNull: true
            }
        }, {sequelize});
        Feed.hasMany(Feed, {
            foreignKey: 'master_feed',
            onDelete: 'cascade'
        });
        Feed.hasMany(Availability,{
            foreignKey: 'supplier',
            onDelete: 'cascade'
        });
        Feed.hasMany(Category, {
            foreignKey: 'source',
        });
        Feed.hasMany(ParamName, {
            foreignKey: 'source',
            onDelete: 'cascade'
        });
        Feed.hasMany(Product, {
            foreignKey: 'supplier'
        });
    }
}

export default Feed
// module.exports = Feed;