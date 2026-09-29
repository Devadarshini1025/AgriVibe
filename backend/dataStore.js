const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDbFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
        const defaultHash = bcrypt.hashSync("password123", 10);
        const initialData = {
            users: [
                {
                    _id: "user_farmer_1",
                    name: "Ramesh Kumar",
                    email: "farmer@gmail.com",
                    password: defaultHash,
                    role: "farmer",
                    createdAt: new Date().toISOString()
                },
                {
                    _id: "user_buyer_1",
                    name: "Suresh Patel",
                    email: "buyer@gmail.com",
                    password: defaultHash,
                    role: "buyer",
                    createdAt: new Date().toISOString()
                }
            ],
            products: [
                {
                    _id: "prod_1",
                    cropName: "Tomato",
                    quantity: 500,
                    pricePerKg: 28,
                    harvestDate: "2026-09-20",
                    state: "Tamil Nadu",
                    district: "Coimbatore",
                    villageTown: "Pollachi",
                    pickupPoint: "Central Mandi",
                    farmerName: "Ramesh Kumar",
                    referencePrice: 30,
                    priceDifference: -2,
                    farmerBenefit: 0,
                    consumerSaving: 6.67,
                    priceStatus: "Below Reference",
                    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
                },
                {
                    _id: "prod_2",
                    cropName: "Potato",
                    quantity: 800,
                    pricePerKg: 24,
                    harvestDate: "2026-09-22",
                    state: "Punjab",
                    district: "Jalandhar",
                    villageTown: "Nakodar",
                    pickupPoint: "Cold Storage #4",
                    farmerName: "Harpreet Singh",
                    referencePrice: 25,
                    priceDifference: -1,
                    farmerBenefit: 0,
                    consumerSaving: 4.0,
                    priceStatus: "Fair",
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    _id: "prod_3",
                    cropName: "Rice",
                    quantity: 1200,
                    pricePerKg: 42,
                    harvestDate: "2026-09-18",
                    state: "Andhra Pradesh",
                    district: "East Godavari",
                    villageTown: "Kakinada",
                    pickupPoint: "Warehouse Gate 2",
                    farmerName: "Venkat Rao",
                    referencePrice: 40,
                    priceDifference: 2,
                    farmerBenefit: 5.0,
                    consumerSaving: 0,
                    priceStatus: "Fair",
                    createdAt: new Date().toISOString()
                }
            ],
            orders: [
                {
                    _id: "order_1",
                    productId: "prod_1",
                    cropName: "Tomato",
                    farmerName: "Ramesh Kumar",
                    buyerName: "Suresh Patel",
                    buyerEmail: "buyer@gmail.com",
                    quantity: 50,
                    pricePerKg: 28,
                    totalPrice: 1400,
                    status: "Accepted",
                    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
                }
            ]
        };

        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    }
}

function readLocalDb() {
    ensureDbFile();
    try {
        const raw = fs.readFileSync(DB_FILE, "utf8");
        return JSON.parse(raw);
    } catch (e) {
        console.error("Error reading local db file:", e);
        return { users: [], products: [], orders: [] };
    }
}

function writeLocalDb(data) {
    ensureDbFile();
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
        console.error("Error writing to local db file:", e);
    }
}

function isMongoConnected() {
    return mongoose.connection.readyState === 1;
}

// User Operations
async function findUserByEmail(email) {
    const cleanEmail = String(email || "").toLowerCase().trim();
    if (isMongoConnected()) {
        return await User.findOne({ email: cleanEmail });
    }
    const db = readLocalDb();
    return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
}

