import { DataTypes, Model } from "sequelize";

class VariantImage extends Model{
    static migrate(sequelize){
        VariantImage.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            main: DataTypes.BOOLEAN
        }, {sequelize})
    }
}

export default VariantImage;