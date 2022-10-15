const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/search', productController.search);
router.get('/:slug', productController.getSlug);
router.get('/:slug/:id', productController.getIdBySLug);

module.exports = router;