async function createUser({ name, email, password, role }) {
    const cleanEmail = String(email || "").toLowerCase().trim();
    if (isMongoConnected()) {
        return await User.create({
            name: name.trim(),
            email: cleanEmail,
            password,
            role
        });
    }
    const db = readLocalDb();
    const newUser = {
        _id: "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        name: name.trim(),
        email: cleanEmail,
        password,
        role,
        createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeLocalDb(db);
    return newUser;
}

async function countUsers(role) {
    if (isMongoConnected()) {
        const query = role ? { role } : {};
        return await User.countDocuments(query);
    }
    const db = readLocalDb();
    if (!role) return db.users.length;
    return db.users.filter((u) => u.role === role).length;
}

// Product Operations
async function createProduct(productData) {
    if (isMongoConnected()) {
        return await Product.create(productData);
    }
    const db = readLocalDb();
    const newProduct = {
        _id: "prod_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        ...productData,
        createdAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    writeLocalDb(db);
    return newProduct;
}

async function getProducts({ search, farmerName }) {
    if (isMongoConnected()) {
        const filter = {};
        if (farmerName) filter.farmerName = farmerName;
        if (search) {
            filter.$or = [
                { cropName: { $regex: search, $options: "i" } },
                { state: { $regex: search, $options: "i" } },
                { district: { $regex: search, $options: "i" } },
                { villageTown: { $regex: search, $options: "i" } }
            ];
        }
        return await Product.find(filter).sort({ createdAt: -1 });
    }

    const db = readLocalDb();
    let result = [...db.products];

    if (farmerName) {
        result = result.filter(
            (p) => String(p.farmerName).toLowerCase() === farmerName.toLowerCase()
        );
    }

    if (search) {
        const s = search.toLowerCase();
        result = result.filter(
            (p) =>
                String(p.cropName).toLowerCase().includes(s) ||
                String(p.state).toLowerCase().includes(s) ||
                String(p.district).toLowerCase().includes(s) ||
                String(p.villageTown).toLowerCase().includes(s)
        );
    }

    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return result;
}

async function getProductById(id) {
    if (isMongoConnected()) {
        return await Product.findById(id);
    }
    const db = readLocalDb();
    return db.products.find((p) => String(p._id) === String(id)) || null;
}

async function updateProduct(id, updates) {
    if (isMongoConnected()) {
        return await Product.findByIdAndUpdate(id, updates, { new: true });
    }
    const db = readLocalDb();
    const idx = db.products.findIndex((p) => String(p._id) === String(id));
    if (idx !== -1) {
        db.products[idx] = { ...db.products[idx], ...updates };
        writeLocalDb(db);
        return db.products[idx];
    }
    return null;
}

async function countProducts() {
    if (isMongoConnected()) {
        return await Product.countDocuments();
    }
    const db = readLocalDb();
    return db.products.length;
}

// Order Operations
async function createOrder(orderData) {
    if (isMongoConnected()) {
        return await Order.create(orderData);
    }
    const db = readLocalDb();
    const newOrder = {
        _id: "order_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        ...orderData,
        status: "Pending",
        createdAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    writeLocalDb(db);
    return newOrder;
}

async function getOrders({ buyerEmail, farmerName }) {
    if (isMongoConnected()) {
        const filter = {};
        if (buyerEmail) filter.buyerEmail = buyerEmail.toLowerCase();
        if (farmerName) filter.farmerName = farmerName;
        return await Order.find(filter).sort({ createdAt: -1 });
    }

    const db = readLocalDb();
    let result = [...db.orders];

    if (buyerEmail) {
        result = result.filter(
            (o) => String(o.buyerEmail).toLowerCase() === buyerEmail.toLowerCase()
        );
    }

    if (farmerName) {
        result = result.filter(
            (o) => String(o.farmerName).toLowerCase() === farmerName.toLowerCase()
        );
    }

    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return result;
}

async function getOrderById(id) {
    if (isMongoConnected()) {
        return await Order.findById(id);
    }
    const db = readLocalDb();
    return db.orders.find((o) => String(o._id) === String(id)) || null;
}

async function updateOrder(id, updates) {
    if (isMongoConnected()) {
        return await Order.findByIdAndUpdate(id, updates, { new: true });
    }
    const db = readLocalDb();
    const idx = db.orders.findIndex((o) => String(o._id) === String(id));
    if (idx !== -1) {
        db.orders[idx] = { ...db.orders[idx], ...updates };
        writeLocalDb(db);
        return db.orders[idx];
    }
    return null;
}

async function countOrders(status) {
    if (isMongoConnected()) {
        const query = status ? { status } : {};
        return await Order.countDocuments(query);
    }
    const db = readLocalDb();
    if (!status) return db.orders.length;
    return db.orders.filter((o) => o.status === status).length;
}

module.exports = {
    isMongoConnected,
    findUserByEmail,
    createUser,
    countUsers,
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    countProducts,
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    countOrders
};

