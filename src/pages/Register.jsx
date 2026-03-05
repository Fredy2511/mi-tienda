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
  const [showPassword, setShowPassword] = useState(false);
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

      // ✅ Solo guardamos datos del perfil, NUNCA la contraseña
      await setDoc(doc(db, "Users", uid), {
        name: form.name,
        lastName: form.lastName,
        lasrName: form.lasrName,
        email: form.email,
        country: form.country,
        uid: uid,
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
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-bg {
          min-height: 100vh;
          display: flex;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a2a4a 100%);
        }

        .left-panel {
          width: 40%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 4rem;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #e94560, #f5576c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .brand-name { color: #fff; font-weight: 700; font-size: 1.2rem; }

        .left-title {
          color: #fff;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .left-sub {
          color: rgba(255,255,255,0.5);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 280px;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          pointer-events: none;
        }

        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 2rem 1.5rem;
        }

        .form-wrapper { width: 100%; max-width: 460px; }

        .reg-title {
          color: #fff;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .reg-subtitle {
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        .reg-form { display: flex; flex-direction: column; gap: 1rem; }

        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .field { display: flex; flex-direction: column; gap: 0.4rem; }

        .reg-label {
          color: rgba(255,255,255,0.7);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .reg-input {
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          width: 100%;
        }

        .reg-input::placeholder { color: rgba(255,255,255,0.3); }

        /* OJITO */
        .password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-wrapper .reg-input {
          padding-right: 2.8rem;
        }

        .eye-btn {
          position: absolute;
          right: 0.85rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s;
        }

        .eye-btn:hover { color: rgba(255,255,255,0.8); }

        .reg-btn {
          margin-top: 0.5rem;
          background: linear-gradient(135deg, #e94560, #f5576c);
          border: none;
          border-radius: 12px;
          padding: 0.95rem;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(233,69,96,0.35);
          width: 100%;
        }

        .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .reg-error {
          color: #e94560;
          font-size: 0.85rem;
          text-align: center;
          background: rgba(233,69,96,0.08);
          border-radius: 8px;
          padding: 0.5rem;
        }

        .reg-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }

        .reg-link { color: #e94560; text-decoration: none; font-weight: 700; }

        @media (max-width: 768px) {
          .left-panel { display: none; }
          .right-panel { padding: 2rem 1.25rem; }
        }

        @media (max-width: 480px) {
          .right-panel { align-items: flex-start; padding: 2rem 1rem; }
          .form-wrapper { padding-top: 1rem; }
          .row { grid-template-columns: 1fr; }
          .reg-title { font-size: 1.6rem; }
        }
      `}</style>

      <div className="reg-bg">
        <div className="left-panel">
          <div className="brand">
            <div className="brand-icon">S</div>
            <span className="brand-name">ShopApp</span>
          </div>
          <h2 className="left-title">Tu tienda,<br />tu mundo.</h2>
          <p className="left-sub">Registrate y empieza a explorar productos exclusivos.</p>
          <div className="circle" style={{width:200,height:200,bottom:-60,left:-60,opacity:0.06}} />
          <div className="circle" style={{width:120,height:120,top:40,right:-30,opacity:0.08}} />
        </div>

        <div className="right-panel">
          <div className="form-wrapper">
            <h1 className="reg-title">Crear cuenta</h1>
            <p className="reg-subtitle">Completa tus datos para registrarte</p>

            <form onSubmit={handleSubmit} className="reg-form">
              <div className="row">
                <div className="field">
                  <label className="reg-label">Nombre</label>
                  <input name="name" placeholder="Fredy" onChange={handleChange} required className="reg-input" />
                </div>
                <div className="field">
                  <label className="reg-label">Apellido Paterno</label>
                  <input name="lastName" placeholder="Reynoso" onChange={handleChange} required className="reg-input" />
                </div>
              </div>

              <div className="field">
                <label className="reg-label">Apellido Materno</label>
                <input name="lasrName" placeholder="Calvillo" onChange={handleChange} className="reg-input" />
              </div>

              <div className="field">
                <label className="reg-label">Pais</label>
                <input name="country" placeholder="Mexico" onChange={handleChange} required className="reg-input" />
              </div>

              <div className="field">
                <label className="reg-label">Correo electronico</label>
                <input name="email" type="email" placeholder="correo@ejemplo.com" onChange={handleChange} required className="reg-input" />
              </div>

              <div className="field">
                <label className="reg-label">Contrasena</label>
                <div className="password-wrapper">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimo 6 caracteres"
                    onChange={handleChange}
                    required
                    className="reg-input"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="reg-error">{error}</p>}

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>

            <p className="reg-footer">
              Ya tienes cuenta?{" "}
              <Link to="/login" className="reg-link">Inicia sesion</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}