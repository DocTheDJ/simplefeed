// const { DataTypes, Model } = require('sequelize');
// const Availability = require('./availability');
// const Category = require('./category');
import { DataTypes, Model } from "sequelize";
import Availability from "./availability.js";
import Category from "./category.js";
import ParamName from "./paramname.js";
import Product from "./product.js";

class Feed extends Model{
    static migrate(sequelize){
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