const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Category = require('../models/category');
const mongoose = require('mongoose');
const db = require('../config/db/connectdb');
db();

async function seedDB() {
    async function seedCate(titleStr) {
        try {
            const cate = await new Category({
                title: titleStr,
            });
            await cate.save();
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async function closeDB() {
        console.log('closing connection');
        await mongoose.disconnect();
    }

    await seedCate('Nike');
    //await seedCate('Adidas');
    await seedCate('FILA');

    await closeDB();
}

seedDB();
