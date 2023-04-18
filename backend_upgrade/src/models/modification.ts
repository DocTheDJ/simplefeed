// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model } from "sequelize";

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

export default Modification;
// module.exports = Modification;