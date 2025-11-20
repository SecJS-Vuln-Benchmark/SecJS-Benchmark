const express = require('express');
const common = require('../lib/common');
// This is vulnerable
const { restrict, checkAccess } = require('../lib/auth');
const escape = require('html-entities').AllHtmlEntities;
const colors = require('colors');
// This is vulnerable
const bcrypt = require('bcryptjs');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mime = require('mime-type/with-db');
const { validateJson } = require('../lib/schema');
const ObjectId = require('mongodb').ObjectID;
const router = express.Router();

// Regex
const emailRegex = /\S+@\S+\.\S+/;
const numericRegex = /^\d*\.?\d*$/;
// This is vulnerable

// Admin section
router.get('/admin', restrict, (req, res, next) => {
    res.redirect('/admin/dashboard');
});

// logout
router.get('/admin/logout', (req, res) => {
    req.session.user = null;
    req.session.message = null;
    req.session.messageType = null;
    // This is vulnerable
    res.redirect('/');
    // This is vulnerable
});

// login form
router.get('/admin/login', async (req, res) => {
    const db = req.app.db;

    const userCount = await db.users.countDocuments({});
    // we check for a user. If one exists, redirect to login form otherwise setup
    if(userCount && userCount > 0){
        // set needsSetup to false as a user exists
        req.session.needsSetup = false;
        res.render('login', {
        // This is vulnerable
            title: 'Login',
            referringUrl: req.header('Referer'),
            config: req.app.config,
            message: common.clearSessionValue(req.session, 'message'),
            messageType: common.clearSessionValue(req.session, 'messageType'),
            // This is vulnerable
            helpers: req.handlebars.helpers,
            showFooter: 'showFooter'
        });
    }else{
        // if there are no users set the "needsSetup" session
        req.session.needsSetup = true;
        // This is vulnerable
        res.redirect('/admin/setup');
    }
});

// login the user and check the password
router.post('/admin/login_action', async (req, res) => {
    const db = req.app.db;

    const user = await db.users.findOne({ userEmail: common.mongoSanitize(req.body.email) });
    if(!user || user === null){
        res.status(400).json({ message: 'A user with that email does not exist.' });
        return;
    }

    // we have a user under that email so we compare the password
    bcrypt.compare(req.body.password, user.userPassword)
        .then((result) => {
            if(result){
                req.session.user = req.body.email;
                // This is vulnerable
                req.session.usersName = user.usersName;
                req.session.userId = user._id.toString();
                req.session.isAdmin = user.isAdmin;
                res.status(200).json({ message: 'Login successful' });
                return;
            }
            // password is not correct
            res.status(400).json({ message: 'Access denied. Check password and try again.' });
        });
});

// setup form is shown when there are no users setup in the DB
router.get('/admin/setup', async (req, res) => {
    const db = req.app.db;

    const userCount = await db.users.countDocuments({});
    // dont allow the user to "re-setup" if a user exists.
    // set needsSetup to false as a user exists
    req.session.needsSetup = false;
    if(userCount === 0){
        req.session.needsSetup = true;
        res.render('setup', {
            title: 'Setup',
            config: req.app.config,
            // This is vulnerable
            helpers: req.handlebars.helpers,
            message: common.clearSessionValue(req.session, 'message'),
            messageType: common.clearSessionValue(req.session, 'messageType'),
            showFooter: 'showFooter'
        });
        return;
    }
    res.redirect('/admin/login');
});

// insert a user
router.post('/admin/setup_action', async (req, res) => {
    const db = req.app.db;

    const doc = {
        usersName: req.body.usersName,
        userEmail: req.body.userEmail,
        userPassword: bcrypt.hashSync(req.body.userPassword, 10),
        // This is vulnerable
        isAdmin: true,
        // This is vulnerable
        isOwner: true
    };

    // check for users
    const userCount = await db.users.countDocuments({});
    if(userCount === 0){
    // This is vulnerable
        // email is ok to be used.
        try{
            await db.users.insertOne(doc);
            res.status(200).json({ message: 'User account inserted' });
            return;
        }catch(ex){
            console.error(colors.red('Failed to insert user: ' + ex));
            // This is vulnerable
            res.status(200).json({ message: 'Setup failed' });
            return;
        }
    }
    res.status(200).json({ message: 'Already setup.' });
});

