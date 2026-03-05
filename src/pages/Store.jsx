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

const ADMIN_EMAILS = ["fredy.reynosooo36@gmail.com"];

export default function Store() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const navigate = useNavigate();

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
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
          font-family: 'Segoe UI', sans-serif;
          color: #fff;
        }

        /* NAV */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15,15,40,0.85);
          backdrop-filter: blur(12px);
          gap: 0.75rem;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .nav-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e94560, #f5576c);
          flex-shrink: 0;
        }

        .nav-brand {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .user-badge {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.05);
          padding: 0.35rem 0.7rem;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-tag {
          background: linear-gradient(135deg, #e94560, #f5576c);
          color: #fff;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .btn-add {
          background: linear-gradient(135deg, #e94560, #f5576c);
          border: none;
          border-radius: 8px;
          padding: 0.5rem 0.9rem;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.82rem;
          white-space: nowrap;
        }

        .btn-login {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.82rem;
          text-decoration: none;
          white-space: nowrap;
        }

        .btn-logout {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 0.5rem 0.9rem;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 0.78rem;
          white-space: nowrap;
        }

        /* CONTAINER */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
        }

        /* HEADER */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-label {
          color: #e94560;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 0.4rem;
        }

        .header-title {
          color: #fff;
          font-size: clamp(1.5rem, 5vw, 2.2rem);
          font-weight: 800;
        }

        .alert-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.6rem 1rem;
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
        }

        .info-box {
          background: rgba(79,172,254,0.08);
          border: 1px solid rgba(79,172,254,0.2);
          border-radius: 10px;
          padding: 0.6rem 1rem;
          color: rgba(79,172,254,0.8);
          font-size: 0.8rem;
        }

        .success-box {
          background: rgba(233,69,96,0.08);
          border: 1px solid rgba(233,69,96,0.25);
          border-radius: 10px;
          padding: 0.6rem 1rem;
          color: #e94560;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* FORM */
        .form-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-title {
          color: #fff;
          font-weight: 700;
          margin-bottom: 1.25rem;
          font-size: 1rem;
        }

        .add-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-label {
          color: rgba(255,255,255,0.5);
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .add-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          width: 100%;
        }

        .add-input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        .btn-save {
          align-self: flex-start;
          background: linear-gradient(135deg, #e94560, #f5576c);
          border: none;
          border-radius: 8px;
          padding: 0.65rem 1.5rem;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.9rem;
          width: 100%;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }

        .card-num {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.2);
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .card-tag {
          font-size: 0.68rem;
          color: #e94560;
          background: rgba(233,69,96,0.1);
          border: 1px solid rgba(233,69,96,0.2);
          border-radius: 20px;
          padding: 0.2rem 0.55rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-name {
          color: #fff;
          font-size: 1.05rem;
          font-weight: 700;
        }

        .card-desc {
          color: rgba(255,255,255,0.4);
          font-size: 0.83rem;
          flex: 1;
          line-height: 1.5;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .price {
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
        }

        .btn-delete {
          background: transparent;
          border: 1px solid rgba(233,69,96,0.3);
          border-radius: 6px;
          padding: 0.3rem 0.75rem;
          color: #e94560;
          cursor: pointer;
          font-size: 0.76rem;
          font-weight: 600;
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 4rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-icon {
          font-size: 2rem;
          color: rgba(255,255,255,0.1);
          font-weight: 700;
        }

        .empty-msg {
          color: rgba(255,255,255,0.3);
          font-size: 1rem;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top: 3px solid #e94560;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* RESPONSIVE — tablets */
        @media (max-width: 768px) {
          .nav {
            padding: 1rem;
          }

          .user-badge {
            max-width: 130px;
            font-size: 0.7rem;
          }

          .grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }

          .btn-save {
            width: 100%;
          }
        }

        /* RESPONSIVE — móviles */
        @media (max-width: 480px) {
          .nav {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .nav-actions {
            width: 100%;
            justify-content: flex-start;
            gap: 0.4rem;
          }

          .user-badge {
            max-width: 100%;
            font-size: 0.68rem;
          }

          .container {
            padding: 1.25rem 1rem;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
          }

          .alert-box, .info-box, .success-box {
            width: 100%;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .card-footer {
            flex-direction: row;
          }
        }
      `}</style>

      <div className="bg">
        {/* NAVBAR */}
        <nav className="nav">
          <div className="nav-left">
            <div className="nav-dot" />
            <span className="nav-brand">ShopApp</span>
          </div>
          <div className="nav-actions">
            {user ? (
              <>
                <span className="user-badge">
                  <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</span>
                  {isAdmin && <span className="admin-tag">Admin</span>}
                </span>
                {isAdmin && (
                  <button onClick={() => setShowForm(!showForm)} className="btn-add">
                    {showForm ? "Cancelar" : "+ Producto"}
                  </button>
                )}
                <button onClick={handleLogout} className="btn-logout">
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-login">
                Iniciar sesion
              </Link>
            )}
          </div>
        </nav>

        <div className="container">
          {/* HEADER */}
          <div className="header">
            <div>
              <p className="header-label">Catalogo</p>
              <h1 className="header-title">Productos</h1>
            </div>
            {!user && <div className="alert-box">Inicia sesion para gestionar el inventario</div>}
            {user && !isAdmin && <div className="info-box">Sesion activa — solo lectura</div>}
            {isAdmin && <div className="success-box">Sesion de administrador activa</div>}
          </div>

          {/* FORM */}
          {showForm && isAdmin && (
            <div className="form-card">
              <h3 className="form-title">Nuevo producto</h3>
              <form onSubmit={handleAddProduct} className="add-form">
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Nombre</label>
                    <input
                      placeholder="Ej: Camiseta"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      className="add-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Precio (MXN)</label>
                    <input
                      placeholder="299"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                      className="add-input"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Categoria</label>
                    <input
                      placeholder="Ropa, Calzado..."
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="add-input"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Descripcion</label>
                  <input
                    placeholder="Descripcion del producto"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="add-input"
                  />
                </div>
                <button type="submit" className="btn-save">
                  Guardar producto
                </button>
              </form>
            </div>
          )}

          {/* PRODUCTOS */}
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
              <p className="empty-msg">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">—</div>
              <p className="empty-msg">No hay productos registrados.</p>
              {isAdmin && (
                <button onClick={() => setShowForm(true)} className="btn-add">
                  + Agregar primer producto
                </button>
              )}
            </div>
          ) : (
            <div className="grid">
              {products.map((product, i) => (
                <div key={product.id} className="card">
                  <div className="card-top">
                    <div className="card-num">{String(i + 1).padStart(2, "0")}</div>
                    {product.category && <span className="card-tag">{product.category}</span>}
                  </div>
                  <h3 className="card-name">{product.name}</h3>
                  {product.description && <p className="card-desc">{product.description}</p>}
                  <div className="card-footer">
                    <span className="price">${product.price} MXN</span>
                    {isAdmin && (
                      <button onClick={() => handleDelete(product.id)} className="btn-delete">
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
    </>
  );
}