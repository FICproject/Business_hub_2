import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { marketplaceApi } from '../../services/api';
import { setCart } from '../../store';
import { RootState } from '../../store';
import { ICart } from '../../types';

export const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const cart = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await marketplaceApi.getCart();
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await marketplaceApi.updateCartItem({ productId, quantity });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await marketplaceApi.removeFromCart(productId);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <ShoppingBag className="w-12 h-12 text-teal-600 mx-auto" />
        <h2 className="text-xl font-bold text-navy-900">Sign in to view your cart</h2>
        <p className="text-xs text-slate-500">Log in or create an account to start shopping verified products.</p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy-900">Your Shopping Cart</h1>
        <p className="text-xs text-slate-500 mt-1">Review your items, apply vouchers, and proceed to checkout.</p>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>
      ) : cart.items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-lg">Your Cart is Currently Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curated hardware, electronics, and office supplies.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md hover:bg-teal-700"
          >
            Explore Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h4>
                      {item.variant && (
                        <p className="text-xs text-teal-600 font-semibold mt-0.5">Variant: {item.variant}</p>
                      )}
                      <p className="text-sm font-extrabold text-navy-900 mt-1">${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-slate-900 min-w-[70px] text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link to="/marketplace" className="text-xs font-bold text-slate-600 hover:text-teal-600 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-navy-900">Order Summary</h3>

              <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-slate-900">${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-slate-900">
                    {cart.shipping === 0 ? <span className="text-teal-600 font-bold">FREE</span> : `$${cart.shipping.toFixed(2)}`}
                  </span>
                </div>
                {cart.subtotal < 100 && (
                  <p className="text-[11px] text-teal-600 font-semibold bg-teal-50 p-2 rounded-lg">
                    Add ${(100 - cart.subtotal).toFixed(2)} more to qualify for Free Shipping!
                  </p>
                )}
              </div>

              <div className="flex justify-between text-base font-extrabold text-navy-900">
                <span>Total Amount</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>256-Bit SSL Encrypted Idempotent Checkout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
