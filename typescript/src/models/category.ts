// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model, Sequelize } from "sequelize";

class Category extends Model{
    static migrate(sequelize:Sequelize){
        Category.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            original_id: DataTypes.BIGINT,
        }, {sequelize});
        Category.hasMany(Category, {
            foreignKey: 'parent',
            onDelete: 'cascade'
        });
        Category.hasMany(Category, {
            foreignKey: 'original_parent'
        });
        Category.belongsToMany(Category, {
            through: 'CategoryCategory',
            foreignKey: 'pair_onto'
        })
    }
};

export default Category;
// module.exports = Category;