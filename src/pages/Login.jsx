import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/store");
    } catch {
      setError("Correo o contrasena incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      {/* Panel izquierdo */}
      <div style={styles.leftPanel}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>S</div>
          <span style={styles.brandName}>ShopApp</span>
        </div>
        <h2 style={styles.leftTitle}>Bienvenido<br />de vuelta.</h2>
        <p style={styles.leftSub}>Inicia sesion para gestionar tu inventario de productos.</p>
        <div style={{ ...styles.circle, width: 200, height: 200, bottom: -60, left: -60, opacity: 0.06 }} />
        <div style={{ ...styles.circle, width: 120, height: 120, top: 40, right: -30, opacity: 0.08 }} />
      </div>

      {/* Panel derecho */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <h1 style={styles.title}>Iniciar sesion</h1>
          <p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Correo electronico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Contrasena</label>
              <input
                type="password"
                placeholder="Minimo 6 caracteres"
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesion"}
            </button>
          </form>

          <p style={styles.footer}>
            No tienes cuenta?{" "}
            <Link to="/" style={styles.link}>
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    position: "fixed",
    inset: 0,
    display: "flex",
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
  },
  leftPanel: {
    width: "40%",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "3rem",
    position: "relative",
    overflow: "hidden",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "4rem",
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: "10px",
    background: "linear-gradient(135deg, #e94560, #f5576c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "800",
    fontSize: "1.2rem",
  },
  brandName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "1.2rem",
  },
  leftTitle: {
    color: "#fff",
    fontSize: "2.8rem",
    fontWeight: "800",
    lineHeight: 1.2,
    marginBottom: "1.5rem",
  },
  leftSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "1rem",
    lineHeight: 1.6,
    maxWidth: "280px",
  },
  circle: {
    position: "absolute",
    borderRadius: "50%",
    background: "#fff",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    color: "#fff",
    fontSize: "2rem",
    fontWeight: "800",
    margin: "0 0 0.5rem",
  },
  subtitle: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "0.95rem",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "0.78rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    background: "rgba(255,255,255,0.07)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
  },
  btn: {
    marginTop: "0.5rem",
    background: "linear-gradient(135deg, #e94560, #f5576c)",
    border: "none",
    borderRadius: "12px",
    padding: "0.95rem",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(233,69,96,0.35)",
  },
  error: {
    color: "#e94560",
    fontSize: "0.85rem",
    textAlign: "center",
    background: "rgba(233,69,96,0.08)",
    borderRadius: "8px",
    padding: "0.5rem",
  },
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.9rem",
  },
  link: {
    color: "#e94560",
    textDecoration: "none",
    fontWeight: "700",
  },
};