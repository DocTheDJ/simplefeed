// const { DataTypes, Model } = require('sequelize');
// const Category = require('./category');
import { DataTypes, Model, Sequelize } from "sequelize";
import Category from "./category";

class Rule extends Model{
    static migrate(sequelize: Sequelize){
        Rule.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING(128),
            action: DataTypes.STRING(64),
            css_class: DataTypes.STRING(32)
        }, {sequelize});
        Rule.hasMany(Category, {
            foreignKey: 'action'
        })
    }
};

export default Rule;
// module.exports = Rule;