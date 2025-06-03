import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaChevronRight } from "react-icons/fa";
import HeaderSection from "./HeaderSection/HeaderSection";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import SortDropdown from "./SortDropdown/SortDropdown";
import ProductGrid from "./ProductGrid/ProductGrid";
import Pagination from "./Pagination/Pagination";
import RelatedProducts from "./RelatedProducts/RelatedProducts";
import FooterSection from "./FooterSection/FooterSection";
import {
  staticCategories,
  categoryDescriptions,
} from "../../static/categories";
import {
  FilterOptions,
  SortOption,
  CategoryMetadata,
} from "../../types/ViewMore";
import styles from "./ViewMorePage.module.css";
import MensJacket from "../../assets/mensjacket.jpg";
import WomensSummerDress from "../../assets/Women'sSummerDress.jpg";
import kidstshirt from "../../assets/kidstshirt.jpg";
import runningshoes from "../../assets/runningshoes.jpg";
import cottonDuvet from "../../assets/cottonduvet.jpg";
import MenSuitPic from "../../assets/Men's blue suitjpg.jpg";
import WomenDressPic from "../../assets/lady red suit.jpg";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  original_price?: number | null;
  discount_percentage?: number | null;
  is_new?: boolean;
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  brand?: string;
}

interface StaticCategory {
  id: string;
  name: string;
  products: Product[];
}

