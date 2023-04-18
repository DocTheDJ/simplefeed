import { DataTypes, Model, Sequelize} from "sequelize";
import Category from "./category";
import Variant from "./variant";
import Modification from "./modification";

class Product extends Model{
    static migrate(sequelize: Sequelize){
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
        Product.belongsToMany(Category, {
            foreignKey: 'categories',
            through: 'ProductCategory'
        });
        Product.belongsToMany(Variant, {
            foreignKey: 'variants',
            through: 'ProductVariant',
            onDelete: 'cascade'
        });
        Product.belongsToMany(Modification, {
            foreignKey: 'mods',
            through: 'ProductMod'
        })
    }
}

export default Product