// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model } from "sequelize";
import Param from "./param.js";

class ParamName extends Model{
    static migrate(sequelize){
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
            foreignKey: 'name',
            onDelete: 'cascade'
        })
    }
};

export default ParamName;