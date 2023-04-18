import { DataTypes, Model } from "sequelize";

class Param extends Model{
    static migrate(sequelize){
        Param.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
        }, {sequelize});
    }
}

export default Param;