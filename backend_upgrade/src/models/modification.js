const { DataTypes, Model } = require('sequelize');

class Modification extends Model{
    static migrate(sequelize){
        Modification.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING(128),
        }, {sequelize});
    }
};

module.exports = Modification;