const router = require('express').Router();
const { Category, Product, Tag, ProductTag } = require('../../models');

// GET all products

router.get('/', async (req, res) => {
    // when getting product data via findAll include based on associatins of models allows for prudct data to include model category data, model tag data, and product tag data
    try {
        const productData = await Product.findAll({
            include: [{ model: Category }, { model: Tag, through: ProductTag }]
        });
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create a product

router.post('/', async (req, res) => {
    try {
        const productData = await Product.create(req.body);
        console.log(productData.id)
        // console.log(req.body.tags)
        // .map() allows for loop through the product tags using the productData.id to add tag id's. tag id's will be connected to product_id in productTags.js. Use bulkCreate() to allow for creating multiple instances at once.
        if (req.body.tags.length > 0) {
            const newProductTags = req.body.tags.map((tagId) => {
                return {
                    product_id: productData.id,
                    tag_id: tagId
                }
            });
            const productTags = await ProductTag.bulkCreate(newProductTags)
        }

        // console.log(productData)
        res.status(200).json(productData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Update product

router.put('/:id', async (req, res) => {
    try {
        const productUpdateData = await Product.findByPk(req.params.id);

        if (!productUpdateData) {
            res.status(404).json({ message: 'No product found with this id!' });
            return;
        } else {
            const productData = await Product.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            // updating tags with updating products
            if (req.body.tags.length > 0) {
                // getting all product tags that match the id from the request(w/ insomnia)
                const productTags = await ProductTag.findAll({
                    where: {
                        product_id: req.params.id
                    }
                })
                console.log(productTags, "product tags")
                // extracting all the tag ids from the product tags gotten above
                const productTagIds = productTags.map(({ tag_id }) => tag_id);
                // filtering out tag ids to add into the database
                const newProductTags = req.body.tags.filter((tag_id) => !productTagIds.includes(tag_id))
                    .map((tag_id) => {
                        // for each tag id there will be product_id and tag_id as seen in product tag model
                        return {
                            product_id: req.params.id,
                            tag_id: tag_id
                        }
                    })
                console.log(newProductTags, "new product tags")
                // filtering out tag id that we need to remove from the database table... .map() is returning the filtered id's in form of an array
                const productTagsToDestroy = productTags.filter(({ tag_id }) => !req.body.tags.includes(tag_id)).map(({ id }) => id)
                console.log(productTagsToDestroy, "product tags to destroy")
                // looping though all the proudct tags that need to be removed
                // for (let i = 0; i < productTagsToDestroy.length; i++) {
                //     let tagIdToRemove = productTagsToDestroy[i]
                //     await ProductTag.destroy({
                //         where: {
                //             id: tagIdToRemove
                //         }
                //     })
                // }
                for (const tagidremove of productTagsToDestroy) {
                    // for each product running a destroy method to remove tag (where the condition meets the id)
                    await ProductTag.destroy({
                        where: {
                            id: tagidremove
                        }
                    })
                }
                // looping through each of the tags and adding tags that didnt exist before
                for (const newTag of newProductTags) {
                    await ProductTag.create(newTag)
                }
            }
            console.log(productData)
            res.status(200).json(productData);
        }
    } catch (err) {
        res.status(400).json(err);
    }
});



// Delete product

router.delete('/:id', async (req, res) => {
    try {
        const productData = await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!productData) {
            res.status(404).json({ message: 'No product found with this id!' });
            return;
        }
        console.log("product deleted with id " + req.params.id)
        res.status(200).json(productData);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;