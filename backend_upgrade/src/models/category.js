// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model } from "sequelize";
import ProductCategory from "./productcategory.js";

class Category extends Model{
    static migrate(sequelize){
        Category.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            original_id: DataTypes.BIGINT,
            name: DataTypes.STRING(128)
        }, {sequelize});
        Category.hasMany(Category, {
            foreignKey: 'parent',
            onDelete: 'cascade'
        });
        Category.hasMany(Category, {
            foreignKey: 'original_parent'
        });
        Category.belongsToMany(Category, {
            foreignKey: 'pair_onto',
            through: 'CategoryCategory',
            as: 'pairing'
        });
    }
};

export default Category;
// module.exports = Category;