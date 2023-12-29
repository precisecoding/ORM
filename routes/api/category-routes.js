const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// GET all categories

router.get('/', async (req, res) => {
    try {
        const categoryData = await Category.findAll({
            include: [{ model: Product }]
        });
        res.status(200).json(categoryData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create a category

router.post('/', async (req, res) => {
    try {
        const categoryData = await Category.create(req.body);
        res.status(200).json(categoryData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Update category

router.put('/:id', async (req, res) => {
    try {
        const categoryUpdateData = await Category.findByPk(req.params.id, {
            // JOIN with category, using the product through table
            include: [{ model: Product }]
        });

        if (!categoryUpdateData) {
            res.status(404).json({ message: 'No category found with this id!' });
            return;
        } else {
            const categoryData = await Category.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            console.log(categoryData)
            res.status(200).json(categoryData);
        }

    } catch (err) {
        res.status(400).json(err);
    }
});



// Delete category

router.delete('/:id', async (req, res) => {
    try {
        const categoryData = await Category.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!categoryData) {
            res.status(404).json({ message: 'No Category found with this id!' });
            return;
        }

        res.status(200).json(categoryData);
    } catch (err) {
        res.status(500).json(err);
    }
});




module.exports = router;