// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model } from "sequelize"

class Image extends Model{
    static migrate(sequelize){
        Image.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            image: DataTypes.STRING(512)
        }, {sequelize})
    }
}

export default Image;
// module.exports = Image