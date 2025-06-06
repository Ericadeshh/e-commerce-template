import { useState, useEffect } from "react";
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

const Cart: React.FC<CartProps> = ({ show, onHide }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([
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
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shippingOption, setShippingOption] = useState<
    "standard" | "express" | "pickup"
  >("standard");
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    "credit_card" | "mpesa" | "paypal" | "bank_transfer" | null
  >(null);
  const userId = 1;

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/cart?user_id=${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Failed to load cart: ${res.status} - ${
              errorData.error || "Unknown error"
            }`
          );
        }
        return res.json();
      })
      .then((data: CartItemType[]) => {
        const parsedData = data.map((item) => ({
          ...item,
          price: parseFloat(item.price as string).toFixed(2),
          original_price: item.original_price
            ? parseFloat(item.original_price as string).toFixed(2)
            : undefined,
          image: item.image || MensJacket,
        }));
        setCartItems(parsedData);
      })
      .catch((err: Error) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    fetch("http://localhost:5000/api/products/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId, quantity: newQuantity }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Failed to update quantity: ${res.status} - ${
              errorData.error || "Unknown error"
            }`
          );
        }
        setCartItems(
          cartItems.map((item) =>
            item.product_id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        setSuccess("Quantity updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch((err: Error) => {
        console.error("Update quantity error:", err);
        setError(err.message);
      });
  };

  const removeFromCart = (productId: number) => {
    fetch("http://localhost:5000/api/products/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Failed to remove from cart: ${res.status} - ${
              errorData.error || "Unknown error"
            }`
          );
        }
        setCartItems(cartItems.filter((item) => item.product_id !== productId));
        setSuccess("Item removed successfully!");
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch((err: Error) => {
        console.error("Remove from cart error:", err);
        setError(err.message);
      });
  };

  const saveItem = (productId: number) => {
    console.log(`Saving item ${productId} to wishlist`);
    setSuccess("Item saved to wishlist!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCheckout = () => {
    if (!selectedPayment) {
      setError("Please select a payment method before proceeding to checkout.");
      return;
    }
    console.log("Proceeding to checkout with payment method:", selectedPayment);
    setSuccess("Checkout initiated successfully!");
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
            <FaCheck className={styles.alertIcon} /> {success}
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
          <motion.a href="/products" className={styles.shopNowButton}>
            <FaShoppingBag className={styles.actionIcon} /> Shop Now
          </motion.a>
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
            <PromoCode />
            <hr className={styles.divider} />
            <PaymentMethods
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
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
              vat={vat}
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
