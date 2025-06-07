import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import FeaturedCategories from "../../components/FeaturedCategory/FeaturedCategories/FeaturedCategories";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import FloatingButtons from "../../components/FloatingButtons/Bottom/BottomFloatingButton";
import CustomerCare from "../../components/FloatingButtons/CustomerCare/CustomerCare";
import ReachToUs from "../../components/ReachToUs/ReachToUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <FeaturedCategories />
      <div className={styles.componentFlex}>
        <Testimonials />
        <ReachToUs />
      </div>
      <CustomerCare />
      <FloatingButtons />
    </div>
  );
}
