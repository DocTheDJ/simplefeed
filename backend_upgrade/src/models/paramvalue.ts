import { DataTypes, Model, Sequelize } from "sequelize";
import Param from "./param";

class ParamValue extends Model{
    static migrate(sequelize: Sequelize){
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