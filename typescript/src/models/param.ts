import { DataTypes, Model, Sequelize } from "sequelize";

class Param extends Model{
    static migrate(sequelize: Sequelize){
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