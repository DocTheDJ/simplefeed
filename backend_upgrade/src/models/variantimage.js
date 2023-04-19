import { DataTypes, Model } from "sequelize";
import Variant from "./variant.js";
import Image from "./image.js";

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
        Variant.hasMany(VariantImage, {
            foreignKey: 'variant',
            onDelete: 'cascade'
        });
        Image.hasMany(VariantImage, {
            foreignKey: 'image',
            onDelete: 'cascade'
        })
    }
}

export default VariantImage;