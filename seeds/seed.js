const sequelize = require('../config/connection');
const { Category, Product, Tag, ProductTag } = require('../models');

const categorySeedData = require('./categorySeedData.json');
const productSeedData = require('./productSeedData.json');
const tagSeedData = require('./tagSeedData.json');
const productTagSeedData = require('./productTagSeedData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });
    console.log("database")
    const categories = await Category.
    bulkCreate(categorySeedData);
    console.log("categories added")
    const products = await Product.bulkCreate(productSeedData);
    console.log("products added")
    const tags = await Tag.bulkCreate(tagSeedData);
    console.log("tags added")
    const productTags = await ProductTag.bulkCreate(productTagSeedData);
    console.log("productTags added")

    process.exit(0);
};

seedDatabase();
