import { DataTypes, Model } from "sequelize";
import Param from "./param.js";

class ParamValue extends Model{
    static migrate(sequelize){
        ParamValue.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING(128)
        },{sequelize});
        ParamValue.hasMany(Param, {
            foreignKey: 'value',
            onDelete: 'cascade'
        })
    }
}

export default ParamValue;