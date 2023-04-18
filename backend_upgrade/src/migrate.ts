import {Sequelize} from "sequelize";
import Feed from "./models/feed";
import Availability from "./models/availability";
import Category from "./models/category";
import Image from "./models/image";
import Manufacturer from "./models/manufacturer";
import Modification from "./models/modification";
import Param from "./models/param";
import ParamName from "./models/paramname";
import ParamValue from "./models/paramvalue";
import Product from "./models/product";
import Rule from "./models/rule";
import Variant from "./models/variant";
import VariantImage from "./models/variantimage";
import VariantParam from "./models/variantparam";

// const Feed = require('./models/feed');
// const Availability = require('./models/availability');

function migrate(sequelize: Sequelize){
    Availability.migrate(sequelize);
    Feed.migrate(sequelize);
    Category.migrate(sequelize);
    Image.migrate(sequelize);
    Manufacturer.migrate(sequelize);
    Modification.migrate(sequelize);
    Param.migrate(sequelize);
    ParamName.migrate(sequelize);
    ParamValue.migrate(sequelize);
    Product.migrate(sequelize);
    Rule.migrate(sequelize);
    Variant.migrate(sequelize);
    VariantImage.migrate(sequelize);
    VariantParam.migrate(sequelize);
}

export {migrate}
// module.exports = {migrate};