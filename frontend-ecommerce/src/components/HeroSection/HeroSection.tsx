import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./HeroSection.module.css";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
}

interface Accessory {
  id: number;
  name: string;
  price: string | number; // Allow string or number from database
  image: string;
}

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersResponse = await fetch(
          "http://localhost:5000/api/admin/banners"
        );
        if (!bannersResponse.ok)
          throw new Error(`Failed to fetch banners: ${bannersResponse.status}`);
        const bannersData: Banner[] = await bannersResponse.json();
        setBanners(
          bannersData.map((banner) => ({
            ...banner,
            image_url: banner.image_url || "https://placehold.co/1200x400", // Fallback image
          }))
        );

        // Fetch promotions
        const promotionsResponse = await fetch(
          "http://localhost:5000/api/admin/promotions"
        );
        if (!promotionsResponse.ok)
          throw new Error(
            `Failed to fetch promotions: ${promotionsResponse.status}`
          );
        const promotionsData: Promotion[] = await promotionsResponse.json();
        setPromotions(
          promotionsData.map((promo) => ({
            ...promo,
            image_url: promo.image_url || "https://placehold.co/600x400", // Fallback image
          }))
        );

        // Fetch accessories
        const accessoriesResponse = await fetch(
          "http://localhost:5000/api/admin/accessories"
        );
        if (!accessoriesResponse.ok)
          throw new Error(
            `Failed to fetch accessories: ${accessoriesResponse.status}`
          );
        const accessoriesData: Accessory[] = await accessoriesResponse.json();
        setAccessories(
          accessoriesData.map((accessory) => ({
            ...accessory,
            image: accessory.image || "https://placehold.co/150x150", // Fallback image
            price:
              typeof accessory.price === "string"
                ? parseFloat(accessory.price)
                : accessory.price, // Convert price to number
          }))
        );
      } catch (err) {
        console.error("Error fetching hero data:", err);
        setError("Failed to load hero section. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    accessibility: true,
  };

  return (
    <section className={styles.hero}>
      {error && <div className={styles.error}>{error}</div>}

      {/* Banner Carousel */}
      <div className={styles.bannerCarousel}>
        <Slider {...sliderSettings}>
          {banners.map((banner) => (
            <div key={banner.id} className={styles.bannerSlide}>
              <img
                src={banner.image_url}
                alt={banner.title}
                className={styles.bannerImage}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/1200x400"; // Fallback on error
                }}
              />
              <div className={styles.bannerContent}>
                <h2 className={styles.bannerTitle}>{banner.title}</h2>
                <p className={styles.bannerDescription}>{banner.description}</p>
                {banner.cta_text && banner.cta_url && (
                  <Button
                    href={banner.cta_url}
                    className={styles.bannerCta}
                    style={{
                      backgroundColor: "#FF1493",
                      borderColor: "#FF1493",
                    }} // Fuchsia Pink
                    aria-label={`Go to ${banner.cta_text}`}
                  >
                    {banner.cta_text}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Promo Cards */}
      <div className={styles.promoContainer}>
        {promotions.slice(0, 2).map((promo) => (
          <div key={promo.id} className={styles.promoCard}>
            <img
              src={promo.image_url}
              alt={promo.title}
              className={styles.promoImage}
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400"; // Fallback on error
              }}
            />
            <div className={styles.promoContent}>
              <h3 className={styles.promoTitle}>{promo.title}</h3>
              <p className={styles.promoDescription}>{promo.description}</p>
              {promo.cta_text && promo.cta_url && (
                <Button
                  href={promo.cta_url}
                  className={styles.promoCta}
                  style={{ backgroundColor: "#9400D3", borderColor: "#9400D3" }} // Purple
                  aria-label={`Go to ${promo.cta_text}`}
                >
                  {promo.cta_text}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Accessories Panel */}
      <div className={styles.accessoriesContainer}>
        <h3 className={styles.accessoriesTitle} style={{ color: "#A1DC17" }}>
          Quick Accessories
        </h3>
        <div className={styles.accessoriesList}>
          {accessories.map((accessory) => (
            <div key={accessory.id} className={styles.accessoryItem}>
              <img
                src={accessory.image}
                alt={accessory.name}
                className={styles.accessoryImage}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/150x150"; // Fallback on error
                }}
              />
              <div className={styles.accessoryOverlay}>
                <p className={styles.accessoryName}>{accessory.name}</p>
                <p className={styles.accessoryPrice}>
                  $
                  {(typeof accessory.price === "string"
                    ? parseFloat(accessory.price)
                    : accessory.price
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
