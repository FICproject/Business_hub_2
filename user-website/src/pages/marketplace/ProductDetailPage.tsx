import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Star,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { marketplaceApi } from '../../services/api';
import { setCart } from '../../store';
import { IProduct } from '../../types';
import { ShareModal } from '../../components/sharing/ShareModal';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      setLoading(true);
      marketplaceApi.getProductById(id)
        .then((res) => {
          if (res.data.success) {
            setProduct(res.data.product);
            setSelectedImage(res.data.product.images[0]);
            if (res.data.product.variants && res.data.product.variants.length > 0) {
              setSelectedVariant(res.data.product.variants[0].options[0] || '');
            }
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = async (buyNow = false) => {
    if (!product) return;
    try {
      const res = await marketplaceApi.addToCart({
        productId: product._id,
        quantity,
        variant: selectedVariant,
      });
      if (res.data.success) {
        const cartRes = await marketplaceApi.getCart();
        dispatch(setCart(cartRes.data.cart));

        if (buyNow) {
          navigate('/checkout');
        } else {
          setAddedToast(true);
          setTimeout(() => setAddedToast(false), 3000);
        }
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Could not add to cart');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Product Not Found</h2>
        <Link to="/marketplace" className="inline-block px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-sm animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5 text-teal-200" />
          <span>Added {quantity} item(s) to your shopping cart!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/marketplace" className="hover:text-teal-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>
        <span>/</span>
        <span className="text-slate-800">{product.category}</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="h-96 sm:h-[450px] rounded-2xl bg-slate-100 overflow-hidden relative">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-navy-900/80 backdrop-blur-md text-white text-xs font-bold uppercase px-3 py-1 rounded-lg">
              {product.category}
            </span>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-teal-500 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {product.rating || 4.9}
                </span>
                <span className="text-xs text-slate-500 font-medium">({product.reviewsCount || 18} Verified Reviews)</span>
              </div>
              <button
                onClick={() => setIsShareOpen(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-snug">
              {product.title}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-3xl font-extrabold text-navy-900">
                ${product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ${product.price}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 ml-auto bg-emerald-50 px-2.5 py-1 rounded-md">
                In Stock ({product.stock} units)
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Variant Picker */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  {product.variants[0].name}: <span className="text-teal-600">{selectedVariant}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants[0].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariant(opt)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedVariant === opt
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleAddToCart(false)}
                className="py-3.5 px-6 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-sm transition-all flex items-center justify-center gap-2 border border-teal-200/80"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                className="py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Privacy & Shipping Guarantees */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Seller Privacy Shielded</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-600" />
              <span>Free Express Shipping $100+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-navy-900">Technical Specifications</h3>
          <div className="divide-y divide-slate-100 max-w-2xl">
            {product.specifications.map((spec, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">{spec.key}</span>
                <span className="font-semibold text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        targetType="product"
        targetId={product._id}
        title={product.title}
      />
    </div>
  );
};
