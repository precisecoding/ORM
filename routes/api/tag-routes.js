const router = require('express').Router();
const { Category, Product, Tag, ProductTag } = require('../../models');

// GET all tags

router.get('/', async (req, res) => {
    try {
        const tagData = await Tag.findAll({
            include: [{ model: Product, through: ProductTag }]
        });
        res.status(200).json(tagData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create tags

router.post('/', async (req, res) => {
    try {
        const tagData = await Tag.create(req.body);
        res.status(200).json(tagData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Update tags

router.put('/:id', async (req, res) => {
    try {
        const tagUpdateData = await Tag.findByPk(req.params.id);
        if (!tagUpdateData) {
            res.status(404).json({ message: 'No tag found with this id!' });
            return;
        } else {
            const tagData = await Tag.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            console.log(tagData)
            res.status(200).json(tagData);
        }

    } catch (err) {
        res.status(400).json(err);
    }
});



// Delete tags

router.delete('/:id', async (req, res) => {
    try {
        const tagData = await Tag.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!tagData) {
            res.status(404).json({ message: 'No tag found with this id!' });
            return;
        }

        res.status(200).json(tagData);
    } catch (err) {
        res.status(500).json(err);
    }
});




module.exports = router;