import { useState, useEffect } from "react";
import { Button, Alert, Offcanvas, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaBookmark,
  FaPlus,
  FaMinus,
  FaLock,
  FaGift,
  FaTruck,
  FaStore,
  FaDollarSign,
  FaGem,
  FaUndo,
  FaShoppingBag,
  FaCheck,
  FaCreditCard,
  FaBoxOpen,
  FaTag,
  FaMobileAlt,
  FaUniversity,
  FaPaypal,
} from "react-icons/fa";
import styles from "./Cart.module.css";

interface CartItem {
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
  hover: { scale: 1.02 },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.95, transition: { duration: 0.2, ease: "easeOut" } },
};

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
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product_id: 1,
      name: "Ankara Print Maxi Dress",
      category: "Dresses",
      price: "4500.00",
      original_price: "6000.00",
      quantity: 1,
      size: "M",
      color: "Blue & Gold",
      image: "https://placehold.co/150x150",
      stock_status: "in_stock",
    },
    {
      product_id: 2,
      name: "Kitenge Blazer",
      category: "Blazers",
      price: "3200.00",
      quantity: 2,
      size: "L",
      color: "Red & Black",
      image: "https://placehold.co/150x150",
      stock_status: "in_stock",
    },
    {
      product_id: 3,
      name: "Beaded Statement Necklace",
      category: "Accessories",
      price: "800.00",
      quantity: 1,
      color: "Gold",
      image: "https://placehold.co/150x150",
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
      .then((data: CartItem[]) => {
        const parsedData = data.map((item) => ({
          ...item,
          price: parseFloat(item.price as string).toFixed(2),
          original_price: item.original_price
            ? parseFloat(item.original_price as string).toFixed(2)
            : undefined,
          image: item.image || "https://placehold.co/150x150",
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
    setError("Wishlist functionality not implemented");
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="danger" className={styles.errorAlert}>
            <FaTag className={styles.alertIcon} /> {error}
          </Alert>
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
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
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button href="/products" className={styles.shopNowButton}>
              <FaShoppingBag className={styles.actionIcon} /> Shop Now
            </Button>
          </motion.div>
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
                <motion.div
                  key={item.product_id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={styles.cartItem}
                >
                  <span
                    className={`${styles.itemNumber} ${
                      styles[`numberColor${index % 4}`]
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className={styles.itemImageContainer}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/150x150";
                      }}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <span className={styles.itemName}>
                      {item.original_price && (
                        <span className={styles.saleTag}>
                          <FaTag /> Sale
                        </span>
                      )}
                      {item.name}
                    </span>
                    <span className={styles.separator}>|</span>
                    <span className={styles.itemCategory}>
                      <FaTag /> {item.category}
                    </span>
                    {item.size && (
                      <>
                        <span className={styles.separator}>|</span>
                        <span className={styles.itemOption}>
                          <FaTag /> Size: {item.size}
                        </span>
                      </>
                    )}
                    {item.color && (
                      <>
                        <span className={styles.separator}>|</span>
                        <span className={styles.itemOption}>
                          <FaTag /> Color: {item.color}
                        </span>
                      </>
                    )}
                    <span className={styles.separator}>|</span>
                    <span className={styles.itemPricing}>
                      <span className={styles.itemPrice}>
                        KSh {parseFloat(item.price as string).toFixed(0)}
                      </span>
                      {item.original_price && (
                        <span className={styles.originalPrice}>
                          KSh{" "}
                          {parseFloat(item.original_price as string).toFixed(0)}
                        </span>
                      )}
                    </span>
                    {item.stock_status === "out_of_stock" && (
                      <>
                        <span className={styles.separator}>|</span>
                        <span className={styles.stockStatus}>
                          <FaTag /> Out of stock - will ship when available
                        </span>
                      </>
                    )}
                    <span className={styles.separator}>|</span>
                    <div className={styles.quantityControl}>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity - 1)
                        }
                        className={styles.quantityButton}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className={styles.actionIcon} />
                      </motion.button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity + 1)
                        }
                        className={styles.quantityButton}
                      >
                        <FaPlus className={styles.actionIcon} />
                      </motion.button>
                    </div>
                    <span className={styles.separator}>|</span>
                    <div className={styles.itemActions}>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          onClick={() => removeFromCart(item.product_id)}
                          className={styles.removeButton}
                        >
                          <FaTrash className={styles.actionIcon} /> Remove
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          onClick={() => saveItem(item.product_id)}
                          className={styles.saveButton}
                        >
                          <FaBookmark className={styles.actionIcon} /> Save
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className={styles.checkoutOptionsSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={styles.promoCode}>
              <h4 className={styles.sectionTitle}>
                <FaDollarSign className={styles.sectionIcon} /> Promo Code
              </h4>
              <div className={styles.promoInputGroup}>
                <Form.Control
                  type="text"
                  placeholder="Enter promo code"
                  className={styles.promoInput}
                  disabled
                />
                <Button className={styles.promoButton} disabled>
                  <FaTag /> Apply
                </Button>
              </div>
              <p className={styles.promoHint}>
                Try: WELCOME10, MILLIWIN20, or NEWCUSTOMER
              </p>
            </div>
            <hr className={styles.divider} />
            <div className={styles.paymentMethods}>
              <h4 className={styles.sectionTitle}>
                <FaCreditCard className={styles.sectionIcon} /> Payment Methods
              </h4>
              <div className={styles.paymentOptions}>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`${styles.paymentOption} ${
                    selectedPayment === "credit_card" ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPayment("credit_card")}
                >
                  <FaCreditCard className={styles.optionIcon} /> Credit Card
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`${styles.paymentOption} ${
                    selectedPayment === "mpesa" ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPayment("mpesa")}
                >
                  <FaMobileAlt className={styles.optionIcon} /> M-Pesa
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`${styles.paymentOption} ${
                    selectedPayment === "paypal" ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPayment("paypal")}
                >
                  <FaPaypal className={styles.optionIcon} /> PayPal
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`${styles.paymentOption} ${
                    selectedPayment === "bank_transfer" ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPayment("bank_transfer")}
                >
                  <FaUniversity className={styles.optionIcon} /> Bank Transfer
                </motion.div>
              </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.shippingOptions}>
              <h4 className={styles.sectionTitle}>
                <FaTruck className={styles.sectionIcon} /> Shipping Options
              </h4>
              <Form.Check
                type="radio"
                label={
                  <span>
                    <FaTruck className={styles.optionIcon} /> Standard Delivery
                    <br />
                    <small>
                      Delivery within Nairobi and major towns, 3-5 business days
                    </small>
                  </span>
                }
                name="shipping"
                checked={shippingOption === "standard"}
                onChange={() => setShippingOption("standard")}
                className={styles.shippingOption}
              />
              <div className={styles.shippingCost}>KSh 200</div>
              <Form.Check
                type="radio"
                label={
                  <span>
                    <FaTruck className={styles.optionIcon} /> Express Delivery
                    <br />
                    <small>
                      Fast delivery within Nairobi, 1-2 business days
                    </small>
                  </span>
                }
                name="shipping"
                checked={shippingOption === "express"}
                onChange={() => setShippingOption("express")}
                className={styles.shippingOption}
              />
              <div className={styles.shippingCost}>KSh 500</div>
              <Form.Check
                type="radio"
                label={
                  <span>
                    <FaStore className={styles.optionIcon} /> Store Pickup
                    <br />
                    <small>Collect from our Westlands store, Same day</small>
                  </span>
                }
                name="shipping"
                checked={shippingOption === "pickup"}
                onChange={() => setShippingOption("pickup")}
                className={styles.shippingOption}
              />
              <div className={styles.shippingCost}>Free</div>
            </div>
          </motion.div>
          <motion.div
            className={styles.orderDetailsSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className={styles.orderSummary}>
              <h4 className={styles.sectionTitle}>
                <FaCheck className={styles.sectionIcon} /> Order Summary
              </h4>
              <div className={styles.summaryRow}>
                <span>
                  <FaTag /> Subtotal
                </span>
                <span>KSh {subtotal.toFixed(0)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>
                  <FaTruck /> Shipping
                </span>
                <span>KSh {shippingCost.toFixed(0)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>
                  <FaTag /> VAT (16%)
                </span>
                <span>KSh {vat.toFixed(0)}</span>
              </div>
              {giftWrapping && (
                <div className={styles.summaryRow}>
                  <span>
                    <FaGift /> Gift Wrapping
                  </span>
                  <span>KSh {giftWrappingCost.toFixed(0)}</span>
                </div>
              )}
              <div className={styles.summaryTotal}>
                <span>
                  <FaCreditCard /> Total
                </span>
                <span>KSh {total.toFixed(0)}</span>
              </div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  href="/checkout"
                  className={styles.checkoutButton}
                  disabled={cartItems.length === 0 || !selectedPayment}
                >
                  <FaLock className={styles.actionIcon} /> Proceed to Checkout
                </Button>
              </motion.div>
              <p className={styles.secureCheckout}>
                <FaLock className={styles.actionIcon} /> Secure checkout with
                SSL encryption
              </p>
            </div>
            <hr className={styles.divider} />
            <div className={styles.additionalOptions}>
              <h4 className={styles.sectionTitle}>
                <FaGift className={styles.sectionIcon} /> Additional Options
              </h4>
              <Form.Check
                type="checkbox"
                label={
                  <span>
                    <FaGift className={styles.optionIcon} /> Add gift wrapping
                    (+KSh 150)
                  </span>
                }
                checked={giftWrapping}
                onChange={() => setGiftWrapping(!giftWrapping)}
                className={styles.giftWrapping}
              />
            </div>
            <hr className={styles.divider} />
            <div className={styles.whyShop}>
              <h4 className={styles.sectionTitle}>
                <FaGem className={styles.sectionIcon} /> Why shop with Milliwin
                Boutique?
              </h4>
              <ul className={styles.whyShopList}>
                <li>
                  <FaGem className={styles.whyShopIcon} /> Authentic African
                  designs
                </li>
                <li>
                  <FaTruck className={styles.whyShopIcon} /> Free delivery on
                  orders over KSh 5,000
                </li>
                <li>
                  <FaUndo className={styles.whyShopIcon} /> 30-day return policy
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {show && (
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
      )}
      {!show && (
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
