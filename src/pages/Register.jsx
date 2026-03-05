import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    lasrName: "",
    email: "",
    password: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "Users", uid), {
        name: form.name,
        lastName: form.lastName,
        lasrName: form.lasrName,
        email: form.email,
        password: form.password,
        country: form.country,
        uid: uid,
        uuid: uid,
        createdAt: serverTimestamp(),
      });

      navigate("/store");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      {/* Panel izquierdo decorativo */}
      <div style={styles.leftPanel}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>S</div>
          <span style={styles.brandName}>ShopApp</span>
        </div>
        <h2 style={styles.leftTitle}>Tu tienda,<br />tu mundo.</h2>
        <p style={styles.leftSub}>Registrate y empieza a explorar productos exclusivos.</p>
        <div style={{...styles.circle, width:200, height:200, bottom:-60, left:-60, opacity:0.06}} />
        <div style={{...styles.circle, width:120, height:120, top:40, right:-30, opacity:0.08}} />
      </div>

      {/* Panel derecho - formulario */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <h1 style={styles.title}>Crear cuenta</h1>
          <p style={styles.subtitle}>Completa tus datos para registrarte</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Nombre</label>
                <input
                  name="name"
                  placeholder="Fredy"
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Apellido Paterno</label>
                <input
                  name="lastName"
                  placeholder="Reynoso"
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Apellido Materno</label>
              <input
                name="lasrName"
                placeholder="Calvillo"
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Pais</label>
              <input
                name="country"
                placeholder="Mexico"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Correo electronico</label>
              <input
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Contrasena</label>
              <input
                name="password"
                type="password"
                placeholder="Minimo 6 caracteres"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p style={styles.footer}>
            Ya tienes cuenta?{" "}
            <Link to="/login" style={styles.link}>
              Inicia sesion
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
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a2a4a 100%)",
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
    overflowY: "auto",
    padding: "2rem",
    background: "transparent",
},
  formWrapper: {
    width: "100%",
    maxWidth: "460px",
  },
title: {
    color: "#fff",
    fontSize: "2rem",
    fontWeight: "800",
    margin: "0 0 0.5rem",
},
subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "0.95rem",
    marginBottom: "2rem",
},
label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.78rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
},
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  row: {
    display: "flex",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "0.4rem",
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
input: {
    background: "rgba(255,255,255,0.1)",
    border: "1.5px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
},
footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.9rem",
},
  link: {
    color: "#e94560",
    textDecoration: "none",
    fontWeight: "700",
  },
};