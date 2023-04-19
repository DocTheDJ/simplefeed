import { DataTypes, Model } from "sequelize";
import Product from "./product.js";
import Variant from "./modification.js";

class ProductVariant extends Model{
    static migrate(sequelize){
        ProductVariant.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
        }, {sequelize});
        Variant.hasMany(ProductVariant, {
            foreignKey: 'variant',
            onDelete: 'cascade'
        })
        Product.hasMany(ProductVariant,{
            foreignKey: 'product',
            onDelete: 'cascade'
        })
    }
};

export default ProductVariant;