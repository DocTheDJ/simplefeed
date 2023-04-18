// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model, Sequelize } from "sequelize";
import Product from "./product";

class Manufacturer extends Model{
    static migrate(sequelize: Sequelize){
        Manufacturer.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING(128),
            original_name: DataTypes.STRING(128)
        }, {sequelize});
        Manufacturer.hasMany(Product, {
            foreignKey: 'manufacturer',
        })
    }
};

export default Manufacturer;
// module.exports = Manufacturer;