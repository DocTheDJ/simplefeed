import Feed from "./models/feed.js";
import Availability from "./models/availability.js";
import Category from "./models/category.js";
import Image from "./models/image.js";
import Manufacturer from "./models/manufacturer.js";
import Modification from "./models/modification.js";
import Param from "./models/param.js";
import ParamName from "./models/paramname.js";
import ParamValue from "./models/paramvalue.js";
import Product from "./models/product.js";
import Rule from "./models/rule.js";
import Variant from "./models/variant.js";
import VariantImage from "./models/variantimage.js";
import VariantParam from "./models/variantparam.js";

// const Feed = require('./models/feed');
// const Availability = require('./models/availability');

function migrate(sequelize){
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