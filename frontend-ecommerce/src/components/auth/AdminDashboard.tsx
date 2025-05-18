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

export default function AdminDashboard() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState({
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

    const fetchBanners = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/banners", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }
        const data: Banner[] = await response.json();
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    };

    fetchBanners();
  }, [navigate]);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/admin/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBanner),
      });
      if (!response.ok) {
        throw new Error("Failed to create banner");
      }
      setNewBanner({
        title: "",
        description: "",
        image_url: "",
        cta_text: "",
        cta_url: "",
        is_active: true,
      });
      const fetchResponse = await fetch("http://localhost:5000/admin/banners", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        `http://localhost:5000/admin/banners/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBanner),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update banner");
      }
      const fetchResponse = await fetch("http://localhost:5000/admin/banners", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        `http://localhost:5000/admin/banners/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }
      setBanners(banners.filter((banner) => banner.id !== id));
    } catch (err) {
      console.error("Error deleting banner:", err);
      setError("Failed to delete banner");
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}
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
    </div>
  );
}
