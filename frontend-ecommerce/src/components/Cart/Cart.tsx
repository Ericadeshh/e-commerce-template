import { useState, useEffect, useRef } from "react";
import { Offcanvas, Alert } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaCheck, FaBoxOpen } from "react-icons/fa";
import CartItem from "./CartItem/CartItem";
import PromoCode from "./PromoCode/PromoCode";
import PaymentMethods from "./PaymentMethods/PaymentMethods";
import ShippingOptions from "./ShippingOptions/ShippingOptions";
import OrderSummary from "./OrderSummary/OrderSummary";
import AdditionalOptions from "./AdditionalOptions/AdditionalOptions";
import WhyShop from "./WhyShop/WhyShop";
import styles from "./Cart.module.css";

// Static image imports for demo content
import MensJacket from "../../assets/mensjacket.jpg";
import WomensSummerDress from "../../assets/Women'sSummerDress.jpg";
import kidsTshirt from "../../assets/kidstshirt.jpg";

interface CartItemType {
  product_id: number;
  quantity: number;
  name: string;
  price: string | number;
  image: string;
  size?: string;
  color?: string;
  original_price?: string | number;
  stock_status?: string;
  category?: string;
}

interface CartProps {
  show: boolean;
  onHide: () => void;
}

const offcanvasVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const defaultCartItems: CartItemType[] = [
  {
    product_id: 1,
    name: "Men's Jacket",
    category: "Jackets",
    price: "4500.00",
    original_price: "6000.00",
    quantity: 1,
    size: "M",
    color: "Blue",
    image: MensJacket,
    stock_status: "in_stock",
  },
  {
    product_id: 2,
    name: "Women's Summer Dress",
    category: "Dresses",
    price: "3200.00",
    quantity: 2,
    size: "L",
    color: "Red",
    image: WomensSummerDress,
    stock_status: "in_stock",
  },
  {
    product_id: 3,
    name: "Kids T-Shirt",
    category: "T-Shirts",
    price: "800.00",
    quantity: 1,
    color: "Green",
    image: kidsTshirt,
    stock_status: "out_of_stock",
  },
];

