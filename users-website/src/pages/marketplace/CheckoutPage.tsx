import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldCheck, CheckCircle2, CreditCard, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { marketplaceApi } from '../../services/api';
import { clearCart } from '../../store';
import { RootState } from '../../store';

export const CheckoutPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94105');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState(user?.mobile || '+1 555-0100');

  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Stripe)');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Generate idempotency key to prevent double checkout callbacks
      const idempotencyKey = `bh-idem-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const res = await marketplaceApi.createOrder({
        shippingAddress: {
          fullName,
          address,
          city,
          state,
          postalCode,
          country,
          phone,
        },
        paymentMethod,
        idempotencyKey,
      });

      if (res.data.success) {
        setOrderConfirmed(res.data.order);
        dispatch(clearCart());
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
              Order Confirmed & Paid
            </span>
            <h2 className="text-2xl font-extrabold text-navy-900 mt-2">Thank you for your order!</h2>
            <p className="text-xs text-slate-500">
              Order <span className="font-bold text-slate-800">#{orderConfirmed.orderNumber}</span> has been confirmed.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Paid:</span>
              <span className="font-extrabold text-slate-900">${orderConfirmed.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-teal-600 uppercase">{orderConfirmed.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fulfillment Status:</span>
              <span className="font-bold text-slate-800 capitalize">{orderConfirmed.orderStatus}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between">
              <span className="text-slate-500">Shipping To:</span>
              <span className="font-medium text-slate-800">{orderConfirmed.shippingAddress.address}, {orderConfirmed.shippingAddress.city}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              to="/dashboard/student"
              className="py-3 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-700"
            >
              Track in Dashboard
            </Link>
            <Link
              to="/marketplace"
              className="py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Your Cart is Empty</h2>
        <Link to="/marketplace" className="inline-block px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link to="/cart" className="text-xs font-bold text-slate-500 hover:text-teal-600 flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <h1 className="text-3xl font-extrabold text-navy-900">Checkout & Payment</h1>
        <p className="text-xs text-slate-500 mt-1">Complete your delivery address and secure payment.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Shipping & Payment Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-navy-900">1. Shipping Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-navy-900">2. Payment Method</h3>
              <div className="flex items-center gap-1 text-xs text-teal-600 font-bold">
                <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {['Credit Card (Stripe)', 'PayPal Sandbox'].map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all ${
                    paymentMethod === pm
                      ? 'border-teal-500 bg-teal-50 text-teal-800'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1.5" />
                  {pm}
                </button>
              ))}
            </div>

            {paymentMethod.includes('Card') && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CVC Code</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-navy-900">Order Summary</h3>

            {/* Items mini list */}
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
              {cart.items.map((i) => (
                <div key={i.productId} className="py-2 flex items-center justify-between text-xs">
                  <span className="text-slate-700 line-clamp-1 max-w-[170px]">
                    {i.quantity}x {i.title}
                  </span>
                  <span className="font-bold text-slate-900">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-bold text-slate-900">${cart.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-teal-600">{cart.shipping === 0 ? 'FREE' : `$${cart.shipping}`}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-navy-900">
              <span>Total Amount</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Payment...' : `Pay $${cart.total.toFixed(2)} Now`}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
