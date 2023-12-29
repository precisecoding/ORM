// Product belongs to Category, and Category has many Product models, as a category can have multiple products but a product can only belong to one category.

// Product belongs to many Tag models, and Tag belongs to many Product models. Allow products to have multiple tags and tags to have many products by using the ProductTag through model.
const Category = require('./Category');
const Product = require('./Product');
const ProductTag = require('./ProductTag');
const Tag = require('./Tag');
// one product can only belong to one category, onDelete allows for if any category is deleted it will delete all of the products inside that category.
Product.belongsTo(Category, {
    foreignKey: 'category_id',
    onDelete: 'CASCADE'
});
Category.hasMany(Product, {
    foreignKey: 'category_id'
});
Product.belongsToMany(Tag, {
    through: ProductTag,
    foreignKey: 'product_id',
    onDelete: 'CASCADE'
});
// through
Tag.belongsToMany(Product, {
    through: ProductTag,
    foreignKey: 'tag_id'
});

module.exports = { Category, Product, Tag, ProductTag };