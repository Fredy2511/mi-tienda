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
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-bg {
          min-height: 100vh;
          display: flex;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
        }

        /* PANEL IZQUIERDO */
        .login-left {
          width: 40%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 4rem;
        }

        .login-brand-icon {
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

        .login-brand-name {
          color: #fff;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .login-left-title {
          color: #fff;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .login-left-sub {
          color: rgba(255,255,255,0.5);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 280px;
        }

        .login-circle {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          pointer-events: none;
        }

        /* PANEL DERECHO */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          overflow-y: auto;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .login-title {
          color: #fff;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: rgba(255,255,255,0.45);
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .login-label {
          color: rgba(255,255,255,0.6);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .login-input {
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          width: 100%;
        }

        .login-input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .login-btn {
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

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-error {
          color: #e94560;
          font-size: 0.85rem;
          text-align: center;
          background: rgba(233,69,96,0.08);
          border-radius: 8px;
          padding: 0.5rem;
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
        }

        .login-link {
          color: #e94560;
          text-decoration: none;
          font-weight: 700;
        }

        /* TABLET */
        @media (max-width: 768px) {
          .login-left {
            display: none;
          }

          .login-right {
            padding: 2rem 1.25rem;
          }
        }

        /* MÓVIL */
        @media (max-width: 480px) {
          .login-right {
            align-items: flex-start;
            padding: 2.5rem 1rem;
          }

          .login-form-wrapper {
            padding-top: 1rem;
          }

          .login-title {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="login-bg">
        {/* Panel izquierdo */}
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-icon">S</div>
            <span className="login-brand-name">ShopApp</span>
          </div>
          <h2 className="login-left-title">Bienvenido<br />de vuelta.</h2>
          <p className="login-left-sub">Inicia sesion para gestionar tu inventario de productos.</p>
          <div className="login-circle" style={{width:200,height:200,bottom:-60,left:-60,opacity:0.06}} />
          <div className="login-circle" style={{width:120,height:120,top:40,right:-30,opacity:0.08}} />
        </div>

        {/* Panel derecho */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <h1 className="login-title">Iniciar sesion</h1>
            <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-field">
                <label className="login-label">Correo electronico</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                />
              </div>

              <div className="login-field">
                <label className="login-label">Contrasena</label>
                <input
                  type="password"
                  placeholder="Minimo 6 caracteres"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Entrando..." : "Iniciar sesion"}
              </button>
            </form>

            <p className="login-footer">
              No tienes cuenta?{" "}
              <Link to="/" className="login-link">
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}