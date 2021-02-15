const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update, list, photo } = require('../controllers/product');

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { userById } = require('../controllers/user');

router.get('/product/:productId', read);

router.post("/product/create/:userId", requireSignin, isAdmin, create); 

router.delete('/product/:productId/:userId', requireSignin, isAdmin, remove);

router.put('/product/:productId/:userId', requireSignin, isAdmin, update);

router.get('/products', list);

router.get("/product/photo/:productId", photo);

router.param('userId', userById); 

router.param('productId', productById); 

module.exports = router;