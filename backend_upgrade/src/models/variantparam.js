import { DataTypes, Model } from "sequelize";
import Variant from "./variant.js";
import Param from "./param.js";

class VariantParam extends Model{
    static migrate(sequelize){
        VariantParam.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            var_param: DataTypes.BOOLEAN
        }, {sequelize})
        Param.hasMany(VariantParam, {
            foreignKey: 'param',
            onDelete: 'cascade'
        })
        Variant.hasMany(VariantParam,{
            foreignKey: 'variant',
            onDelete: 'cascade'
        })
    }
}

export default VariantParam;