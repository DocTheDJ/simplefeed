import { DataTypes, Model } from "sequelize";
import Category from "./category.js";
import Variant from "./variant.js";
import Modification from "./modification.js";
import ProductCategory from "./productcategory.js";

class Product extends Model{
    static migrate(sequelize){
        Product.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            itemgroup_id: DataTypes.STRING(32),
            name: DataTypes.STRING(128),
            short_description: DataTypes.TEXT,
            description: DataTypes.TEXT,
            approved: DataTypes.BOOLEAN,
        }, {sequelize})
        // Product.belongsToMany(Modification, {
        //     foreignKey: 'mod',
        //     through: 'ProductMod',
        // })
        // Modification.belongsToMany(Product, {
        //     foreignKey: 'product',
        //     through: 'ProductMod'
        // })
    }
}

export default Product