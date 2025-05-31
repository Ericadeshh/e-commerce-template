import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import FeaturedCategories from "../../components/FeaturedCategory/FeaturedCategories/FeaturedCategories";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import FloatingButtons from "../../components/FloatingButtons/Bottom/BottomFloatingButton";
import ScrollToTopButton from "../../components/FloatingButtons/ScrollToTop/ScrollToTop";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <FeaturedCategories />
      <FloatingButtons />
      <ScrollToTopButton />
    </div>
  );
}
