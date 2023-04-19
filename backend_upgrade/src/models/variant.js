import { DataTypes, Model } from "sequelize";
import Product from "./product.js";

class Variant extends Model{
    static migrate(sequelize){
        Variant.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            code: {
                type: DataTypes.STRING(32),
                unique: true
            },
            ean: DataTypes.STRING(16),
            vat: {
                type: DataTypes.DECIMAL(2, 0),
                defaultValue: 21
            },
            price: DataTypes.DECIMAL(8, 2),
            pur_price: DataTypes.DECIMAL(8, 2),
            rec_price: DataTypes.DECIMAL(8, 2),
            currency: DataTypes.STRING(3),
            visible: DataTypes.STRING(1),
            amount: DataTypes.INTEGER,
            free_billing: DataTypes.BOOLEAN,
            free_shipping: DataTypes.BOOLEAN,
            name: DataTypes.STRING(128),
        }, {sequelize});
        // Variant.belongsToMany(Param, {
        //     foreignKey: 'params',
        //     through: VariantParam,
        //     onDelete: 'cascade'
        // });
        // Param.belongsToMany(Variant, {
        //     through: VariantParam,
        //     onDelete: 'cascade'
        // })
        // Variant.belongsToMany(Modification, {
        //     foreignKey: 'mods',
        //     through: 'VariantMods'
        // });
        // Modification.belongsToMany(Variant, {
        //     through: 'VariantMods'
        // })
        // Variant.belongsToMany(Image, {
        //     foreignKey: 'variant',
        //     through: VariantImage,
        //     onDelete: 'cascade'
        // }),
        Product.belongsTo(Variant, {
            foreignKey: 'price_common'
        });
        Product.belongsToMany(Variant, {
            foreignKey: 'variants',
            through: 'ProductVariant',
            onDelete: 'cascade'
        });
    }
};

export default Variant