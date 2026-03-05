import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

// --- Correos con permisos de administrador ---
const ADMIN_EMAILS = ["fredy.reynosooo36@gmail.com"];

export default function Store() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const navigate = useNavigate();

  // Verifica si el usuario actual es admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Eliminar este producto?")) return;
    await deleteDoc(doc(db, "products", id));
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const docRef = await addDoc(collection(db, "products"), {
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description,
      category: newProduct.category,
      createdAt: serverTimestamp(),
    });
    setProducts([
      ...products,
      { id: docRef.id, ...newProduct, price: Number(newProduct.price) },
    ]);
    setNewProduct({ name: "", price: "", description: "", category: "" });
    setShowForm(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={styles.bg}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.navDot} />
          <span style={styles.navBrand}>ShopApp</span>
        </div>
        <div style={styles.navActions}>
          {user ? (
            <>
              <span style={styles.userBadge}>
                {user.email}
                {isAdmin && <span style={styles.adminTag}>Admin</span>}
              </span>
              {isAdmin && (
                <button onClick={() => setShowForm(!showForm)} style={styles.btnAdd}>
                  {showForm ? "Cancelar" : "+ Producto"}
                </button>
              )}
              <button onClick={handleLogout} style={styles.btnLogout}>
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.btnLogin}>
              Iniciar sesion
            </Link>
          )}
        </div>
      </nav>

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <p style={styles.headerLabel}>Catalogo</p>
            <h1 style={styles.headerTitle}>Productos</h1>
          </div>
          {!user && (
            <div style={styles.alertBox}>
              Inicia sesion para gestionar el inventario
            </div>
          )}
          {user && !isAdmin && (
            <div style={styles.infoBox}>
              Sesion activa — solo lectura
            </div>
          )}
          {isAdmin && (
            <div style={styles.successBox}>
              Sesion de administrador activa
            </div>
          )}
        </div>

        {/* FORM AGREGAR — solo admin */}
        {showForm && isAdmin && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Nuevo producto</h3>
            <form onSubmit={handleAddProduct} style={styles.addForm}>
              <div style={styles.formRow}>
                <div style={styles.formField}>
                  <label style={styles.formLabel}>Nombre</label>
                  <input
                    placeholder="Ej: Camiseta"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                    style={styles.addInput}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.formLabel}>Precio (MXN)</label>
                  <input
                    placeholder="299"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    style={styles.addInput}
                  />
                </div>
                <div style={styles.formField}>
                  <label style={styles.formLabel}>Categoria</label>
                  <input
                    placeholder="Ropa, Calzado..."
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={styles.addInput}
                  />
                </div>
              </div>
              <div style={styles.formField}>
                <label style={styles.formLabel}>Descripcion</label>
                <input
                  placeholder="Descripcion del producto"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ ...styles.addInput, width: "100%" }}
                />
              </div>
              <button type="submit" style={styles.btnSave}>
                Guardar producto
              </button>
            </form>
          </div>
        )}

        {/* PRODUCTOS */}
        {loading ? (
          <div style={styles.emptyState}>
            <div style={styles.spinner} />
            <p style={styles.emptyMsg}>Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>—</div>
            <p style={styles.emptyMsg}>No hay productos registrados.</p>
            {isAdmin && (
              <button onClick={() => setShowForm(true)} style={styles.btnAdd}>
                + Agregar primer producto
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((product, i) => (
              <div key={product.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.cardNum}>{String(i + 1).padStart(2, "0")}</div>
                  {product.category && (
                    <span style={styles.cardTag}>{product.category}</span>
                  )}
                </div>
                <h3 style={styles.cardName}>{product.name}</h3>
                {product.description && (
                  <p style={styles.cardDesc}>{product.description}</p>
                )}
                <div style={styles.cardFooter}>
                  <span style={styles.price}>${product.price} MXN</span>
                  {/* Boton eliminar solo para admin */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={styles.btnDelete}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#fff",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem 2.5rem",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(15,15,40,0.7)",
    backdropFilter: "blur(12px)",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  navDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e94560, #f5576c)",
  },
  navBrand: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "0.02em",
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  userBadge: {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.05)",
    padding: "0.35rem 0.8rem",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  adminTag: {
    background: "linear-gradient(135deg, #e94560, #f5576c)",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: "700",
    padding: "0.15rem 0.5rem",
    borderRadius: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  btnAdd: {
    background: "linear-gradient(135deg, #e94560, #f5576c)",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  btnLogin: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    padding: "0.5rem 1.2rem",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.85rem",
    textDecoration: "none",
  },
  btnLogout: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2.5rem 2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "2.5rem",
  },
  headerLeft: {},
  headerLabel: {
    color: "#e94560",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    margin: "0 0 0.4rem",
  },
  headerTitle: {
    color: "#fff",
    fontSize: "2.2rem",
    fontWeight: "800",
    margin: 0,
  },
  alertBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "0.6rem 1.2rem",
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.82rem",
  },
  infoBox: {
    background: "rgba(79,172,254,0.08)",
    border: "1px solid rgba(79,172,254,0.2)",
    borderRadius: "10px",
    padding: "0.6rem 1.2rem",
    color: "rgba(79,172,254,0.8)",
    fontSize: "0.82rem",
  },
  successBox: {
    background: "rgba(233,69,96,0.08)",
    border: "1px solid rgba(233,69,96,0.25)",
    borderRadius: "10px",
    padding: "0.6rem 1.2rem",
    color: "#e94560",
    fontSize: "0.82rem",
    fontWeight: "600",
  },
  formCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1.75rem",
    marginBottom: "2rem",
  },
  formTitle: {
    color: "#fff",
    fontWeight: "700",
    margin: "0 0 1.25rem",
    fontSize: "1rem",
  },
  addForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: "140px",
    gap: "0.4rem",
  },
  formLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  addInput: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "0.65rem 1rem",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
  },
  btnSave: {
    alignSelf: "flex-start",
    background: "linear-gradient(135deg, #e94560, #f5576c)",
    border: "none",
    borderRadius: "8px",
    padding: "0.65rem 1.5rem",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.25rem",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  cardNum: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.2)",
    fontWeight: "700",
    letterSpacing: "0.08em",
  },
  cardTag: {
    fontSize: "0.7rem",
    color: "#e94560",
    background: "rgba(233,69,96,0.1)",
    border: "1px solid rgba(233,69,96,0.2)",
    borderRadius: "20px",
    padding: "0.2rem 0.6rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardName: {
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "700",
    margin: 0,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.85rem",
    margin: 0,
    flex: 1,
    lineHeight: 1.5,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  price: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "1rem",
  },
  btnDelete: {
    background: "transparent",
    border: "1px solid rgba(233,69,96,0.3)",
    borderRadius: "6px",
    padding: "0.3rem 0.75rem",
    color: "#e94560",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "5rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  emptyIcon: {
    fontSize: "2rem",
    color: "rgba(255,255,255,0.1)",
    fontWeight: "700",
  },
  emptyMsg: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "1rem",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #e94560",
    borderRadius: "50%",
  },
};