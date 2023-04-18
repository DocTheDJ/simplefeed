import { DataTypes, Model, Sequelize } from "sequelize";

class VariantParam extends Model{
    static migrate(sequelize: Sequelize){
        VariantParam.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            var_param: DataTypes.BOOLEAN
        }, {sequelize})
    }
}

export default VariantParam;