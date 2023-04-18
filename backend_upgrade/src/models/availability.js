const { DataTypes, Model } = require('sequelize');

class Availability extends Model{
    static migrate(sequelize){
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
    }
};

module.exports = Availability;