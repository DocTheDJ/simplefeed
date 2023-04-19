import { DataTypes, Model } from "sequelize";
import Variant from "./product.js";
import Modification from "./modification.js";

class VariantMod extends Model{
    static migrate(sequelize){
        VariantMod.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
        }, {sequelize});
        Modification.hasMany(VariantMod, {
            foreignKey: 'modification',
            onDelete: 'cascade'
        })
        Variant.hasMany(VariantMod,{
            foreignKey: 'variant',
            onDelete: 'cascade'
        })
    }
};

export default VariantMod;