// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model, Sequelize } from "sequelize";
import Variant from "./variant";

class Availability extends Model{
    static migrate(sequelize: Sequelize): void {
        Availability.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING(64),
            original_name: DataTypes.STRING(64),
            buyable: DataTypes.BOOLEAN,
            arrives_in: {
                type: DataTypes.STRING(16),
                allowNull: true
            },
            active: DataTypes.BOOLEAN
        }, {sequelize});
        Availability.hasMany(Variant, {
            foreignKey: 'availability'
        })
    }
};

export default Availability;
// module.exports = Availability;