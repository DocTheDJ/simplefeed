const { DataTypes, Model } = require('sequelize');
const Category = require('./category');

class Rule extends Model{
    static migrate(sequelize){
        Rule.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING(128),
            action: DataTypes.STRING(64),
            css_class: DataTypes.STRING(32)
        }, {sequelize});
        Rule.hasMany(Category, {
            foreignKey: 'action'
        })
    }
};

module.exports = Rule;