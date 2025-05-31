import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import FeaturedCategories from "../../components/FeaturedCategory/FeaturedCategories/FeaturedCategories";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import FloatingButtons from "../../components/FloatingButtons/BottomFloatingButton";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <FeaturedCategories />
      <FloatingButtons />
    </div>
  );
}
