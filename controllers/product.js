const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');

exports.productById = (req, res, next, id) => {
	Product.findById(id).exec((err, product) => {
		if(err || !product) {
			return res.status(400).json({
				error: 'Product not found'
			});
		}
		req.product = product;
		next();
	});
};

exports.read = (req, res) => {
	req.product.photo = undefined
	return res.json(req.product);
}

exports.create = (req, res) => {
	 
	let form = new formidable.IncomingForm();
	form.keepExtensions = true
	form.parse(req, (err, fields, files) => {
		if(err) {
			return res.status(400).json({
				error: 'Image could not be uploaded'
			})
		}

		const {name, description, price, category, quantity, shipping} = fields;

		if(!name || !description || !price || !category || !quantity || !shipping) {
			return res.status(400).json({
					error: 'All fields are required'
				});
		}

		let product = new Product(fields);

		// file size checking

		if(files.photo) {
			//console.log('files photo', files.photo);
			if(files.photo.size > 1000000){
				return res.status(400).json({
					error: 'File should be less than 1mb'
				})
			}
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;

		}

		product.save((err, result) => {
				if(err) {
					return res.status(400).json({
					error: err
				});
			}
			res.json(result);
		})
	})
};


exports.remove = (req, res) => {
	let product = req.product;
	product.remove((err, deleteProduct) => {
		if(err) {
					return res.status(400).json({
					error: err
				});
			}
			res.json({
				message: "Product deleted successfully"
			});
	});
};

exports.update = (req, res) => {
	 
	let form = new formidable.IncomingForm();
	form.keepExtensions = true
	form.parse(req, (err, fields, files) => {
		if(err) {
			return res.status(400).json({
				error: 'Image could not be uploaded'
			})
		}

		const {name, description, price, category, quantity, shipping} = fields;

		if(!name || !description || !price || !category || !quantity || !shipping) {
			return res.status(400).json({
					error: 'All fields are required'
				});
		}

		let product = req.product;
		product = _.extend(product, fields)

		// file size checking

		if(files.photo) {
			//console.log('files photo', files.photo);
			if(files.photo.size > 1000000){
				return res.status(400).json({
					error: 'File should be less than 1mb'
				})
			}
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;

		}

		product.save((err, result) => {
				if(err) {
					return res.status(400).json({
					error: err
				});
			}
			res.json(result);
		})
	})
};


/**
* sell / arrival
* by sell = /products?sortBy=sold&order=desc&limit=4
* by arrival = /products?sortBy=created&order=desc&limit=4
* if no params are sent, then all products are returned
*/

exports.list = (req, res) => {
	let order = req.query.order ? req.query.order : 'asc'
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
	let limit = req.query.limit ? parseInt(req.query.limit) : 6

	Product.find()
			.select("-photo")
			.populate('category')
			.sort([[sortBy, order]])
			.limit(limit)
			.exec((err, products) => {
				if(err) {
					return res.status(400).json({
						error: 'Products not found'
					});
				}
			res.send(products);
			})
};

exports.photo = (req, res, next) => {
	if(req.product.photo.data) {
		res.set('Content-Type', req.product.photo.contentType)
		return res.send(req.product.photo.data);
	}
	next();
}














