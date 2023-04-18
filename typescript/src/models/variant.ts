import { DataTypes, Model, Sequelize } from "sequelize";
import Param from "./param";
import Modification from "./modification";
import Image from "./image";
import VariantParam from "./variantparam";
import VariantImage from "./variantimage";
import Product from "./product";

class Variant extends Model{
    static migrate(sequelize: Sequelize){
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
        Variant.belongsToMany(Param, {
            foreignKey: 'params',
            through: VariantParam,
            onDelete: 'cascade'
        });
        Variant.belongsToMany(Modification, {
            foreignKey: 'mods',
            through: 'VariantMods'
        });
        Variant.belongsToMany(Image, {
            foreignKey: 'images',
            through: VariantImage,
            onDelete: 'cascade'
        }),
        Variant.belongsTo(Product, {
            foreignKey: 'price_common'
        });
    }
};

export default Variant