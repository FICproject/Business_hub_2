import { Router } from 'express';
import {
  getPublicProducts,
  getProductById,
  createProduct,
  getBusinessProducts,
  updateProduct,
  deleteProduct,
  getPublicServices,
  createService,
  getBusinessServices,
  updateService,
  deleteService,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  createOrder,
  getMyOrders,
  getBusinessOrders,
  updateOrderStatus,
  getAllOrders,
  toggleListingStatus,
  adminReviewListing,
} from './marketplace.controller';
import {
  authenticateToken,
  requireRoles,
  requireApprovedBusiness,
} from '../../middleware/auth.middleware';

const router = Router();

// Public Product & Service Catalog (Strict Seller Privacy - no owner personal details exposed!)
router.get('/products', getPublicProducts);
router.get('/products/:id', getProductById);
router.get('/services', getPublicServices);

// Verified Business Product Management
router.post('/products', authenticateToken, requireApprovedBusiness, createProduct);
router.get('/business/products', authenticateToken, getBusinessProducts);
router.put('/products/:id', authenticateToken, updateProduct);
router.delete('/products/:id', authenticateToken, deleteProduct);
router.patch('/products/:id/status', authenticateToken, toggleListingStatus);

// Verified Business Service Management
router.post('/services', authenticateToken, requireApprovedBusiness, createService);
router.get('/business/services', authenticateToken, getBusinessServices);
router.put('/services/:id', authenticateToken, updateService);
router.delete('/services/:id', authenticateToken, deleteService);
router.patch('/services/:id/status', authenticateToken, toggleListingStatus);

// Admin Listing Moderation
router.put('/admin/listings/:type/:id/review', authenticateToken, requireRoles('admin'), adminReviewListing);

// Shopping Cart (Any Authenticated User / Student)
router.get('/cart', authenticateToken, getCart);
router.post('/cart/items', authenticateToken, addToCart);
router.put('/cart/items', authenticateToken, updateCartItem);
router.delete('/cart/items/:productId', authenticateToken, removeFromCart);
// Checkout & Orders
router.post('/orders', authenticateToken, createOrder);
router.get('/orders/my-orders', authenticateToken, getMyOrders);
router.get('/orders/business', authenticateToken, getBusinessOrders);
router.put('/orders/:id/status', authenticateToken, updateOrderStatus);
router.get('/admin/orders', authenticateToken, requireRoles('admin'), getAllOrders);
export default router;
