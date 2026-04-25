import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useShopify } from "../../context/ShopifyContext";

export default function Cart() {
  const {
    cart,
    cartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    cartCount,
    cartTotal,
    configured,
  } = useShopify();

  return (
    <Transition show={cartOpen} as={Fragment}>
      <Dialog onClose={() => toggleCart(false)} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        {/* Panel */}
        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="w-full max-w-md bg-warm-white shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-earth-100">
                <DialogTitle className="font-heading text-xl font-semibold text-lodge-dark flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Cart ({cartCount})
                </DialogTitle>
                <button
                  onClick={() => toggleCart(false)}
                  className="p-1 text-lodge-charcoal/50 hover:text-lodge-charcoal transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-12 h-12 text-earth-200 mb-4" />
                    <p className="text-lodge-charcoal/60 font-medium">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-lodge-charcoal/40 mt-1">
                      Browse our lodge shop to find something special.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li
                        key={item.variant.id}
                        className="flex gap-4 bg-white rounded-xl p-3 border border-earth-100"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-earth-50 flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image.src}
                              alt={item.image.altText || item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-earth-300 text-xs">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-lodge-dark truncate">
                            {item.title}
                          </h4>
                          {item.variant.title !== "Default Title" && (
                            <p className="text-xs text-lodge-charcoal/50">
                              {item.variant.title}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-forest-700 mt-1">
                            ${parseFloat(item.variant.price.amount).toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.variant.id,
                                  item.quantity - 1
                                )
                              }
                              className="p-1 rounded-md border border-earth-200 hover:bg-earth-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.variant.id,
                                  item.quantity + 1
                                )
                              }
                              className="p-1 rounded-md border border-earth-200 hover:bg-earth-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.variant.id)}
                              className="ml-auto text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t border-earth-100 px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lodge-charcoal/70">
                      Subtotal
                    </span>
                    <span className="text-lg font-bold text-lodge-dark">
                      ${cartTotal}
                    </span>
                  </div>
                  <p className="text-xs text-lodge-charcoal/50">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <button
                    onClick={checkout}
                    disabled={!configured}
                    className="w-full py-3 bg-forest-600 text-white font-medium rounded-xl hover:bg-forest-700 active:scale-[0.98] transition-all disabled:bg-earth-200 disabled:text-earth-400 disabled:cursor-not-allowed"
                  >
                    {configured ? "Proceed to Checkout" : "Configure Shopify to Checkout"}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-sm text-lodge-charcoal/50 hover:text-red-500 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
