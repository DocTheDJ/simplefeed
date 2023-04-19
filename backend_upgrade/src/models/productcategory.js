import { DataTypes, Model } from "sequelize";
import Product from "./product.js";
import Category from "./category.js";

class ProductCategory extends Model{
    static migrate(sequelize){
        ProductCategory.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
        }, {sequelize});
        Category.hasMany(ProductCategory, {
            foreignKey: 'category',
            onDelete: 'cascade'
        })
        Product.hasMany(ProductCategory,{
            foreignKey: 'product',
            onDelete: 'cascade'
        })
    }
};

export default ProductCategory;