const ViewMorePage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  const normalizeCategory = (cat: string | undefined): string => {
    if (!cat) return "Men's";
    const lowerCat = cat.toLowerCase().replace(/['-]/g, ""); // Handle both apostrophes and hyphens
    const mappings: { [key: string]: string } = {
      newarrivals: "New Arrivals",
      featuredproducts: "Featured Products",
      childrens: "Children's",
      mens: "Men's",
      womens: "Women's",
      shoes: "Shoes",
      beddings: "Beddings",
    };
    return mappings[lowerCat] || "Men's";
  };

  const getCategoryBanner = (cat: string | undefined): string => {
    const lowerCat = cat?.toLowerCase().replace(/['-]/g, ""); // Handle both apostrophes and hyphens
    switch (lowerCat) {
      case "mens":
        return MenSuitPic;
      case "womens":
        return WomensSummerDress;
      case "childrens":
        return kidstshirt;
      case "shoes":
        return runningshoes;
      case "beddings":
        return cottonDuvet;
      case "newarrivals":
        return MensJacket;
      case "featuredproducts":
        return WomenDressPic;
      default:
        return "https://placehold.co/1200x400";
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [metadata, setMetadata] = useState<CategoryMetadata>({
    name: normalizeCategory(category),
    description:
      categoryDescriptions[category?.toLowerCase() || ""] ||
      "Explore our collection.",
    heroImage: getCategoryBanner(category),
    subcategories: [],
  });
  const [filters, setFilters] = useState<FilterOptions>({
    sizes: [],
    colors: [],
    materials: [],
    styles: [],
    brands: [],
    priceRange: [0, 200],
    inStock: false,
  });
  const [sort, setSort] = useState<SortOption>({
    label: "Newest First",
    value: "newest",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(3);
  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);

  useEffect(() => {
    const updateLimit = () => {
      setLimit(window.innerWidth <= 768 ? 2 : 3);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const filteredStaticProducts = useMemo(() => {
    const effectiveCategory =
      category?.toLowerCase().replace(/['-]/g, "") === "newarrivals"
        ? "New Arrivals"
        : category?.toLowerCase().replace(/['-]/g, "") === "featuredproducts"
        ? "Featured Products"
        : normalizeCategory(category);
    const staticData =
      staticCategories.find((c: StaticCategory) => c.name === effectiveCategory)
        ?.products || [];
    return staticData
      .filter(
        (p: Product) =>
          (!filters.sizes.length || filters.sizes.includes(p.size || "")) &&
          (!filters.colors.length || filters.colors.includes(p.color || "")) &&
          (!filters.materials.length ||
            filters.materials.includes(p.material || "")) &&
          (!filters.styles.length || filters.styles.includes(p.style || "")) &&
          (!filters.brands.length || filters.brands.includes(p.brand || "")) &&
          p.price >= filters.priceRange[0] &&
          p.price <= filters.priceRange[1] &&
          (!filters.inStock || p.stock > 0)
      )
      .sort((a: Product, b: Product) => {
        if (sort.value === "price-asc") return a.price - b.price;
        if (sort.value === "price-desc") return b.price - b.price;
        if (sort.value === "newest")
          return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
        return 0;
      });
  }, [category, filters, sort]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchCategoryMetadata = async (
          category: string
        ): Promise<CategoryMetadata> => {
          try {
            const res = await fetch(
              `http://localhost:5000/api/categories/${category}`
            );
            if (!res.ok)
              throw new Error(`Failed to fetch metadata: ${res.status}`);
            const data = await res.json();
            return {
              name: data.name || normalizeCategory(category),
              description:
                data.description ||
                categoryDescriptions[category.toLowerCase()] ||
                "Explore our collection.",
              heroImage: data.heroImage || getCategoryBanner(category),
              subcategories: data.subcategories || [],
            };
          } catch (err) {
            console.error("Metadata error:", err);
            return {
              name: normalizeCategory(category),
              description:
                categoryDescriptions[category.toLowerCase()] ||
                "Explore our collection.",
              heroImage: getCategoryBanner(category),
              subcategories: [],
            };
          }
        };

        const metadataRes = await fetchCategoryMetadata(category || "mens");
        if (isMounted) setMetadata(metadataRes);

        const fetchProducts = async (
          query: string
        ): Promise<{ products: Product[]; total: number }> => {
          try {
            const apiUrl =
              category?.toLowerCase().replace(/['-]/g, "") === "newarrivals"
                ? `http://localhost:5000/api/products?new=true&${query}`
                : category?.toLowerCase().replace(/['-]/g, "") ===
                  "featuredproducts"
                ? `http://localhost:5000/api/products?featured=true&${query}`
                : `http://localhost:5000/api/products?${query}`;
            const res = await fetch(apiUrl);
            if (!res.ok)
              throw new Error(`Failed to fetch products: ${res.status}`);
            const data: Product[] = await res.json();
            return {
              products: data.map((p: Product) => ({
                ...p,
                image:
                  typeof p.image === "string"
                    ? p.image
                    : filteredStaticProducts[0]?.image ||
                      "https://placehold.co/300x300",
                price: parseFloat(p.price.toString()),
                stock: Number(p.stock),
                original_price: p.original_price
                  ? parseFloat(p.original_price.toString())
                  : null,
                discount_percentage: p.discount_percentage
                  ? Number(p.discount_percentage)
                  : null,
              })),
              total: data.length,
            };
          } catch (err) {
            console.error("API error:", err);
            return {
              products: filteredStaticProducts,
              total: filteredStaticProducts.length,
            };
          }
        };

        const query = new URLSearchParams({
          category:
            category?.toLowerCase().replace(/['-]/g, "") === "newarrivals" ||
            category?.toLowerCase().replace(/['-]/g, "") === "featuredproducts"
              ? ""
              : category?.toLowerCase() || "",
          size: filters.sizes.join(","),
          color: filters.colors.join(","),
          material: filters.materials.join(","),
          style: filters.styles.join(","),
          brand: filters.brands.join(","),
          minPrice: filters.priceRange[0].toString(),
          maxPrice: filters.priceRange[1].toString(),
          inStock: filters.inStock ? "true" : "false",
          sort: sort.value,
          page: page.toString(),
          limit: limit.toString(),
        }).toString();

        const fetchedProducts = await fetchProducts(query);
        if (isMounted) {
          setProducts(fetchedProducts.products.slice(0, limit));
          setTotalPages(Math.ceil(fetchedProducts.total / limit));
          setError(null);
          setIsServerOnline(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (isMounted) {
          setError("Failed to load products. Showing static content.");
          setProducts(
            filteredStaticProducts.slice((page - 1) * limit, page * limit)
          );
          setTotalPages(Math.ceil(filteredStaticProducts.length / limit));
          setIsServerOnline(false);
        }
      } finally {
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 125);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [category, filters, sort, page, limit, filteredStaticProducts]);

  const productIds = products.map((p) => p.id);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
          <FaHome className={styles.breadcrumbIcon} /> Home
        </Link>
        <FaChevronRight className={styles.breadcrumbSeparator} />
        <span className={styles.breadcrumbCurrent}>{metadata.name}</span>
      </nav>
      <HeaderSection metadata={metadata} />
      {error && !isServerOnline && <div className={styles.error}>{error}</div>}
      <div className={styles.mainContent}>
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          category={category || ""}
        />
        <div className={styles.gridContainer}>
          <SortDropdown sort={sort} setSort={setSort} />
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>No products found.</div>
          ) : (
            <ProductGrid products={products} />
          )}
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>
      <RelatedProducts category={category || ""} excludeIds={productIds} />
      <FooterSection category={category || ""} />
    </motion.div>
  );
};

export default ViewMorePage;