const Cart: React.FC<CartProps> = ({ show, onHide }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [userAddedItems, setUserAddedItems] = useState<CartItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shippingOption, setShippingOption] = useState<
    "standard" | "express" | "pickup"
  >("standard");
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    "credit_card" | "mpesa" | "paypal" | "bank_transfer" | null
  >(null);
  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  const userId = 1;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/cart?user_id=${userId}`
        );
        if (!res.ok) {
          throw new Error("Failed to load cart");
        }
        const data: CartItemType[] = await res.json();
        const parsedData = data.map((item) => ({
          ...item,
          price: parseFloat(item.price as string).toFixed(2),
          original_price: item.original_price
            ? parseFloat(item.original_price as string).toFixed(2)
            : undefined,
          image: item.image || MensJacket,
        }));
        setCartItems(parsedData);
        setSuccess("Cart loaded successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Fetch error:", err);
        if (userAddedItems.length > 0) {
          setCartItems(userAddedItems);
          setSuccess("Showing user-added items (server offline)");
        } else {
          setCartItems(defaultCartItems);
          setSuccess("Using default cart data (server offline)");
        }
        setTimeout(() => setSuccess(null), 3000);
      }
    };
    fetchCart();
  }, [userAddedItems]);

  const addToCart = async (item: CartItemType) => {
    if (
      userAddedItems.find((cartItem) => cartItem.product_id === item.product_id)
    ) {
      setSuccess("Item already in cart!");
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/products/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.product_id,
          userId,
          quantity: 1,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }
      const updatedItems = [...userAddedItems, { ...item, quantity: 1 }];
      setUserAddedItems(updatedItems);
      setCartItems(updatedItems);
      setSuccess("Item added to cart!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Add to cart error:", err);
      const updatedItems = [...userAddedItems, { ...item, quantity: 1 }];
      setUserAddedItems(updatedItems);
      setCartItems(updatedItems);
      setSuccess("Item added to cart (offline mode)");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      setError("Quantity cannot be less than 1");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      fetch("http://localhost:5000/api/products/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId, quantity: newQuantity }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to update quantity");
          }
          const updatedItems = cartItems.map((item) =>
            item.product_id === productId
              ? { ...item, quantity: newQuantity }
              : item
          );
          setCartItems(updatedItems);
          setUserAddedItems(
            userAddedItems.map((item) =>
              item.product_id === productId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
          setSuccess("Quantity updated successfully!");
          setTimeout(() => setSuccess(null), 3000);
        })
        .catch((err) => {
          console.error("Update quantity error:", err);
          const updatedItems = cartItems.map((item) =>
            item.product_id === productId
              ? { ...item, quantity: newQuantity }
              : item
          );
          setCartItems(updatedItems);
          setUserAddedItems(
            userAddedItems.map((item) =>
              item.product_id === productId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
          setSuccess("Quantity updated (offline mode)");
          setTimeout(() => setSuccess(null), 3000);
        });
    } catch {
      const updatedItems = cartItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedItems);
      setUserAddedItems(
        userAddedItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      setSuccess("Quantity updated (offline mode)");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const removeFromCart = (productId: number) => {
    try {
      fetch("http://localhost:5000/api/products/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to remove from cart");
          }
          const updatedItems = cartItems.filter(
            (item) => item.product_id !== productId
          );
          setCartItems(updatedItems);
          setUserAddedItems(
            userAddedItems.filter((item) => item.product_id !== productId)
          );
          setSuccess("Item removed successfully!");
          setTimeout(() => setSuccess(null), 3000);
        })
        .catch((err) => {
          console.error("Remove from cart error:", err);
          const updatedItems = cartItems.filter(
            (item) => item.product_id !== productId
          );
          setCartItems(updatedItems);
          setUserAddedItems(
            userAddedItems.filter((item) => item.product_id !== productId)
          );
          setSuccess(
            updatedItems.length === 0 && userAddedItems.length === 0
              ? "Using default cart data (server offline)"
              : "Item removed (offline mode)"
          );
          setTimeout(() => setSuccess(null), 3000);
        });
    } catch {
      const updatedItems = cartItems.filter(
        (item) => item.product_id !== productId
      );
      setCartItems(updatedItems);
      setUserAddedItems(
        userAddedItems.filter((item) => item.product_id !== productId)
      );
      setSuccess(
        updatedItems.length === 0 && userAddedItems.length === 0
          ? "Using default cart data (server offline)"
          : "Item removed (offline mode)"
      );
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const saveItem = (productId: number) => {
    console.log(`Saving item ${productId} to wishlist`);
    setSuccess("Item saved to wishlist!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCheckout = () => {
    if (!selectedPayment) {
      setError("Please select a payment method before proceeding to checkout.");
      setTimeout(() => setError(null), 3000);
      if (paymentMethodsRef.current) {
        paymentMethodsRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    setSuccess("Checkout initiated successfully!");
    setTimeout(() => setSuccess(null), 3000);
    if (paymentMethodsRef.current) {
      paymentMethodsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyPromo = (code: string) => {
    if (!code) {
      setError("Please enter a promo code");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setSuccess(`Promo code ${code} applied successfully!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return total + price * item.quantity;
  }, 0);

  const shippingCost =
    shippingOption === "standard"
      ? 200
      : shippingOption === "express"
      ? 500
      : 0;
  const giftWrappingCost = giftWrapping ? 150 : 0;
  const vat = (subtotal + shippingCost + giftWrappingCost) * 0.16;
  const total = subtotal + shippingCost + giftWrappingCost + vat;

  const cartContent = (
    <div className={styles.cartContainer}>
      <motion.h2
        className={styles.cartTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaShoppingBag /> Your Cart
      </motion.h2>
      <motion.p
        className={styles.cartSubtitle}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
      </motion.p>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.alertContainer}
        >
          <Alert variant="danger" className={styles.errorAlert}>
            <FaBoxOpen className={styles.alertIcon} /> {error}
          </Alert>
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.alertContainer}
        >
          <Alert variant="success" className={styles.successAlert}>
            <FaCheck className={styles.alertIcon} />

            {success}
          </Alert>
        </motion.div>
      )}
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.emptyCart}
        >
          <FaBoxOpen className={styles.emptyIcon} />
          <p>Your cart is empty</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => addToCart(defaultCartItems[0])}
            className={styles.shopNowButton}
          >
            <FaShoppingBag className={styles.actionIcon} /> Add Sample Item
          </motion.button>
        </motion.div>
      ) : (
        <div className={styles.cartLayout}>
          <motion.div
            className={styles.cartItemsSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.cartItemsScroll}>
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  index={index}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  saveItem={saveItem}
                />
              ))}
            </div>
          </motion.div>
          <motion.div
            className={styles.checkoutOptionsSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PromoCode onApplyPromo={handleApplyPromo} />
            <hr className={styles.divider} />
            <div ref={paymentMethodsRef}>
              <PaymentMethods
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
              />
            </div>
            <hr className={styles.divider} />
            <ShippingOptions
              shippingOption={shippingOption}
              setShippingOption={setShippingOption}
            />
            <hr className={styles.divider} />
            <AdditionalOptions
              giftWrapping={giftWrapping}
              setGiftWrapping={setGiftWrapping}
            />
          </motion.div>
          <motion.div
            className={styles.orderDetailsSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <OrderSummary
              subtotal={subtotal}
              shippingCost={shippingCost}
              giftWrappingCost={giftWrappingCost}
              vat={subtotal * 0.16}
              total={total}
              selectedPayment={selectedPayment}
              handleCheckout={handleCheckout}
            />
            <hr className={styles.divider} />
            <WhyShop />
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          variants={offcanvasVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Offcanvas
            show={show}
            onHide={onHide}
            placement="end"
            className={styles.cartOffcanvas}
          >
            <Offcanvas.Header closeButton className={styles.offcanvasHeader} />
            <Offcanvas.Body className={styles.offcanvasBody}>
              {cartContent}
            </Offcanvas.Body>
          </Offcanvas>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.fullPage}
        >
          {cartContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
