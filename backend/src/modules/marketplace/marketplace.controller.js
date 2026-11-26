import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
// Helper to sanitize public product view (Strict Seller Privacy)
const sanitizeProductForPublic = (p) => {
    return {
        _id: p._id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        category: p.category,
        price: p.price,
        discountPrice: p.discountPrice,
        stock: p.stock,
        variants: p.variants || [],
        specifications: p.specifications || [],
        images: p.images || [],
        isFeatured: p.isFeatured || false,
        rating: p.rating || 4.8,
        reviewsCount: p.reviewsCount || 12,
        createdAt: p.createdAt,
        // Note: owner name, personal phone, personal address, ownerId are completely omitted!
    };
};
const sanitizeServiceForPublic = (s) => {
    return {
        _id: s._id,
        title: s.title,
        description: s.description,
        category: s.category,
        pricingType: s.pricingType,
        price: s.price,
        serviceArea: s.serviceArea,
        availabilitySchedule: s.availabilitySchedule,
        images: s.images || [],
        createdAt: s.createdAt,
    };
};
// 1. PRODUCTS
export const getPublicProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort, featured } = req.query;
        let products = dbStore.collection.products.filter((p) => p.status === 'approved');
        if (category && category !== 'all') {
            products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
        }
        if (featured === 'true') {
            products = products.filter((p) => p.isFeatured);
        }
        if (search) {
            const q = search.toLowerCase();
            products = products.filter((p) => p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q));
        }
        if (minPrice) {
            products = products.filter((p) => p.price >= parseFloat(minPrice));
        }
        if (maxPrice) {
            products = products.filter((p) => p.price <= parseFloat(maxPrice));
        }
        if (sort === 'price_asc') {
            products.sort((a, b) => a.price - b.price);
        }
        else if (sort === 'price_desc') {
            products.sort((a, b) => b.price - a.price);
        }
        else {
            // Newest first
            products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        const sanitized = products.map(sanitizeProductForPublic);
        return res.json({ success: true, count: sanitized.length, data: sanitized });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getProductById = async (req, res) => {
    try {
        const product = dbStore.collection.products.find((p) => p._id === req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        return res.json({ success: true, product: sanitizeProductForPublic(product) });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const createProduct = async (req, res) => {
    try {
        const { businessId, title, description, category, price, discountPrice, stock, variants, specifications, images } = req.body;
        let business = null;
        if (businessId) {
            business = dbStore.collection.businesses.find((b) => b._id === businessId && b.ownerId === req.user._id);
        }
        if (!business) {
            business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        }
        if (!business && !req.user.roles.includes('admin')) {
            return res.status(403).json({ success: false, message: 'Business required.' });
        }
        if (!title || !price || !category) {
            return res.status(400).json({ success: false, message: 'Title, price, and category are required.' });
        }
        const newProduct = {
            _id: uuidv4(),
            businessId: business ? business._id : 'admin-system',
            title,
            slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            description: description || '',
            category,
            price: parseFloat(price),
            discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
            stock: parseInt(stock || '10', 10),
            variants: variants || [],
            specifications: specifications || [],
            images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
            status: 'approved', // Auto-approved for verified businesses
            isFeatured: false,
            rating: 5.0,
            reviewsCount: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        dbStore.collection.products.push(newProduct);
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'CREATE_PRODUCT', 'Product', newProduct._id, `Created product "${title}"`);
        return res.status(201).json({ success: true, message: 'Product published successfully!', product: newProduct });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getBusinessProducts = async (req, res) => {
    try {
        const { businessId } = req.query;
        const myBizIds = dbStore.collection.businesses.filter(b => b.ownerId === req.user._id).map(b => b._id);
        if (myBizIds.length === 0 && !req.user.roles.includes('admin')) {
            return res.json({ success: true, data: [] });
        }
        let products = dbStore.collection.products.filter((p) =>
            businessId ? p.businessId === businessId : myBizIds.includes(p.businessId)
        );
        return res.json({ success: true, data: products });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const product = dbStore.collection.products.find((p) => p._id === req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        const myBizIds = dbStore.collection.businesses.filter(b => b.ownerId === req.user._id).map(b => b._id);
        if (!req.user.roles.includes('admin') && !myBizIds.includes(product.businessId)) {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this product.' });
        }
        Object.assign(product, req.body, { updatedAt: new Date().toISOString() });
        dbStore.save();
        return res.json({ success: true, message: 'Product updated successfully.', product });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const index = dbStore.collection.products.findIndex((p) => p._id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        const product = dbStore.collection.products[index];
        const myBizIds = dbStore.collection.businesses.filter(b => b.ownerId === req.user._id).map(b => b._id);
        if (!req.user.roles.includes('admin') && !myBizIds.includes(product.businessId)) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this product.' });
        }
        dbStore.collection.products.splice(index, 1);
        dbStore.save();
        return res.json({ success: true, message: 'Product deleted.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 2. SERVICES
export const getPublicServices = async (req, res) => {
    try {
        const services = dbStore.collection.services.filter((s) => s.status === 'approved');
        return res.json({ success: true, data: services.map(sanitizeServiceForPublic) });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getBusinessServices = async (req, res) => {
    try {
        const { businessId } = req.query;
        const myBizIds = dbStore.collection.businesses.filter(b => b.ownerId === req.user._id).map(b => b._id);
        if (myBizIds.length === 0 && !req.user.roles.includes('admin')) {
            return res.json({ success: true, data: [] });
        }
        let services = dbStore.collection.services.filter((s) =>
            businessId ? s.businessId === businessId : myBizIds.includes(s.businessId)
        );
        return res.json({ success: true, data: services });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const createService = async (req, res) => {
    try {
        const { businessId, title, description, category, pricingType, price, serviceArea, availabilitySchedule, images } = req.body;
        let business = null;
        if (businessId) {
            business = dbStore.collection.businesses.find((b) => b._id === businessId && b.ownerId === req.user._id);
        }
        if (!business) {
            business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        }
        const newService = {
            _id: uuidv4(),
            businessId: business ? business._id : 'admin-system',
            title,
            description,
            category,
            pricingType: pricingType || 'fixed',
            price: price ? parseFloat(price) : undefined,
            serviceArea: serviceArea || 'Worldwide / Online',
            availabilitySchedule: availabilitySchedule || 'Mon - Fri, 9am - 6pm',
            images: images || ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'],
            status: 'approved',
            createdAt: new Date().toISOString(),
        };
        dbStore.collection.services.push(newService);
        dbStore.save();
        return res.status(201).json({ success: true, message: 'Service published!', service: newService });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateService = async (req, res) => {
    try {
        const service = dbStore.collection.services.find((s) => s._id === req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found.' });
        }
        const myBizIds = dbStore.collection.businesses.filter(b => b.ownerId === req.user._id).map(b => b._id);
        if (!req.user.roles.includes('admin') && !myBizIds.includes(service.businessId)) {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this service.' });
        }
        Object.assign(service, req.body, { updatedAt: new Date().toISOString() });
        dbStore.save();
        return res.json({ success: true, message: 'Service updated successfully.', service });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteService = async (req, res) => {
    try {
        const index = dbStore.collection.services.findIndex((s) => s._id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Service not found.' });
        }
        const service = dbStore.collection.services[index];
        const myBizIds = dbStore.collection.businesses.filter(b => b.ownerId === req.user._id).map(b => b._id);
        if (!req.user.roles.includes('admin') && !myBizIds.includes(service.businessId)) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this service.' });
        }
        dbStore.collection.services.splice(index, 1);
        dbStore.save();
        return res.json({ success: true, message: 'Service deleted.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 3. CART & CHECKOUT
export const getCart = async (req, res) => {
    try {
        let cart = dbStore.collection.carts.find((c) => c.userId === req.user._id);
        if (!cart) {
            cart = { userId: req.user._id, items: [] };
            dbStore.collection.carts.push(cart);
            dbStore.save();
        }
        const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = Math.round(subtotal * 0.08 * 100) / 100;
        const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
        const total = Math.round((subtotal + tax + shipping) * 100) / 100;
        return res.json({
            success: true,
            cart: {
                items: cart.items,
                subtotal,
                tax,
                shipping,
                total,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, variant } = req.body;
        const product = dbStore.collection.products.find((p) => p._id === productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        let cart = dbStore.collection.carts.find((c) => c.userId === req.user._id);
        if (!cart) {
            cart = { userId: req.user._id, items: [] };
            dbStore.collection.carts.push(cart);
        }
        const existingIndex = cart.items.findIndex((item) => item.productId === productId && item.variant === variant);
        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += quantity;
        }
        else {
            cart.items.push({
                productId: product._id,
                businessId: product.businessId,
                title: product.title,
                price: product.discountPrice || product.price,
                image: product.images[0] || '',
                quantity,
                variant,
            });
        }
        dbStore.save();
        return res.json({ success: true, message: 'Item added to cart.', cart });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = dbStore.collection.carts.find((c) => c.userId === req.user._id);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart is empty.' });
        }
        if (quantity <= 0) {
            cart.items = cart.items.filter((item) => item.productId !== productId);
        }
        else {
            const item = cart.items.find((item) => item.productId === productId);
            if (item)
                item.quantity = quantity;
        }
        dbStore.save();
        return res.json({ success: true, message: 'Cart updated.', cart });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = dbStore.collection.carts.find((c) => c.userId === req.user._id);
        if (cart) {
            cart.items = cart.items.filter((item) => item.productId !== productId);
            dbStore.save();
        }
        return res.json({ success: true, message: 'Item removed from cart.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 4. ORDERS & CHECKOUT
export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod = 'credit_card', idempotencyKey } = req.body;
        // Idempotency guard: prevent duplicate orders
        if (idempotencyKey) {
            const existingPayment = dbStore.collection.payments.find((p) => p.idempotencyKey === idempotencyKey);
            if (existingPayment) {
                const order = dbStore.collection.orders.find((o) => o._id === existingPayment.orderId);
                return res.json({ success: true, message: 'Order retrieved (idempotent)', order });
            }
        }
        let cart = dbStore.collection.carts.find((c) => c.userId === req.user._id);
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty. Cannot checkout.' });
        }
        const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const taxAmount = Math.round(subtotal * 0.08 * 100) / 100;
        const shippingFee = subtotal > 100 ? 0 : 9.99;
        const totalAmount = Math.round((subtotal + taxAmount + shippingFee) * 100) / 100;
        const orderNumber = `BH-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const newOrder = {
            _id: uuidv4(),
            orderNumber,
            userId: req.user._id,
            customerName: req.user.fullName,
            customerEmail: req.user.email,
            items: cart.items.map((i) => ({
                ...i,
                subtotal: Math.round(i.price * i.quantity * 100) / 100,
            })),
            shippingAddress,
            subtotal,
            taxAmount,
            shippingFee,
            totalAmount,
            orderStatus: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        dbStore.collection.orders.unshift(newOrder);
        // Save payment record
        const newPayment = {
            _id: uuidv4(),
            orderId: newOrder._id,
            userId: req.user._id,
            amount: totalAmount,
            currency: 'USD',
            provider: paymentMethod,
            transactionId: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
            idempotencyKey: idempotencyKey || uuidv4(),
            status: 'paid',
            createdAt: new Date().toISOString(),
        };
        dbStore.collection.payments.push(newPayment);
        // Deduct stock
        for (const item of cart.items) {
            const prod = dbStore.collection.products.find((p) => p._id === item.productId);
            if (prod && prod.stock >= item.quantity) {
                prod.stock -= item.quantity;
            }
        }
        // Clear cart
        cart.items = [];
        // Notification to user
        dbStore.collection.notifications.push({
            _id: uuidv4(),
            userId: req.user._id,
            title: 'Order Confirmed!',
            message: `Your order #${orderNumber} has been received and confirmed.`,
            type: 'success',
            link: '/dashboard/student/orders',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'ORDER_PLACED', 'Order', newOrder._id, `Placed order #${orderNumber} for $${totalAmount}`);
        return res.status(201).json({
            success: true,
            message: 'Order placed and payment processed successfully!',
            order: newOrder,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getMyOrders = async (req, res) => {
    try {
        const orders = dbStore.collection.orders.filter((o) => o.userId === req.user._id);
        return res.json({ success: true, data: orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getBusinessOrders = async (req, res) => {
    try {
        const business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        if (!business) {
            return res.json({ success: true, data: [] });
        }
        // Filter orders containing items for this business
        const orders = dbStore.collection.orders.filter((o) => o.items.some((item) => item.businessId === business._id));
        return res.json({ success: true, data: orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        const order = dbStore.collection.orders.find((o) => o._id === id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        order.orderStatus = orderStatus;
        order.updatedAt = new Date().toISOString();
        // Notify user of order update
        dbStore.collection.notifications.push({
            _id: uuidv4(),
            userId: order.userId,
            title: `Order Status Update: #${order.orderNumber}`,
            message: `Your order #${order.orderNumber} is now marked as ${orderStatus}.`,
            type: 'info',
            link: '/dashboard/student/orders',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        dbStore.save();
        return res.json({ success: true, message: `Order updated to ${orderStatus}.`, order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 5. ALL ORDERS (Admin)
export const getAllOrders = async (req, res) => {
    try {
        return res.json({ success: true, data: dbStore.collection.orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
