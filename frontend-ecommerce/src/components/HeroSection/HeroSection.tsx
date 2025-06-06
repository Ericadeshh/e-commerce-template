import { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import HeroHeader from "./HeroHeader/HeroHeader";
import QuickLinks from "./QuickLinks/QuickLinks";
import BannerCarousel from "./BannerCarousel/BannerCarousel";
import PromoPanel from "./PromoPanel/PromoPanel";
import styles from "./HeroSection.module.css";
import MenSuitPic from "../../assets/Men's blue suitjpg.jpg";
import WomenDressPic from "../../assets/lady red suit.jpg";
import kidPantsPic from "../../assets/kids pants.jpg";
import kidMatchPic from "../../assets/kids matching cloth.jpg";
import MenOmbrePic from "../../assets/Men Ombre Japanese.jpg";
import BeachShirtPic from "../../assets/beach shirt.jpg";
import BeddingPic from "../../assets/nice blankets.jpg";

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
  is_active: boolean;
  discount_percentage?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  price_range?: string;
  tag?: string;
  timer?: string;
  stock?: string;
}

export default function HeroSection() {
  const defaultBanners: Banner[] = [
    {
      id: 1,
      title: "Discover Men's Fashion",
      description: "Elevate your style with our premium suits!",
      image_url: MenSuitPic,
      cta_text: "Shop Men's",
      cta_url: "/products/mens", // Updated to match ViewMorePage.tsx route
    },
    {
      id: 2,
      title: "Summer Collection",
      description: "Vibrant styles for women!",
      image_url: BeachShirtPic,
      cta_text: "Discover Women's",
      cta_url: "/products/womens", // Updated to match ViewMorePage.tsx route
    },
    {
      id: 3,
      title: "Kids' Matching Sets",
      description: "Adorable outfits for your little ones!",
      image_url: kidMatchPic,
      cta_text: "Shop by Category",
      cta_url: "/products/childrens", // Updated to match ViewMorePage.tsx route
    },
    {
      id: 4,
      title: "Welcome to Milliwin Boutique",
      description: "Explore the latest trends in fashion!",
      image_url: MenOmbrePic,
      cta_text: "Shop Now",
      cta_url: "/products",
    },
  ];

  const defaultPromotions: Promotion[] = [
    {
      id: 1,
      title: "Free Shipping",
      description: "On orders over $50",
      image_url: WomenDressPic,
      cta_text: "Shop Now",
      cta_url: "/products",
      is_active: true,
      discount_percentage: null,
      start_date: null,
      end_date: null,
      price_range: "$50+",
      tag: "LIMITED TIME",
      timer: "Ends in 3 days",
    },
    {
      id: 2,
      title: "Beddings Sale",
      description: "20% off all beddings",
      image_url: BeddingPic,
      cta_text: "Shop Sale",
      cta_url: "/products/beddings",
      is_active: true,
      discount_percentage: 20,
      start_date: null,
      end_date: null,
      price_range: "From $29.99",
      tag: "20% OFF",
      stock: "Only 50 left!",
    },
    {
      id: 3,
      title: "Kids' Clothing Sale",
      description: "15% off children's pants and sets",
      image_url: kidPantsPic,
      cta_text: "Shop Kids Sale",
      cta_url: "/products/childrens",
      is_active: true,
      discount_percentage: 15,
      start_date: null,
      end_date: null,
    },
  ];

  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [promotions, setPromotions] = useState<Promotion[]>(defaultPromotions);
  const [serverStatus, setServerStatus] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = fetch("http://localhost:5000/api/admin/banners")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch banners: ${res.status}`);
        return res.json();
      })
      .then((data: Banner[]) => {
        setBanners(data);
        setServerStatus(true);
      })
      .catch((err) => {
        console.error("Error fetching banners:", err);
        setServerStatus(false);
      });

    const fetchPromotions = fetch("http://localhost:5000/api/admin/promotions")
      .then(async (res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch promotions: ${res.status}`);
        return res.json();
      })
      .then((data: Promotion[]) => {
        setPromotions(data.slice(0, 3));
        setServerStatus(true);
      })
      .catch((err) => {
        console.error("Error fetching promotions:", err);
        setServerStatus(false);
      });

    Promise.all([fetchBanners, fetchPromotions]).catch(() => {
      setServerStatus(false);
    });
  }, []);

  const quickLinks = [
    {
      title: "Men's",
      items: [
        { name: "Jackets", url: "/products/mens#mens-jacket" },
        { name: "Sneakers", url: "/products/mens#mens-sneakers" },
        { name: "Shirts", url: "/products/mens#mens-shirt" },
      ],
    },
    {
      title: "Women's",
      items: [
        { name: "Dresses", url: "/products/womens#summer-dress" },
        { name: "Heels", url: "/products/womens#womens-heels" },
        { name: "Bags", url: "/products/womens#womens-bag" },
      ],
    },
    {
      title: "Children's",
      items: [
        { name: "T-Shirts", url: "/products/childrens#kids-t-shirt" },
        { name: "Sneakers", url: "/products/childrens#kids-sneakers" },
        { name: "Backpacks", url: "/products/childrens#kids-backpack" },
      ],
    },
    {
      title: "Shoes",
      items: [
        { name: "Running Shoes", url: "/products/shoes#running-shoes" },
        { name: "Casual Sneakers", url: "/products/shoes#casual-sneakers" },
        { name: "Boots", url: "/products/shoes#boots" },
      ],
    },
    {
      title: "Beddings",
      items: [
        { name: "Duvets", url: "/products/beddings#cotton-duvet" },
        { name: "Pillows", url: "/products/beddings#pillow-set" },
        { name: "Blankets", url: "/products/beddings#blanket" },
      ],
    },
    {
      title: "New Arrivals",
      items: [
        { name: "Men's Sneakers", url: "/products/newarrivals#mens-sneakers" },
        { name: "Women's Blouse", url: "/products/newarrivals#womens-blouse" },
        { name: "Kids Shorts", url: "/products/newarrivals#kids-shorts" },
      ],
    },
    {
      title: "Featured Products",
      items: [
        { name: "Men's Jacket", url: "/products/featuredproducts#mens-jacket" },
        { name: "Women's Bag", url: "/products/featuredproducts#womens-bag" },
        {
          name: "Running Shoes",
          url: "/products/featuredproducts#running-shoes",
        },
      ],
    },
  ];

  const handleLinkClick = (name: string) => {
    setActiveLink(name);
  };

  return (
    <div className={styles.hero}>
      <HeroHeader serverStatus={serverStatus} />
      <Row className={`${styles.desktopLayout} d-none d-md-flex`}>
        <QuickLinks
          quickLinks={quickLinks}
          activeLink={activeLink}
          handleLinkClick={handleLinkClick}
        />
        <BannerCarousel banners={banners} />
        <PromoPanel promotions={promotions} />
      </Row>
      <div className={`${styles.mobileLayout} d-md-none`}>
        <BannerCarousel banners={banners} />
        <QuickLinks
          quickLinks={quickLinks}
          activeLink={activeLink}
          handleLinkClick={handleLinkClick}
        />
        <PromoPanel promotions={promotions} />
      </div>
    </div>
  );
}