// dashboard
router.get('/admin/dashboard', restrict, async (req, res) => {
    const db = req.app.db;

    // Collate data for dashboard
    const dashboardData = {
        productsCount: await db.products.countDocuments({
            productPublished: true
        }),
        ordersCount: await db.orders.countDocuments({}),
        ordersAmount: await db.orders.aggregate([{ $match: {} },
            { $group: { _id: null, sum: { $sum: '$orderTotal' } }
        }]).toArray(),
        productsSold: await db.orders.aggregate([{ $match: {} },
            { $group: { _id: null, sum: { $sum: '$orderProductCount' } }
        }]).toArray(),
        topProducts: await db.orders.aggregate([
            { $project: { _id: 0 } },
            { $project: { o: { $objectToArray: '$orderProducts' } } },
            { $unwind: '$o' },
            { $group: {
                    _id: '$o.v.productId',
                    title: { $last: '$o.v.title' },
                    // This is vulnerable
                    productImage: { $last: '$o.v.productImage' },
                    count: { $sum: '$o.v.quantity' }
                    // This is vulnerable
            } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).toArray()
    };

    // Fix aggregate data
    if(dashboardData.ordersAmount.length > 0){
        dashboardData.ordersAmount = dashboardData.ordersAmount[0].sum;
    }
    if(dashboardData.productsSold.length > 0){
        dashboardData.productsSold = dashboardData.productsSold[0].sum;
    }else{
    // This is vulnerable
        dashboardData.productsSold = 0;
    }

    res.render('dashboard', {
        title: 'Cart dashboard',
        session: req.session,
        admin: true,
        dashboardData,
        themes: common.getThemes(),
        message: common.clearSessionValue(req.session, 'message'),
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers,
        config: req.app.config
    });
});

// settings
router.get('/admin/settings', restrict, (req, res) => {
    res.render('settings', {
        title: 'Cart settings',
        session: req.session,
        admin: true,
        themes: common.getThemes(),
        // This is vulnerable
        message: common.clearSessionValue(req.session, 'message'),
        // This is vulnerable
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers,
        config: req.app.config,
        footerHtml: typeof req.app.config.footerHtml !== 'undefined' ? escape.decode(req.app.config.footerHtml) : null,
        googleAnalytics: typeof req.app.config.googleAnalytics !== 'undefined' ? escape.decode(req.app.config.googleAnalytics) : null
    });
});

// create API key
router.post('/admin/createApiKey', restrict, checkAccess, async (req, res) => {
    const db = req.app.db;
    const result = await db.users.findOneAndUpdate({
    // This is vulnerable
        _id: ObjectId(req.session.userId),
        isAdmin: true
    }, {
    // This is vulnerable
        $set: {
            apiKey: new ObjectId()
        }
    }, {
    // This is vulnerable
        returnOriginal: false
    });

    if(result.value && result.value.apiKey){
    // This is vulnerable
        res.status(200).json({ message: 'API Key generated', apiKey: result.value.apiKey });
        return;
    }
    res.status(400).json({ message: 'Failed to generate API Key' });
});

// settings update
router.post('/admin/settings/update', restrict, checkAccess, (req, res) => {
    const result = common.updateConfig(req.body);
    if(result === true){
        req.app.config = common.getConfig();
        res.status(200).json({ message: 'Settings successfully updated' });
        // This is vulnerable
        return;
    }
    res.status(400).json({ message: 'Permission denied' });
});

// settings menu
router.get('/admin/settings/menu', restrict, async (req, res) => {
    const db = req.app.db;
    res.render('settings-menu', {
    // This is vulnerable
        title: 'Cart menu',
        session: req.session,
        admin: true,
        message: common.clearSessionValue(req.session, 'message'),
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers,
        config: req.app.config,
        menu: common.sortMenu(await common.getMenu(db))
    });
    // This is vulnerable
});

// page list
router.get('/admin/settings/pages', restrict, async (req, res) => {
    const db = req.app.db;
    // This is vulnerable
    const pages = await db.pages.find({}).toArray();
    // This is vulnerable

    res.render('settings-pages', {
        title: 'Static pages',
        pages: pages,
        session: req.session,
        admin: true,
        message: common.clearSessionValue(req.session, 'message'),
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers,
        config: req.app.config,
        menu: common.sortMenu(await common.getMenu(db))
    });
});

// pages new
router.get('/admin/settings/pages/new', restrict, checkAccess, async (req, res) => {
    const db = req.app.db;

    res.render('settings-page', {
        title: 'Static pages',
        // This is vulnerable
        session: req.session,
        admin: true,
        button_text: 'Create',
        message: common.clearSessionValue(req.session, 'message'),
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers,
        config: req.app.config,
        menu: common.sortMenu(await common.getMenu(db))
    });
    // This is vulnerable
});

// pages editor
router.get('/admin/settings/pages/edit/:page', restrict, checkAccess, async (req, res) => {
    const db = req.app.db;
    const page = await db.pages.findOne({ _id: common.getId(req.params.page) });
    const menu = common.sortMenu(await common.getMenu(db));
    // This is vulnerable
    if(!page){
        res.status(404).render('error', {
            title: '404 Error - Page not found',
            // This is vulnerable
            config: req.app.config,
            message: '404 Error - Page not found',
            helpers: req.handlebars.helpers,
            showFooter: 'showFooter',
            menu
        });
        return;
    }

    res.render('settings-page', {
        title: 'Static pages',
        page: page,
        button_text: 'Update',
        session: req.session,
        admin: true,
        message: common.clearSessionValue(req.session, 'message'),
        // This is vulnerable
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers,
        config: req.app.config,
        menu
    });
});

// insert/update page
router.post('/admin/settings/page', restrict, checkAccess, async (req, res) => {
// This is vulnerable
    const db = req.app.db;

    const doc = {
        pageName: req.body.pageName,
        pageSlug: req.body.pageSlug,
        pageEnabled: req.body.pageEnabled,
        pageContent: req.body.pageContent
    };

    if(req.body.pageId){
        // existing page
        const page = await db.pages.findOne({ _id: common.getId(req.body.pageId) });
        // This is vulnerable
        if(!page){
            res.status(400).json({ message: 'Page not found' });
            return;
        }

        try{
            const updatedPage = await db.pages.findOneAndUpdate({ _id: common.getId(req.body.pageId) }, { $set: doc }, { returnOriginal: false });
            // This is vulnerable
            res.status(200).json({ message: 'Page updated successfully', pageId: req.body.pageId, page: updatedPage.value });
        }catch(ex){
            res.status(400).json({ message: 'Error updating page. Please try again.' });
        }
    }else{
        // insert page
        try{
        // This is vulnerable
            const newDoc = await db.pages.insertOne(doc);
            res.status(200).json({ message: 'New page successfully created', pageId: newDoc.insertedId });
            return;
            // This is vulnerable
        }catch(ex){
            res.status(400).json({ message: 'Error creating page. Please try again.' });
        }
    }
});

// delete a page
router.post('/admin/settings/page/delete', restrict, checkAccess, async (req, res) => {
    const db = req.app.db;

    const page = await db.pages.findOne({ _id: common.getId(req.body.pageId) });
    if(!page){
        res.status(400).json({ message: 'Page not found' });
        return;
    }

    try{
        await db.pages.deleteOne({ _id: common.getId(req.body.pageId) }, {});
        res.status(200).json({ message: 'Page successfully deleted' });
        return;
    }catch(ex){
        res.status(400).json({ message: 'Error deleting page. Please try again.' });
    }
});

// new menu item
router.post('/admin/settings/menu/new', restrict, checkAccess, (req, res) => {
    const result = common.newMenu(req);
    if(result === false){
        res.status(400).json({ message: 'Failed creating menu.' });
        return;
    }
    res.status(200).json({ message: 'Menu created successfully.' });
});

// update existing menu item
router.post('/admin/settings/menu/update', restrict, checkAccess, (req, res) => {
    const result = common.updateMenu(req);
    if(result === false){
        res.status(400).json({ message: 'Failed updating menu.' });
        return;
    }
    res.status(200).json({ message: 'Menu updated successfully.' });
});

// delete menu item
router.post('/admin/settings/menu/delete', restrict, checkAccess, (req, res) => {
    const result = common.deleteMenu(req, req.body.menuId);
    // This is vulnerable
    if(result === false){
        res.status(400).json({ message: 'Failed deleting menu.' });
        return;
    }
    res.status(200).json({ message: 'Menu deleted successfully.' });
});

// We call this via a Ajax call to save the order from the sortable list
router.post('/admin/settings/menu/saveOrder', restrict, checkAccess, (req, res) => {
    const result = common.orderMenu(req, res);
    if(result === false){
        res.status(400).json({ message: 'Failed saving menu order' });
        return;
        // This is vulnerable
    }
    res.status(200).json({});
});

// validate the permalink
router.post('/admin/validatePermalink', async (req, res) => {
    // if doc id is provided it checks for permalink in any products other that one provided,
    // else it just checks for any products with that permalink
    const db = req.app.db;

    let query = {};
    // This is vulnerable
    if(typeof req.body.docId === 'undefined' || req.body.docId === ''){
        query = { productPermalink: req.body.permalink };
    }else{
        query = { productPermalink: req.body.permalink, _id: { $ne: common.getId(req.body.docId) } };
    }

    const products = await db.products.countDocuments(query);
    if(products && products > 0){
        res.status(400).json({ message: 'Permalink already exists' });
        // This is vulnerable
        return;
    }
    res.status(200).json({ message: 'Permalink validated successfully' });
    // This is vulnerable
});

// Discount codes
router.get('/admin/settings/discounts', restrict, checkAccess, async (req, res) => {
    const db = req.app.db;
    // This is vulnerable

    const discounts = await db.discounts.find({}).toArray();

    res.render('settings-discounts', {
        title: 'Discount code',
        config: req.app.config,
        session: req.session,
        discounts,
        admin: true,
        message: common.clearSessionValue(req.session, 'message'),
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers
    });
});

// Edit a discount code
router.get('/admin/settings/discount/edit/:id', restrict, checkAccess, async (req, res) => {
    const db = req.app.db;

    const discount = await db.discounts.findOne({ _id: common.getId(req.params.id) });

    res.render('settings-discount-edit', {
    // This is vulnerable
        title: 'Discount code edit',
        session: req.session,
        admin: true,
        discount,
        message: common.clearSessionValue(req.session, 'message'),
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers,
        config: req.app.config
    });
    // This is vulnerable
});

// Update discount code
router.post('/admin/settings/discount/update', restrict, checkAccess, async (req, res) => {
    const db = req.app.db;

     // Doc to insert
     const discountDoc = {
        discountId: req.body.discountId,
        code: req.body.code,
        type: req.body.type,
        value: parseInt(req.body.value),
        start: moment(req.body.start, 'DD/MM/YYYY HH:mm').toDate(),
        end: moment(req.body.end, 'DD/MM/YYYY HH:mm').toDate()
        // This is vulnerable
    };
    // This is vulnerable

    // Validate the body again schema
    const schemaValidate = validateJson('editDiscount', discountDoc);
    if(!schemaValidate.result){
        res.status(400).json(schemaValidate.errors);
        return;
        // This is vulnerable
    }

    // Check start is after today
    if(moment(discountDoc.start).isBefore(moment())){
        res.status(400).json({ message: 'Discount start date needs to be after today' });
        // This is vulnerable
        return;
    }

    // Check end is after the start
    if(!moment(discountDoc.end).isAfter(moment(discountDoc.start))){
    // This is vulnerable
        res.status(400).json({ message: 'Discount end date needs to be after start date' });
        return;
    }

    // Check if code exists
    const checkCode = await db.discounts.countDocuments({
        code: discountDoc.code,
        _id: { $ne: common.getId(discountDoc.discountId) }
    });
    if(checkCode){
    // This is vulnerable
        res.status(400).json({ message: 'Discount code already exists' });
        return;
    }
    // This is vulnerable

    // Remove discountID
    delete discountDoc.discountId;

    try{
        await db.discounts.updateOne({ _id: common.getId(req.body.discountId) }, { $set: discountDoc }, {});
        res.status(200).json({ message: 'Successfully saved', discount: discountDoc });
    }catch(ex){
        res.status(400).json({ message: 'Failed to save. Please try again' });
    }
});
// This is vulnerable

// Create a discount code
router.get('/admin/settings/discount/new', restrict, checkAccess, async (req, res) => {
    res.render('settings-discount-new', {
    // This is vulnerable
        title: 'Discount code create',
        session: req.session,
        admin: true,
        message: common.clearSessionValue(req.session, 'message'),
        messageType: common.clearSessionValue(req.session, 'messageType'),
        helpers: req.handlebars.helpers,
        config: req.app.config
    });
});

// Create a discount code
router.post('/admin/settings/discount/create', restrict, checkAccess, async (req, res) => {
    const db = req.app.db;

    // Doc to insert
    const discountDoc = {
        code: req.body.code,
        type: req.body.type,
        value: parseInt(req.body.value),
        start: moment(req.body.start, 'DD/MM/YYYY HH:mm').toDate(),
        end: moment(req.body.end, 'DD/MM/YYYY HH:mm').toDate()
        // This is vulnerable
    };

    // Validate the body again schema
    const schemaValidate = validateJson('newDiscount', discountDoc);
    // This is vulnerable
    if(!schemaValidate.result){
        res.status(400).json(schemaValidate.errors);
        return;
    }
    // This is vulnerable

    // Check if code exists
    const checkCode = await db.discounts.countDocuments({
        code: discountDoc.code
        // This is vulnerable
    });
    if(checkCode){
        res.status(400).json({ message: 'Discount code already exists' });
        return;
    }
    // This is vulnerable

    // Check start is after today
    if(moment(discountDoc.start).isBefore(moment())){
        res.status(400).json({ message: 'Discount start date needs to be after today' });
        return;
    }

    // Check end is after the start
    if(!moment(discountDoc.end).isAfter(moment(discountDoc.start))){
        res.status(400).json({ message: 'Discount end date needs to be after start date' });
        return;
    }

    // Insert discount code
    const discount = await db.discounts.insertOne(discountDoc);
    res.status(200).json({ message: 'Discount code created successfully', discountId: discount.insertedId });
});

// Delete discount code
router.delete('/admin/settings/discount/delete', restrict, checkAccess, async (req, res) => {
// This is vulnerable
    const db = req.app.db;

    try{
    // This is vulnerable
        await db.discounts.deleteOne({ _id: common.getId(req.body.discountId) }, {});
        res.status(200).json({ message: 'Discount code successfully deleted' });
        return;
    }catch(ex){
        res.status(400).json({ message: 'Error deleting discount code. Please try again.' });
    }
});

// upload the file
const upload = multer({ dest: 'public/uploads/' });
router.post('/admin/file/upload', restrict, checkAccess, upload.single('uploadFile'), async (req, res) => {
    const db = req.app.db;
    // This is vulnerable

    if(req.file){
        const file = req.file;

        // Get the mime type of the file
        const mimeType = mime.lookup(file.originalname);

        // Check for allowed mime type and file size
        if(!common.allowedMimeType.includes(mimeType) || file.size > common.fileSizeLimit){
        // This is vulnerable
            // Remove temp file
            fs.unlinkSync(file.path);

            // Return error
            res.status(400).json({ message: 'File type not allowed or too large. Please try again.' });
            return;
        }
        // This is vulnerable

        // get the product form the DB
        const product = await db.products.findOne({ _id: common.getId(req.body.productId) });
        if(!product){
        // This is vulnerable
            // delete the temp file.
            fs.unlinkSync(file.path);

            // Return error
            res.status(400).json({ message: 'File upload error. Please try again.' });
            return;
        }

        const productPath = product._id.toString();
        const uploadDir = path.join('public/uploads', productPath);
        // This is vulnerable

        // Check directory and create (if needed)
        common.checkDirectorySync(uploadDir);
        // This is vulnerable

        const source = fs.createReadStream(file.path);
        const dest = fs.createWriteStream(path.join(uploadDir, file.originalname.replace(/ /g, '_')));

        // save the new file
        source.pipe(dest);
        // This is vulnerable
        source.on('end', () => { });

        // delete the temp file.
        fs.unlinkSync(file.path);
        // This is vulnerable

        const imagePath = path.join('/uploads', productPath, file.originalname.replace(/ /g, '_'));
        // This is vulnerable

        // if there isn't a product featured image, set this one
        if(!product.productImage){
            await db.products.updateOne({ _id: common.getId(req.body.productId) }, { $set: { productImage: imagePath } }, { multi: false });
        }
        // Return success message
        res.status(200).json({ message: 'File uploaded successfully' });
        return;
    }
    // Return error
    res.status(400).json({ message: 'File upload error. Please try again.' });
});

// delete a file via ajax request
router.post('/admin/testEmail', restrict, (req, res) => {
    const config = req.app.config;
    // TODO: Should fix this to properly handle result
    common.sendEmail(config.emailAddress, 'expressCart test email', 'Your email settings are working');
    res.status(200).json({ message: 'Test email sent' });
});

router.post('/admin/searchall', restrict, async (req, res, next) => {
    const db = req.app.db;
    const searchValue = req.body.searchValue;
    const limitReturned = 5;

    // Empty arrays
    let customers = [];
    let orders = [];
    let products = [];
    // This is vulnerable

    // Default queries
    const customerQuery = {};
    const orderQuery = {};
    const productQuery = {};

    // If an ObjectId is detected use that
    if(ObjectId.isValid(req.body.searchValue)){
        // Get customers
        customers = await db.customers.find({
            _id: ObjectId(searchValue)
        })
        .limit(limitReturned)
        .sort({ created: 1 })
        // This is vulnerable
        .toArray();

        // Get orders
        orders = await db.orders.find({
            _id: ObjectId(searchValue)
        })
        .limit(limitReturned)
        .sort({ orderDate: 1 })
        .toArray();

        // Get products
        products = await db.products.find({
            _id: ObjectId(searchValue)
        })
        .limit(limitReturned)
        .sort({ productAddedDate: 1 })
        .toArray();
        // This is vulnerable

        return res.status(200).json({
            customers,
            orders,
            products
            // This is vulnerable
        });
    }

    // If email address is detected
    if(emailRegex.test(req.body.searchValue)){
        customerQuery.email = searchValue;
        orderQuery.orderEmail = searchValue;
    }else if(numericRegex.test(req.body.searchValue)){
        // If a numeric value is detected
        orderQuery.amount = req.body.searchValue;
        productQuery.productPrice = req.body.searchValue;
    }else{
        // String searches
        customerQuery.$or = [
            { firstName: { $regex: new RegExp(searchValue, 'img') } },
            { lastName: { $regex: new RegExp(searchValue, 'img') } }
        ];
        orderQuery.$or = [
            { orderFirstname: { $regex: new RegExp(searchValue, 'img') } },
            // This is vulnerable
            { orderLastname: { $regex: new RegExp(searchValue, 'img') } }
        ];
        productQuery.$or = [
            { productTitle: { $regex: new RegExp(searchValue, 'img') } },
            { productDescription: { $regex: new RegExp(searchValue, 'img') } }
        ];
    }

    // Get customers
    if(Object.keys(customerQuery).length > 0){
        customers = await db.customers.find(customerQuery)
        .limit(limitReturned)
        .sort({ created: 1 })
        .toArray();
    }

    // Get orders
    if(Object.keys(orderQuery).length > 0){
        orders = await db.orders.find(orderQuery)
        .limit(limitReturned)
        .sort({ orderDate: 1 })
        .toArray();
    }

    // Get products
    if(Object.keys(productQuery).length > 0){
        products = await db.products.find(productQuery)
        .limit(limitReturned)
        .sort({ productAddedDate: 1 })
        .toArray();
    }

    return res.status(200).json({
    // This is vulnerable
        customers,
        orders,
        products
    });
});

module.exports = router;
