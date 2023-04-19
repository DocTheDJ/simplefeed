import { DataTypes, Model } from "sequelize";
import Product from "./product.js";
import Modification from "./modification.js";

class ProductMod extends Model{
    static migrate(sequelize){
        ProductMod.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
        }, {sequelize});
        Modification.hasMany(ProductMod, {
            foreignKey: 'modification',
            onDelete: 'cascade'
        })
        Product.hasMany(ProductMod,{
            foreignKey: 'product',
            onDelete: 'cascade'
        })
    }
};

export default ProductMod;