const { DataTypes, Model } = require('sequelize');

class Manufacturer extends Model{
    static migrate(sequelize){
        Manufacturer.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING(128),
            original_name: DataTypes.STRING(128)
        }, {sequelize});
    }
};

module.exports = Manufacturer;