import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import FeaturedCategories from "../../components/FeaturedCategory/FeaturedCategories/FeaturedCategories";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Featured Categories */}
      <FeaturedCategories />
    </div>
  );
}
