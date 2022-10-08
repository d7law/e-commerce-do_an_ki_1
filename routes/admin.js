const express = require('express');
const app = express();
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const mongoose = require('mongoose');
const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');
const Order = require('../models/order');

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
    databases: [mongoose],
    rootPath: '/admin',
    branding: {
        companyName: 'dLaw Shoes',
        logo: '/images/logo.png',
        softwareBrothers: false,
    },
    resources: [
        {
            resource: Product,
            options: {
                parent: {
                    name: 'Admin content',
                    icon: 'InventoryManagement',
                },
                properties: {
                    description: {
                        type: 'richtext',
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    _id: {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },
                    title: {
                        isTitle: true,
                    },
                    price: {
                        type: 'number',
                    },
                    imagePath: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                        components: {
                            show: AdminBro.bundle('../components/admin-imgPath-component.jsx'),
                        },
                    },
                },
            },
        },
        {
            resource: User,
            options: {
                parent: {
                    name: 'User content',
                    icon: 'User',
                },
                properties: {
                    _id: {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },
                    username: {
                        isTitle: true,
                    },
                },
            },
        },
        {
            resource: Order,
            options: {
                parent: {
                    name: 'User content',
                    icon: 'User',
                },
                properties: {
                    user: {
                        isTitle: true,
                    },
                    _id: {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },
                    paymentId: {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },
                    address: {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },
                    createdAt: {
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                    cart: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                        components: {
                            show: AdminBro.bundle('../components/admin-order-component.jsx'),
                        },
                    },
                    'cart.items': {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    'cart.totalQty': {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    'cart.totalCost': {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                },
            },
        },
        {
            resource: Category,
            options: {
                parent: {
                    name: 'Admin content',
                    icon: 'User',
                },
                properties: {
                    _id: {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },
                    slug: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    title: {
                        isTitle: true,
                    },
                },
            },
        },
    ],
    locale: {
        translations: {
            labels: {
                loginWelcome: 'Welcome Dlaw-Shoes Admin',
            },
            messages: {
                loginWelcome: 'Login to manage your Store',
            },
        },
    },
    dashboard: {
        component: AdminBro.bundle('../components/admin-dashboard-component.jsx'),
    },
});

const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'caonhanqd',
    password: process.env.ADMIN_PASSWORD || 'hykln123',
};

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        if (ADMIN.password === password && ADMIN.email === email) {
            return ADMIN;
        }
        return null;
    },
    cookieName: process.env.ADMIN_COOKIE_NAME || 'cookie_caonhanqd_admin',
    cookiePassword: process.env.ADMIN_COOKIE_PASSWORD || 'cookie_caonhanqd_password_admin',
});

module.exports = router;
