// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model, Sequelize } from "sequelize";
import Param from "./param";

class ParamName extends Model{
    static migrate(sequelize: Sequelize){
        ParamName.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING(128),
            original_name: DataTypes.STRING(128)
        }, {sequelize});
        ParamName.hasMany(Param, {
            foreignKey: 'value',
            onDelete: 'cascade'
        })
    }
};

export default ParamName;