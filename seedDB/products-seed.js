const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');
const faker = require('faker');
const db = require('../config/db/connectdb');
db.connect();

async function seedDB() {
    faker.seed(0);
    //---NIKE
    const nike_titles = ['Nike Air Force 1', 'Nike Air Jordan'];
    const nike_imgs = [
        'https://images.unsplash.com/photo-1517364856726-1142831463be?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
        'https://images.unsplash.com/photo-1500886834366-f7311927c60d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80',
    ];
    //----ADIDAS
    const adidas_titles = ['Adidas Air Mowabb', 'Adidas Flyknit Racer'];
    const adidas_imgs = [
        'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
        'https://images.unsplash.com/photo-1530906622963-8a60586a49c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    ];
    async function seedProducts(titlesArr, imgsArr, categStr) {
        try {
            const categ = await Category.findOne({ title: categStr });
            for (let i = 0; i < titlesArr.length; i++) {
                let prod = new Product({
                    productCode: faker.helpers.replaceSymbolWithNumber('####-##########'),
                    title: titlesArr[i],
                    imagePath: imgsArr[i],
                    description: faker.lorem.paragraph(),
                    price: faker.random.number({ min: 10, max: 50 }),
                    manufacturer: faker.company.companyName(0),
                    available: true,
                    category: categ._id,
                });
                await prod.save();
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async function closeDB() {
        console.log('Closing connection');
        await mongoose.disconnect();
    }

    //seed
    await seedProducts(nike_titles, nike_imgs, 'Nike');
    await seedProducts(adidas_titles, adidas_imgs, 'Adidas');

    await closeDB();
}
seedDB();
