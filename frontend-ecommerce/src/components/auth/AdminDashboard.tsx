import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  is_active: boolean;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  is_accessory: boolean;
}

export default function AdminDashboard() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    image_url: "",
    cta_text: "",
    cta_url: "",
    is_active: true,
  });
  const [newPromotion, setNewPromotion] = useState({
    title: "",
    description: "",
    image_url: "",
    cta_text: "",
    cta_url: "",
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersResponse = await fetch(
          "http://localhost:5000/api/admin/banners",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!bannersResponse.ok) throw new Error("Failed to fetch banners");
        const bannersData: Banner[] = await bannersResponse.json();
        setBanners(bannersData);

        // Fetch promotions
        const promotionsResponse = await fetch(
          "http://localhost:5000/api/admin/promotions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!promotionsResponse.ok)
          throw new Error("Failed to fetch promotions");
        const promotionsData: Promotion[] = await promotionsResponse.json();
        setPromotions(promotionsData);

        // Fetch products for accessories
        const productsResponse = await fetch(
          "http://localhost:5000/api/products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        const productsData: Product[] = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        // Avoid clearing token/role unless explicitly unauthorized
        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/admin/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBanner),
      });
      if (!response.ok) throw new Error("Failed to create banner");
      setNewBanner({
        title: "",
        description: "",
        image_url: "",
        cta_text: "",
        cta_url: "",
        is_active: true,
      });
      const fetchResponse = await fetch(
        "http://localhost:5000/api/admin/banners",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data: Banner[] = await fetchResponse.json();
      setBanners(data);
    } catch (err) {
      console.error("Error creating banner:", err);
      setError("Failed to create banner");
    }
  };

  const handleUpdateBanner = async (
    id: number,
    updatedBanner: Partial<Banner>
  ) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/banners/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBanner),
        }
      );
      if (!response.ok) throw new Error("Failed to update banner");
      const fetchResponse = await fetch(
        "http://localhost:5000/api/admin/banners",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data: Banner[] = await fetchResponse.json();
      setBanners(data);
    } catch (err) {
      console.error("Error updating banner:", err);
      setError("Failed to update banner");
    }
  };

  const handleDeleteBanner = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/banners/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to delete banner");
      setBanners(banners.filter((banner) => banner.id !== id));
    } catch (err) {
      console.error("Error deleting banner:", err);
      setError("Failed to delete banner");
    }
  };

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/promotions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPromotion),
        }
      );
      if (!response.ok) throw new Error("Failed to create promotion");
      setNewPromotion({
        title: "",
        description: "",
        image_url: "",
        cta_text: "",
        cta_url: "",
        is_active: true,
      });
      const fetchResponse = await fetch(
        "http://localhost:5000/api/admin/promotions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data: Promotion[] = await fetchResponse.json();
      setPromotions(data);
    } catch (err) {
      console.error("Error creating promotion:", err);
      setError("Failed to create promotion");
    }
  };

  const handleUpdatePromotion = async (
    id: number,
    updatedPromotion: Partial<Promotion>
  ) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/promotions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPromotion),
        }
      );
      if (!response.ok) throw new Error("Failed to update promotion");
      const fetchResponse = await fetch(
        "http://localhost:5000/api/admin/promotions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data: Promotion[] = await fetchResponse.json();
      setPromotions(data);
    } catch (err) {
      console.error("Error updating promotion:", err);
      setError("Failed to update promotion");
    }
  };

  const handleDeletePromotion = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/promotions/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to delete promotion");
      setPromotions(promotions.filter((promo) => promo.id !== id));
    } catch (err) {
      console.error("Error deleting promotion:", err);
      setError("Failed to delete promotion");
    }
  };

  const handleToggleAccessory = async (id: number, is_accessory: boolean) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/products/${id}/accessory`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_accessory }),
        }
      );
      if (!response.ok) throw new Error("Failed to update accessory status");
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, is_accessory } : product
        )
      );
    } catch (err) {
      console.error("Error updating accessory status:", err);
      setError("Failed to update accessory status");
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}

      {/* Banners Management */}
      <h2>Manage Banners</h2>
      <form onSubmit={handleCreateBanner} className={styles.bannerForm}>
        <input
          type="text"
          placeholder="Title"
          value={newBanner.title}
          onChange={(e) =>
            setNewBanner({ ...newBanner, title: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Description"
          value={newBanner.description}
          onChange={(e) =>
            setNewBanner({ ...newBanner, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newBanner.image_url}
          onChange={(e) =>
            setNewBanner({ ...newBanner, image_url: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="CTA Text"
          value={newBanner.cta_text}
          onChange={(e) =>
            setNewBanner({ ...newBanner, cta_text: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="CTA URL"
          value={newBanner.cta_url}
          onChange={(e) =>
            setNewBanner({ ...newBanner, cta_url: e.target.value })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={newBanner.is_active}
            onChange={(e) =>
              setNewBanner({ ...newBanner, is_active: e.target.checked })
            }
          />
          Active
        </label>
        <button type="submit">Create Banner</button>
      </form>
      <h3>Existing Banners</h3>
      <ul className={styles.bannerList}>
        {banners.map((banner) => (
          <li key={banner.id} className={styles.bannerItem}>
            <p>
              <strong>{banner.title}</strong> (
              {banner.is_active ? "Active" : "Inactive"})
            </p>
            <p>{banner.description}</p>
            <p>Image: {banner.image_url}</p>
            <p>
              CTA: {banner.cta_text} ({banner.cta_url})
            </p>
            <button
              onClick={() =>
                handleUpdateBanner(banner.id, {
                  ...banner,
                  is_active: !banner.is_active,
                })
              }
            >
              Toggle Active
            </button>
            <button onClick={() => handleDeleteBanner(banner.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Promotions Management */}
      <h2>Manage Promotions</h2>
      <form onSubmit={handleCreatePromotion} className={styles.bannerForm}>
        <input
          type="text"
          placeholder="Title"
          value={newPromotion.title}
          onChange={(e) =>
            setNewPromotion({ ...newPromotion, title: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Description"
          value={newPromotion.description}
          onChange={(e) =>
            setNewPromotion({ ...newPromotion, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newPromotion.image_url}
          onChange={(e) =>
            setNewPromotion({ ...newPromotion, image_url: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="CTA Text"
          value={newPromotion.cta_text}
          onChange={(e) =>
            setNewPromotion({ ...newPromotion, cta_text: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="CTA URL"
          value={newPromotion.cta_url}
          onChange={(e) =>
            setNewPromotion({ ...newPromotion, cta_url: e.target.value })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={newPromotion.is_active}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, is_active: e.target.checked })
            }
          />
          Active
        </label>
        <button type="submit">Create Promotion</button>
      </form>
      <h3>Existing Promotions</h3>
      <ul className={styles.bannerList}>
        {promotions.map((promo) => (
          <li key={promo.id} className={styles.bannerItem}>
            <p>
              <strong>{promo.title}</strong> (
              {promo.is_active ? "Active" : "Inactive"})
            </p>
            <p>{promo.description}</p>
            <p>Image: {promo.image_url}</p>
            <p>
              CTA: {promo.cta_text} ({promo.cta_url})
            </p>
            <button
              onClick={() =>
                handleUpdatePromotion(promo.id, {
                  ...promo,
                  is_active: !promo.is_active,
                })
              }
            >
              Toggle Active
            </button>
            <button onClick={() => handleDeletePromotion(promo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Accessories Management */}
      <h2>Manage Accessories</h2>
      <h3>Products</h3>
      <ul className={styles.bannerList}>
        {products.map((product) => (
          <li key={product.id} className={styles.bannerItem}>
            <p>
              <strong>{product.name}</strong> (
              {product.is_accessory ? "Accessory" : "Not Accessory"})
            </p>
            <button
              onClick={() =>
                handleToggleAccessory(product.id, !product.is_accessory)
              }
            >
              Toggle Accessory
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
