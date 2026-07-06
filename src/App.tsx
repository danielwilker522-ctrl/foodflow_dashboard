import { useState, useEffect, useCallback } from "react";

const SB_URL = "https://qwqeqlrcfmktoktljolg.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cWVxbHJjZm1rdG9rdGxqb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMzEwMjYsImV4cCI6MjA5NjkwNzAyNn0.v5Jgg_-C_cuTjNU2HkX4Ixcxqy5-SZUzwpidmJzCFsA";

async function sbFetch(path, opts = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=representation", ...opts.headers },
    ...opts,
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || res.statusText); }
  const t = await res.text(); return t ? JSON.parse(t) : null;
}
async function sbAuth(action, body) {
  const res = await fetch(`${SB_URL}/auth/v1/${action}`, { method: "POST", headers: { apikey: SB_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await res.json();
  if (d.error || d.error_description) throw new Error(d.error_description || d.error);
  return d;
}
async function sbMe(token) {
  const res = await fetch(`${SB_URL}/auth/v1/user`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` } });
  return res.json();
}

const C = {
  bg: "#0B0D12", surface: "#14171D", surface2: "#1F232C", border: "#2A2E38",
  gold: "#D4AF37", orange: "#FF8A00", success: "#22C55E", blue: "#3B82F6",
  purple: "#8B5CF6", danger: "#EF4444", textMain: "#F5F5F5", textSub: "#ADB5BD", textMuted: "#4A5568",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; background: #0B0D12; font-family: 'Inter', sans-serif; }
  input:focus, textarea:focus { outline: none !important; border-color: #D4AF37 !important; box-shadow: 0 0 0 3px #D4AF3720 !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #14171D; }
  ::-webkit-scrollbar-thumb { background: #2A2E38; border-radius: 4px; }
`;

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    fork: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="8"/><line x1="10" y1="2" x2="10" y2="8"/><line x1="14" y1="2" x2="14" y2="8"/></svg>,
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    food: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="8"/><line x1="10" y1="2" x2="10" y2="8"/><line x1="14" y1="2" x2="14" y2="8"/></svg>,
    category: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M4 20h4V10H4v10zm6 0h4V4h-4v16zm6 0h4v-6h-4v6z"/></svg>,
    chair: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M6 2v14M18 2v14M6 10h12M6 16l-2 6M18 16l2 6"/></svg>,
    orders: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
    restaurant: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="6,9 12,15 18,9"/></svg>,
    money: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2m-3-5h6"/></svg>,
    clip: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
    tag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    report: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    scan: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>,
    handBell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M22 17H2a3 3 0 003-3v-3a7 7 0 0114 0v3a3 3 0 003 3z"/><path d="M9 21h6"/></svg>,
    folder: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    folderOpen: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><polyline points="2,10 22,10"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  };
  return icons[name] || null;
};

function Spinner() {
  return <div style={{ display: "flex", justifyContent: "center", padding: 48 }}><div style={{ width: 28, height: 28, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.gold}`, borderRadius: "50%", animation: "spin .8s linear infinite" }} /></div>;
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? C.danger : C.success;
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: C.surface, border: `1px solid ${bg}50`, color: C.textMain, padding: "14px 24px", borderRadius: 12, fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 8px 32px #0008", display: "flex", gap: 10, alignItems: "center" }}>
      <span style={{ color: bg }}>{type === "error" ? "✕" : "✓"}</span> {msg}
    </div>
  );
}

function LiveNotifications({ notifications, onDismiss }) {
  if (notifications.length === 0) return null;
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9998, display: "flex", flexDirection: "column", gap: 10 }}>
      {notifications.map(n => {
        const isWaiter = n.type === "waiter";
        const color = isWaiter ? C.danger : C.blue;
        return (
          <div key={n.id} style={{ background: C.surface, border: `1px solid ${color}50`, borderRadius: 14, padding: "16px 20px", boxShadow: "0 8px 32px #0008", animation: "slideIn .3s ease", minWidth: 280, maxWidth: 340 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "20", border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={isWaiter ? "handBell" : "scan"} size={20} color={color} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: C.textMain, fontSize: 14 }}>{isWaiter ? `Mesa ${n.mesa} chamou o atendente!` : `Mesa ${n.mesa} foi escaneada!`}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textSub }}>{isWaiter ? "Aguarda atendimento" : "Cliente a consultar o menu"} · {n.hora}</p>
                </div>
              </div>
              <button onClick={() => onDismiss(n.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.textSub, padding: 4 }}>
                <Icon name="x" size={14} color={C.textSub} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false, icon }) {
  const sz = { sm: { padding: "7px 12px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 13 }, lg: { padding: "13px 32px", fontSize: 15 } };
  const vr = {
    primary: { background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`, color: "#0B0D12", fontWeight: 800 },
    ghost: { background: "transparent", color: C.textSub, border: `1px solid ${C.border}` },
    outline: { background: "transparent", color: C.gold, border: `1px solid ${C.gold}` },
    danger: { background: C.danger + "12", color: C.danger, border: `1px solid ${C.danger}30` },
    success: { background: C.success + "15", color: C.success, border: `1px solid ${C.success}30` },
    dark: { background: C.surface2, color: C.textSub, border: `1px solid ${C.border}` },
    blue: { background: C.blue + "20", color: C.blue, border: `1px solid ${C.blue}30` },
    purple: { background: C.purple + "20", color: C.purple, border: `1px solid ${C.purple}30` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 10, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: "Inter, sans-serif", transition: "all .15s", ...sz[size], ...vr[variant], ...style }}>
      {icon && <Icon name={icon} size={14} color="currentColor" />}{children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.surface2, color: C.textMain, fontSize: 14, fontFamily: "Inter, sans-serif", boxSizing: "border-box" }} />
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, ...style }}>{children}</div>;
}

function Badge({ children, color = C.gold }) {
  return <span style={{ background: color + "18", color, border: `1px solid ${color}30`, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>;
}

function StatCard({ icon, label, value, sub, color = C.gold }) {
  return (
    <Card style={{ padding: 22, animation: "fadeIn .4s ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.textMain, lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ margin: "6px 0 0", fontSize: 12, color: C.textSub }}>{sub}</p>}
        </div>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: color + "15", border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={20} color={color} />
        </div>
      </div>
    </Card>
  );
}

function Logo({ size = "md" }) {
  const s = size === "lg" ? { icon: 40, font: 20 } : { icon: 30, font: 16 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: s.icon, height: s.icon, borderRadius: 9, background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name="fork" size={s.icon * 0.52} color="#0B0D12" />
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: s.font, color: C.textMain, letterSpacing: "-0.4px" }}>FoodFlow</span>
    </div>
  );
}

// ── Imagem com tamanho fixo e sem cortes ─────────────────────────────────────
function RestaurantAvatar({ url, nome, size = 44, borderRadius = "50%" }) {
  const [error, setError] = useState(false);
  if (url && !error) {
    return (
      <div style={{ width: size, height: size, borderRadius, overflow: "hidden", flexShrink: 0, border: `2px solid ${C.border}`, background: C.surface2 }}>
        <img src={url} alt={nome} onError={() => setError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius, background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon name="fork" size={size * 0.45} color="#0B0D12" />
    </div>
  );
}

function Topbar({ title, subtitle, restaurant, pendingCount = 0, waiterCount = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.textMain, letterSpacing: "-0.5px" }}>{title}</h1>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textSub }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {waiterCount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: C.danger + "15", border: `1px solid ${C.danger}40`, animation: "pulse 1.5s infinite" }}>
            <Icon name="handBell" size={15} color={C.danger} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.danger }}>{waiterCount} chamada(s)</span>
          </div>
        )}
        <div style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="bell" size={16} color={pendingCount > 0 ? C.gold : C.textSub} />
          {pendingCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: C.danger, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 2s infinite" }}>{pendingCount}</span>}
        </div>
        {restaurant && (
          <div style={{ display: "flex", alignItems: "center", gap: 9, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 12px" }}>
            <RestaurantAvatar url={restaurant.avata_url} nome={restaurant.nome} size={28} borderRadius="7px" />
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.textMain }}>{restaurant.nome}</p>
              <p style={{ margin: 0, fontSize: 10, color: C.textSub }}>Restaurante</p>
            </div>
            <Icon name="chevron" size={13} color={C.textSub} />
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ tab, setTab, restaurant, onLogout, pendingCount = 0, waiterCount = 0 }) {
  const links = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "menu", icon: "food", label: "Menu" },
    { id: "categories", icon: "category", label: "Categorias" },
    { id: "mesas", icon: "chair", label: "Mesas" },
    { id: "orders", icon: "orders", label: "Pedidos", badge: pendingCount },
    { id: "waiters", icon: "handBell", label: "Chamadas", badge: waiterCount },
    { id: "relatorios", icon: "report", label: "Relatórios" },
    { id: "arquivo-pedidos", icon: "folder", label: "Arquivo Pedidos" },
    { id: "arquivo-relatorios", icon: "folder", label: "Arquivo Relatórios" },
    { id: "restaurant", icon: "restaurant", label: "Restaurante" },
  ];
  return (
    <div style={{ width: 210, minHeight: "100vh", background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 50 }}>
      <div style={{ padding: "22px 18px 18px" }}>
        <Logo />
        {restaurant && <p style={{ margin: "8px 0 0", fontSize: 12, color: C.textSub, paddingLeft: 2 }}>{restaurant.nome}</p>}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 10px", flex: 1, overflowY: "auto" }}>
        {links.map(l => {
          const active = tab === l.id;
          const isUrgent = l.id === "waiters" && l.badge > 0;
          const isArchive = l.id.startsWith("arquivo");
          return (
            <button key={l.id} onClick={() => setTab(l.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: "none", background: active ? C.gold + "18" : isUrgent ? C.danger + "10" : "transparent", color: active ? C.gold : isUrgent ? C.danger : isArchive ? C.purple : C.textSub, fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif", marginBottom: 2, textAlign: "left", borderLeft: active ? `3px solid ${C.gold}` : "3px solid transparent", transition: "all .15s", justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name={l.icon} size={16} color={active ? C.gold : isUrgent ? C.danger : isArchive ? C.purple : C.textSub} />{l.label}</span>
              {l.badge > 0 && <span style={{ background: C.danger, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", animation: isUrgent ? "pulse 1.5s infinite" : "none" }}>{l.badge}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "14px 10px", borderTop: `1px solid ${C.border}` }}>
        <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: "none", background: "transparent", color: C.textSub, fontWeight: 500, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
          <Icon name="logout" size={16} color="currentColor" />Sair
        </button>
      </div>
    </div>
  );
}

// ── Funções de arquivo ────────────────────────────────────────────────────────
function getInicioSemana(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}
function getFimSemana(inicio) {
  const d = new Date(inicio + "T12:00:00");
  d.setDate(d.getDate() + 6);
  return d.toISOString().split("T")[0];
}
function getSemanaLabel(inicio, fim) {
  const fmt = d => new Date(d + "T12:00:00").toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });
  return `Semana ${fmt(inicio)} — ${fmt(fim)}`;
}
function getDiaLabel(data) {
  return new Date(data + "T12:00:00").toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
}

// ── Arquivo automático diário (pedidos com mais de 24h) ───────────────────────
async function arquivarPedidosDiarios(restaurantId) {
  try {
    const limite = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const pedidosAntigos = await sbFetch(`orders?restaurant_id=eq.${restaurantId}&created_at=lt.${limite}&select=*`);
    if (!pedidosAntigos || pedidosAntigos.length === 0) return;

    // Agrupar por dia
    const porDia = {};
    for (const p of pedidosAntigos) {
      const dia = p.created_at.split("T")[0];
      if (!porDia[dia]) porDia[dia] = [];
      porDia[dia].push(p);
    }

    for (const [dia, pedidos] of Object.entries(porDia)) {
      // Verificar se já foi arquivado
      const existente = await sbFetch(`arquivo_pedidos_diario?restaurant_id=eq.${restaurantId}&data_arquivo=eq.${dia}&select=id&limit=1`);
      if (existente && existente.length > 0) {
        // Já existe — apagar os pedidos da tabela principal
        for (const p of pedidos) {
          await sbFetch(`orders_itens?order_id=eq.${p.id}`, { method: "DELETE" });
          await sbFetch(`orders?id=eq.${p.id}`, { method: "DELETE" });
        }
        continue;
      }

      // Buscar itens
      const pedidosComItens = await Promise.all(pedidos.map(async p => {
        const itens = await sbFetch(`orders_itens?order_id=eq.${p.id}&select=*`);
        return { ...p, itens: itens || [] };
      }));

      const totalVendas = pedidos.filter(p => p.status === "completed").reduce((s, p) => s + Number(p.total || 0), 0);
      const inicioSemana = getInicioSemana(new Date(dia));
      const fimSemana = getFimSemana(inicioSemana);
      const semanaLabel = getSemanaLabel(inicioSemana, fimSemana);
      const diaLabel = getDiaLabel(dia);

      // Criar arquivo diário
      await sbFetch("arquivo_pedidos_diario", {
        method: "POST",
        body: JSON.stringify({ restaurant_id: restaurantId, data_arquivo: dia, semana_inicio: inicioSemana, semana_label: semanaLabel, dia_label: diaLabel, total_pedidos: pedidos.length, total_vendas: totalVendas, pedidos: pedidosComItens }),
      });

      // Também arquivar nos relatórios diários
      const existeRelatorio = await sbFetch(`relatorios_diarios?restaurant_id=eq.${restaurantId}&data_relatorio=eq.${dia}&select=id&limit=1`);
      if (!existeRelatorio || existeRelatorio.length === 0) {
        await sbFetch("relatorios_diarios", { method: "POST", body: JSON.stringify({ restaurant_id: restaurantId, data_relatorio: dia, total_pedidos: pedidos.length, total_vendas: totalVendas, pedidos: pedidosComItens }) });
      }

      // Apagar pedidos da tabela principal
      for (const p of pedidos) {
        await sbFetch(`orders_itens?order_id=eq.${p.id}`, { method: "DELETE" });
        await sbFetch(`orders?id=eq.${p.id}`, { method: "DELETE" });
      }
    }
  } catch (e) { console.error("Erro arquivo diário:", e); }
}

// ── Apagar chamadas com mais de 24h ───────────────────────────────────────────
async function limparChamadasAntigas(restaurantId) {
  try {
    const limite = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await sbFetch(`chamadas_garcom?restaurant_id=eq.${restaurantId}&created_at=lt.${limite}`, { method: "DELETE" });
  } catch (e) { console.error("Erro limpeza chamadas:", e); }
}

async function arquivarPedidosAnteriores(restaurantId) {
  try {
    const hoje = new Date().toISOString().split("T")[0];
    const pedidosAntigos = await sbFetch(`orders?restaurant_id=eq.${restaurantId}&status=eq.completed&created_at=lt.${hoje}T00:00:00&select=*`);
    if (!pedidosAntigos || pedidosAntigos.length === 0) return;
    const porDia = {};
    for (const p of pedidosAntigos) { const dia = p.created_at.split("T")[0]; if (!porDia[dia]) porDia[dia] = []; porDia[dia].push(p); }
    for (const [dia, pedidos] of Object.entries(porDia)) {
      const existente = await sbFetch(`relatorios_diarios?restaurant_id=eq.${restaurantId}&data_relatorio=eq.${dia}&select=id&limit=1`);
      if (existente && existente.length > 0) continue;
      const pedidosComItens = await Promise.all(pedidos.map(async (p) => { const itens = await sbFetch(`orders_itens?order_id=eq.${p.id}&select=*`); return { ...p, itens: itens || [] }; }));
      const totalVendas = pedidos.reduce((s, p) => s + Number(p.total || 0), 0);
      await sbFetch("relatorios_diarios", { method: "POST", body: JSON.stringify({ restaurant_id: restaurantId, data_relatorio: dia, total_pedidos: pedidos.length, total_vendas: totalVendas, pedidos: pedidosComItens }) });
    }
  } catch (e) { console.error("Erro ao arquivar:", e); }
}

function gerarPDF(relatorio, restaurantNome, titulo) {
  const pedidos = relatorio.pedidos || [];
  const linhasPedidos = pedidos.map((p) => {
    const itens = (p.itens || []).map(item => `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px">${item.quantity}× ${item.item_name}</td><td style="padding:6px 12px;text-align:right;font-size:13px">${Number(item.subtotal).toFixed(0)} Kz</td></tr>`).join("");
    return `<div style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden"><div style="background:#f9fafb;padding:12px 16px;display:flex;justify-content:space-between"><div><strong>${p.customer_name || "Cliente"}</strong><span style="color:#6b7280;margin-left:12px;font-size:13px">Mesa ${p.table_number} · ${p.payment_method === "cash" ? "Cash" : "Cartão"}</span>${p.observacoes ? `<div style="color:#9ca3af;font-size:12px;margin-top:2px">Obs: ${p.observacoes}</div>` : ""}</div><strong style="color:#D4AF37">${Number(p.total || 0).toFixed(0)} Kz</strong></div><table style="width:100%;border-collapse:collapse">${itens}</table></div>`;
  }).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${titulo}</title><style>body{font-family:'Inter',Arial,sans-serif;background:#fff;color:#111827;margin:0;padding:32px}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #D4AF37}.logo{font-size:24px;font-weight:900}.logo span{color:#D4AF37}.total-box{background:linear-gradient(135deg,#D4AF37,#FF8A00);border-radius:12px;padding:16px 24px;color:#0B0D12;display:flex;justify-content:space-between;align-items:center;margin-top:16px}.footer{margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;color:#9ca3af;font-size:12px}</style></head><body>
  <div class="header"><div><div class="logo">Food<span>Flow</span></div><div style="color:#6b7280;font-size:14px">${restaurantNome}</div></div><div style="text-align:right"><div style="font-weight:700">${titulo}</div></div></div>
  ${linhasPedidos}
  <div class="total-box"><span style="font-weight:800;font-size:16px">TOTAL</span><span style="font-weight:900;font-size:22px">${Number(relatorio.total_vendas || 0).toFixed(0)} Kz</span></div>
  <div class="footer"><span>Gerado por FoodFlow · ${new Date().toLocaleString("pt-PT")}</span><span>${restaurantNome}</span></div>
  </body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html); win.document.close(); win.focus();
  setTimeout(() => win.print(), 800);
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function DashboardTab({ restaurant, pendingCount, waiterCount }) {
  const [stats, setStats] = useState({ menus: 0, mesas: 0, orders: 0, revenue: 0, cats: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!restaurant) return;
    (async () => {
      try {
        const hoje = new Date().toISOString().split("T")[0];
        const [menus, mesas, orders, cats, todayOrders] = await Promise.all([
          sbFetch(`menu_itens?restaurant_id=eq.${restaurant.id}&select=id`),
          sbFetch(`mesas?restaurant_id=eq.${restaurant.id}&select=id`),
          sbFetch(`orders?restaurant_id=eq.${restaurant.id}&select=*&order=created_at.desc&limit=5`),
          sbFetch(`categories?restaurant_id=eq.${restaurant.id}&select=id`),
          sbFetch(`orders?restaurant_id=eq.${restaurant.id}&status=eq.completed&created_at=gte.${hoje}T00:00:00&select=total,status`),
        ]);
        const revenue = (todayOrders || []).reduce((s, o) => s + Number(o.total || 0), 0);
        setStats({ menus: menus?.length || 0, mesas: mesas?.length || 0, orders: todayOrders?.length || 0, revenue, cats: cats?.length || 0 });
        setRecentOrders(orders || []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, [restaurant]);
  const sColor = s => s === "completed" ? C.success : s === "pending" ? C.orange : s === "cancelled" ? C.danger : C.blue;
  const sLabel = s => s === "completed" ? "Concluído" : s === "pending" ? "Pendente" : s === "cancelled" ? "Cancelado" : "Em preparação";
  if (loading) return <Spinner />;
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Dashboard" subtitle="Visão geral — hoje" restaurant={restaurant} pendingCount={pendingCount} waiterCount={waiterCount} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 22 }}>
        <StatCard icon="money" label="Receita Hoje" value={`${stats.revenue.toFixed(0)} Kz`} sub="Concluídos hoje" color={C.gold} />
        <StatCard icon="clip" label="Pedidos Hoje" value={stats.orders} sub="Concluídos hoje" color={C.orange} />
        <StatCard icon="food" label="Itens de Menu" value={stats.menus} color={C.success} />
        <StatCard icon="chair" label="Mesas" value={stats.mesas} color={C.blue} />
        <StatCard icon="category" label="Categorias" value={stats.cats} color={C.purple} />
      </div>
      <Card style={{ padding: 22 }}>
        <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: C.textMain }}>Pedidos Recentes</h3>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "36px 20px" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><Icon name="clip" size={22} color={C.textSub} /></div>
            <p style={{ color: C.textSub, fontWeight: 600 }}>Nenhum pedido ainda</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentOrders.map(o => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", background: C.surface2, borderRadius: 10, border: `1px solid ${o.status === "pending" ? C.orange + "40" : C.border}` }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: C.textMain, fontSize: 14 }}>{o.customer_name || "Cliente"}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: C.textSub }}>Mesa {o.table_number} · {new Date(o.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 800, color: C.gold, fontSize: 14 }}>{Number(o.total || 0).toFixed(0)} Kz</span>
                  <Badge color={sColor(o.status)}>{sLabel(o.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Arquivo Pedidos Diário + Semanal ─────────────────────────────────────────
function ArquivoPedidosTab({ restaurant, showToast }) {
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSemana, setExpandedSemana] = useState(null);
  const [expandedDia, setExpandedDia] = useState(null);

  const load = useCallback(async () => {
    if (!restaurant) return; setLoading(true);
    try {
      const a = await sbFetch(`arquivo_pedidos_diario?restaurant_id=eq.${restaurant.id}&select=*&order=data_arquivo.desc`);
      // Agrupar por semana
      const porSemana = {};
      for (const d of (a || [])) {
        const key = d.semana_inicio;
        if (!porSemana[key]) porSemana[key] = { semana_label: d.semana_label, semana_inicio: d.semana_inicio, dias: [], total_vendas: 0, total_pedidos: 0 };
        porSemana[key].dias.push(d);
        porSemana[key].total_vendas += Number(d.total_vendas || 0);
        porSemana[key].total_pedidos += d.total_pedidos || 0;
      }
      setArquivos(Object.values(porSemana).sort((a, b) => b.semana_inicio.localeCompare(a.semana_inicio)));
    } catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  }, [restaurant]);

  useEffect(() => { load(); }, [load]);

  const sColor = s => s === "completed" ? C.success : s === "pending" ? C.orange : s === "cancelled" ? C.danger : C.blue;
  const sLabel = s => s === "completed" ? "Concluído" : s === "pending" ? "Pendente" : s === "cancelled" ? "Cancelado" : "Em preparação";

  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Arquivo de Pedidos" subtitle="Pedidos organizados por semana e dia" restaurant={restaurant} />
      {loading ? <Spinner /> : arquivos.length === 0 ? (
        <Card style={{ padding: 60, textAlign: "center" }}>
          <Icon name="folder" size={40} color={C.textMuted} />
          <p style={{ color: C.textSub, marginTop: 12, fontWeight: 600 }}>Nenhum arquivo ainda</p>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 6 }}>Os pedidos são arquivados automaticamente após 24 horas</p>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {arquivos.map(semana => (
            <Card key={semana.semana_inicio} style={{ overflow: "hidden" }}>
              {/* Cabeçalho da semana */}
              <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: expandedSemana === semana.semana_inicio ? C.surface2 : "transparent" }} onClick={() => setExpandedSemana(expandedSemana === semana.semana_inicio ? null : semana.semana_inicio)}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.purple + "20", border: `1px solid ${C.purple}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={expandedSemana === semana.semana_inicio ? "folderOpen" : "folder"} size={20} color={C.purple} />
                  </div>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: 800, color: C.textMain, fontSize: 15 }}>{semana.semana_label}</p>
                    <div style={{ display: "flex", gap: 14 }}>
                      <span style={{ fontSize: 13, color: C.textSub }}><span style={{ color: C.gold, fontWeight: 700 }}>{semana.total_pedidos}</span> pedidos</span>
                      <span style={{ fontSize: 13, color: C.textSub }}>Total: <span style={{ color: C.success, fontWeight: 700 }}>{semana.total_vendas.toFixed(0)} Kz</span></span>
                      <span style={{ fontSize: 13, color: C.textSub }}><span style={{ color: C.purple, fontWeight: 700 }}>{semana.dias.length}</span> dia(s)</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.gold }}>{semana.total_vendas.toFixed(0)} Kz</p>
                  <div style={{ color: C.textSub, transition: "transform .2s", transform: expandedSemana === semana.semana_inicio ? "rotate(180deg)" : "rotate(0)" }}>
                    <Icon name="chevron" size={18} color={C.textSub} />
                  </div>
                </div>
              </div>

              {/* Dias da semana */}
              {expandedSemana === semana.semana_inicio && (
                <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, animation: "fadeIn .2s ease" }}>
                  {semana.dias.map(dia => (
                    <div key={dia.data_arquivo} style={{ background: C.surface2, borderRadius: 12, overflow: "hidden" }}>
                      {/* Cabeçalho do dia */}
                      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setExpandedDia(expandedDia === dia.data_arquivo ? null : dia.data_arquivo)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: C.blue + "20", border: `1px solid ${C.blue}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon name="calendar" size={16} color={C.blue} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: C.textMain, fontSize: 14, textTransform: "capitalize" }}>{dia.dia_label}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textSub }}>{dia.total_pedidos} pedidos · {Number(dia.total_vendas).toFixed(0)} Kz</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Btn variant="dark" size="sm" icon="download" onClick={e => { e.stopPropagation(); gerarPDF(dia, restaurant.nome, dia.dia_label); }}>PDF</Btn>
                          <div style={{ color: C.textSub, transition: "transform .2s", transform: expandedDia === dia.data_arquivo ? "rotate(180deg)" : "rotate(0)" }}>
                            <Icon name="chevron" size={15} color={C.textSub} />
                          </div>
                        </div>
                      </div>

                      {/* Pedidos do dia */}
                      {expandedDia === dia.data_arquivo && (
                        <div style={{ borderTop: `1px solid ${C.border}30`, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8, animation: "fadeIn .2s ease" }}>
                          {(dia.pedidos || []).map((p, i) => (
                            <div key={i} style={{ background: C.surface, borderRadius: 10, overflow: "hidden" }}>
                              <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <p style={{ margin: 0, fontWeight: 700, color: C.textMain, fontSize: 13 }}>{p.customer_name || "Cliente"}</p>
                                    <Badge color={sColor(p.status)}>{sLabel(p.status)}</Badge>
                                  </div>
                                  <p style={{ margin: "3px 0 0", fontSize: 11, color: C.textSub }}>Mesa {p.table_number} · {new Date(p.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })} · {p.payment_method === "cash" ? "💵 Cash" : "💳 Cartão"}</p>
                                  {p.observacoes && <p style={{ margin: "3px 0 0", fontSize: 11, color: C.blue }}>📝 {p.observacoes}</p>}
                                </div>
                                <span style={{ fontWeight: 800, color: C.gold, fontSize: 14 }}>{Number(p.total || 0).toFixed(0)} Kz</span>
                              </div>
                              {(p.itens || []).length > 0 && (
                                <div style={{ padding: "6px 14px 10px", borderTop: `1px solid ${C.border}20` }}>
                                  {(p.itens || []).map((item, ii) => (
                                    <div key={ii} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textSub, padding: "2px 0" }}>
                                      <span>{item.quantity}× {item.item_name}</span>
                                      <span style={{ color: C.textMain }}>{Number(item.subtotal).toFixed(0)} Kz</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: C.gold + "15", borderRadius: 10, border: `1px solid ${C.gold}30` }}>
                            <span style={{ fontWeight: 800, color: C.textMain, fontSize: 13 }}>Total do dia</span>
                            <span style={{ fontWeight: 900, color: C.gold, fontSize: 15 }}>{Number(dia.total_vendas).toFixed(0)} Kz</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Total da semana */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: C.purple + "15", borderRadius: 10, border: `1px solid ${C.purple}30`, marginTop: 4 }}>
                    <span style={{ fontWeight: 800, color: C.textMain }}>Total da semana</span>
                    <span style={{ fontWeight: 900, color: C.purple, fontSize: 16 }}>{semana.total_vendas.toFixed(0)} Kz</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ArquivoRelatoriosTab({ restaurant, showToast }) {
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const load = useCallback(async () => {
    if (!restaurant) return; setLoading(true);
    try { const a = await sbFetch(`arquivo_relatorios_semanal?restaurant_id=eq.${restaurant.id}&select=*&order=semana_inicio.desc`); setArquivos(a || []); }
    catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  }, [restaurant]);
  useEffect(() => { load(); }, [load]);
  const formatDate = d => new Date(d + "T12:00:00").toLocaleDateString("pt-PT", { weekday: "short", day: "2-digit", month: "2-digit" });
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Arquivo de Relatórios" subtitle="Relatórios organizados por semana" restaurant={restaurant} />
      {loading ? <Spinner /> : arquivos.length === 0 ? (
        <Card style={{ padding: 60, textAlign: "center" }}><Icon name="folder" size={40} color={C.textMuted} /><p style={{ color: C.textSub, marginTop: 12, fontWeight: 600 }}>Nenhum arquivo ainda</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {arquivos.map(a => (
            <Card key={a.id} style={{ overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.blue + "20", border: `1px solid ${C.blue}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={expanded === a.id ? "folderOpen" : "folder"} size={20} color={C.blue} />
                  </div>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: 800, color: C.textMain, fontSize: 15 }}>{a.semana_label}</p>
                    <div style={{ display: "flex", gap: 14 }}>
                      <span style={{ fontSize: 13, color: C.textSub }}><span style={{ color: C.gold, fontWeight: 700 }}>{a.total_pedidos}</span> pedidos</span>
                      <span style={{ fontSize: 13, color: C.textSub }}>Total: <span style={{ color: C.success, fontWeight: 700 }}>{Number(a.total_vendas).toFixed(0)} Kz</span></span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.gold }}>{Number(a.total_vendas).toFixed(0)} Kz</p>
                  <Btn variant="dark" size="sm" icon="download" onClick={e => { e.stopPropagation(); gerarPDF({ ...a, pedidos: (a.relatorios || []).flatMap(r => r.pedidos || []) }, restaurant.nome, a.semana_label); }}>PDF</Btn>
                  <div style={{ color: C.textSub, transition: "transform .2s", transform: expanded === a.id ? "rotate(180deg)" : "rotate(0)" }}><Icon name="chevron" size={18} color={C.textSub} /></div>
                </div>
              </div>
              {expanded === a.id && (
                <div style={{ borderTop: `1px solid ${C.border}`, padding: "16px 20px", animation: "fadeIn .2s ease" }}>
                  {(a.relatorios || []).length === 0 ? <p style={{ color: C.textMuted, fontSize: 13 }}>Sem relatórios</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(a.relatorios || []).map((r, i) => (
                        <div key={i} style={{ background: C.surface2, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Icon name="calendar" size={15} color={C.blue} />
                            <div><p style={{ margin: 0, fontWeight: 700, color: C.textMain, fontSize: 14, textTransform: "capitalize" }}>{formatDate(r.data_relatorio)}</p><p style={{ margin: "2px 0 0", fontSize: 12, color: C.textSub }}>{r.total_pedidos} pedidos</p></div>
                          </div>
                          <span style={{ fontWeight: 800, color: C.gold, fontSize: 15 }}>{Number(r.total_vendas).toFixed(0)} Kz</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: C.blue + "15", borderRadius: 10, border: `1px solid ${C.blue}30`, marginTop: 4 }}>
                        <span style={{ fontWeight: 800, color: C.textMain }}>Total da semana</span>
                        <span style={{ fontWeight: 900, color: C.gold, fontSize: 16 }}>{Number(a.total_vendas).toFixed(0)} Kz</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RelatoriosTab({ restaurant, showToast }) {
  const [relatorios, setRelatorios] = useState([]); const [loading, setLoading] = useState(true); const [viewing, setViewing] = useState(null);
  const load = useCallback(async () => {
    if (!restaurant) return; setLoading(true);
    try { const r = await sbFetch(`relatorios_diarios?restaurant_id=eq.${restaurant.id}&select=*&order=data_relatorio.desc`); setRelatorios(r || []); }
    catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  }, [restaurant]);
  useEffect(() => { load(); }, [load]);
  const gerarManual = async () => {
    try { await arquivarPedidosAnteriores(restaurant.id); showToast("Relatórios gerados!"); load(); } catch (e) { showToast(e.message, "error"); }
  };
  const formatDate = d => new Date(d + "T12:00:00").toLocaleDateString("pt-PT", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  if (viewing) {
    const r = viewing;
    return (
      <div style={{ animation: "fadeIn .3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <Btn variant="ghost" size="sm" icon="chevron" onClick={() => setViewing(null)} style={{ transform: "rotate(90deg)" }}>Voltar</Btn>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textMain, textTransform: "capitalize" }}>{formatDate(r.data_relatorio)}</h2>
          <div style={{ marginLeft: "auto" }}><Btn variant="primary" icon="download" onClick={() => gerarPDF(r, restaurant.nome, formatDate(r.data_relatorio))}>Baixar PDF</Btn></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard icon="clip" label="Total Pedidos" value={r.total_pedidos} color={C.gold} />
          <StatCard icon="money" label="Receita Total" value={`${Number(r.total_vendas).toFixed(0)} Kz`} color={C.success} />
          <StatCard icon="food" label="Ticket Médio" value={`${(r.pedidos || []).length > 0 ? (Number(r.total_vendas) / (r.pedidos || []).length).toFixed(0) : 0} Kz`} color={C.blue} />
        </div>
        <Card style={{ padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: C.textMain }}>Detalhe dos Pedidos</h3>
          {(r.pedidos || []).length === 0 ? <p style={{ color: C.textSub, textAlign: "center", padding: 20 }}>Sem pedidos</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(r.pedidos || []).map((p, pi) => (
                <div key={pi} style={{ background: C.surface2, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
                    <div><p style={{ margin: 0, fontWeight: 700, color: C.textMain }}>{p.customer_name || "Cliente"}</p><p style={{ margin: "2px 0 0", fontSize: 12, color: C.textSub }}>Mesa {p.table_number} · {new Date(p.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</p>{p.observacoes && <p style={{ margin: "2px 0 0", fontSize: 11, color: C.blue }}>📝 {p.observacoes}</p>}</div>
                    <span style={{ fontWeight: 800, color: C.gold, fontSize: 16 }}>{Number(p.total || 0).toFixed(0)} Kz</span>
                  </div>
                  {(p.itens || []).map((item, ii) => (
                    <div key={ii} style={{ padding: "8px 16px", display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.border}20` }}>
                      <span style={{ fontSize: 13, color: C.textSub }}>{item.quantity}× {item.item_name}</span>
                      <span style={{ fontSize: 13, color: C.textMain, fontWeight: 600 }}>{Number(item.subtotal).toFixed(0)} Kz</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", background: `linear-gradient(135deg, ${C.gold}20, ${C.orange}10)`, borderRadius: 12, border: `1px solid ${C.gold}30` }}>
                <span style={{ fontWeight: 800, color: C.textMain, fontSize: 16 }}>TOTAL DO DIA</span>
                <span style={{ fontWeight: 900, color: C.gold, fontSize: 20 }}>{Number(r.total_vendas).toFixed(0)} Kz</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Relatórios Diários" subtitle="Arquivo de vendas por dia" restaurant={restaurant} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}><Btn variant="outline" icon="report" onClick={gerarManual}>Gerar relatórios agora</Btn></div>
      {loading ? <Spinner /> : relatorios.length === 0 ? <Card style={{ padding: 60, textAlign: "center" }}><Icon name="report" size={40} color={C.textMuted} /><p style={{ color: C.textSub, marginTop: 12, fontWeight: 600 }}>Nenhum relatório ainda</p></Card> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {relatorios.map(r => (
            <Card key={r.id}>
              <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><p style={{ margin: "0 0 4px", fontWeight: 800, color: C.textMain, fontSize: 15, textTransform: "capitalize" }}>{formatDate(r.data_relatorio)}</p>
                  <div style={{ display: "flex", gap: 16 }}><span style={{ fontSize: 13, color: C.textSub }}><span style={{ color: C.gold, fontWeight: 700 }}>{r.total_pedidos}</span> pedidos</span><span style={{ fontSize: 13, color: C.textSub }}>Total: <span style={{ color: C.success, fontWeight: 700 }}>{Number(r.total_vendas).toFixed(0)} Kz</span></span></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.gold }}>{Number(r.total_vendas).toFixed(0)} Kz</p>
                  <Btn variant="blue" size="sm" icon="eye" onClick={() => setViewing(r)}>Ver</Btn>
                  <Btn variant="dark" size="sm" icon="download" onClick={() => gerarPDF(r, restaurant.nome, formatDate(r.data_relatorio))}>PDF</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuTab({ restaurant, showToast }) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image_url: "", available: true });
  const load = useCallback(async () => {
    if (!restaurant) return; setLoading(true);
    try { const d = await sbFetch(`menu_itens?restaurant_id=eq.${restaurant.id}&select=*&order=created_at.desc`); setItems(d || []); }
    catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  }, [restaurant]);
  useEffect(() => { load(); }, [load]);
  const save = async () => {
    if (!form.name || !form.price) return showToast("Nome e preço obrigatórios", "error");
    try {
      const body = { ...form, price: Number(form.price), restaurant_id: restaurant.id };
      if (editing) await sbFetch(`menu_itens?id=eq.${editing.id}`, { method: "PATCH", body: JSON.stringify(body) });
      else await sbFetch("menu_itens", { method: "POST", body: JSON.stringify(body) });
      showToast(editing ? "Atualizado!" : "Criado!"); setShowForm(false); setEditing(null); setForm({ name: "", description: "", price: "", category: "", image_url: "", available: true }); load();
    } catch (e) { showToast(e.message, "error"); }
  };
  const del = async (id) => {
    if (!confirm("Eliminar?")) return;
    try { await sbFetch(`menu_itens?id=eq.${id}`, { method: "DELETE" }); showToast("Eliminado!"); load(); } catch (e) { showToast(e.message, "error"); }
  };
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Menu" subtitle={`${items.length} item(ns)`} restaurant={restaurant} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}><Btn variant="primary" icon="plus" onClick={() => { setEditing(null); setForm({ name: "", description: "", price: "", category: "", image_url: "", available: true }); setShowForm(true); }}>Novo Item</Btn></div>
      {showForm && (
        <Card style={{ padding: 26, marginBottom: 22 }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: C.textMain }}>{editing ? "Editar Item" : "Novo Item"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Input label="Nome" value={form.name} onChange={f("name")} placeholder="Ex: Frango Grelhado" />
            <Input label="Preço (Kz)" value={form.price} onChange={f("price")} placeholder="0" type="number" />
            <Input label="Categoria" value={form.category} onChange={f("category")} placeholder="Ex: Pratos Principais" />
            <Input label="URL da Imagem" value={form.image_url} onChange={f("image_url")} placeholder="https://..." />
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Descrição</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descrição..." style={{ width: "100%", padding: 12, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.surface2, color: C.textMain, fontSize: 14, fontFamily: "Inter, sans-serif", resize: "vertical", minHeight: 80, boxSizing: "border-box" }} />
            </div>
            {form.image_url && (
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Pré-visualização</label>
                <div style={{ width: "100%", maxWidth: 320, height: 180, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface2 }}>
                  <img src={form.image_url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} onError={e => e.target.style.display = "none"} />
                </div>
              </div>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}><input type="checkbox" checked={form.available} onChange={e => setForm(p => ({ ...p, available: e.target.checked }))} /><span style={{ color: C.textSub, fontSize: 13 }}>Disponível</span></label>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}><Btn variant="primary" onClick={save}>Guardar</Btn><Btn variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancelar</Btn></div>
        </Card>
      )}
      {loading ? <Spinner /> : items.length === 0 ? <Card style={{ padding: 60, textAlign: "center" }}><Icon name="food" size={36} color={C.textMuted} /><p style={{ color: C.textSub, marginTop: 12 }}>Nenhum item</p></Card> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
          {items.map(item => (
            <Card key={item.id} style={{ overflow: "hidden" }}>
              {/* ✅ Imagem com tamanho fixo e sem cortes */}
              <div style={{ width: "100%", height: 160, overflow: "hidden", background: C.surface2, position: "relative", flexShrink: 0 }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                ) : null}
                <div style={{ width: "100%", height: "100%", display: item.image_url ? "none" : "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: 0, left: 0 }}>
                  <Icon name="food" size={36} color={C.textMuted} />
                </div>
                <div style={{ position: "absolute", top: 10, right: 10 }}><Badge color={item.available ? C.success : C.danger}>{item.available ? "Disponível" : "Indisponível"}</Badge></div>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: C.textMain }}>{item.name}</h3>
                {item.description && <p style={{ margin: "0 0 8px", fontSize: 13, color: C.textSub, lineHeight: 1.5 }}>{item.description}</p>}
                {item.category && <p style={{ margin: "0 0 10px", fontSize: 12, color: C.gold, display: "flex", alignItems: "center", gap: 4 }}><Icon name="tag" size={11} color={C.gold} />{item.category}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: C.gold }}>{Number(item.price).toFixed(0)} Kz</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="dark" size="sm" onClick={() => { setEditing(item); setForm({ name: item.name, description: item.description || "", price: item.price, category: item.category || "", image_url: item.image_url || "", available: item.available ?? true }); setShowForm(true); }}><Icon name="edit" size={13} color={C.textSub} /></Btn>
                    <Btn variant="danger" size="sm" onClick={() => del(item.id)}><Icon name="trash" size={13} color={C.danger} /></Btn>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoriesTab({ restaurant, showToast }) {
  const [cats, setCats] = useState([]); const [loading, setLoading] = useState(true);
  const [name, setName] = useState(""); const [desc, setDesc] = useState(""); const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    if (!restaurant) return; setLoading(true);
    try { const c = await sbFetch(`categories?restaurant_id=eq.${restaurant.id}&select=*&order=created_at.desc`); setCats(c || []); } catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  }, [restaurant]);
  useEffect(() => { load(); }, [load]);
  const save = async () => {
    if (!name) return showToast("Nome obrigatório", "error"); setSaving(true);
    try { await sbFetch("categories", { method: "POST", body: JSON.stringify({ name, description: desc, restaurant_id: restaurant.id }) }); showToast("Criada!"); setName(""); setDesc(""); load(); } catch (e) { showToast(e.message, "error"); } finally { setSaving(false); }
  };
  const del = async (id) => {
    if (!confirm("Eliminar?")) return;
    try { await sbFetch(`categories?id=eq.${id}`, { method: "DELETE" }); showToast("Eliminada!"); load(); } catch (e) { showToast(e.message, "error"); }
  };
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Categorias" subtitle={`${cats.length} categoria(s)`} restaurant={restaurant} />
      <Card style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.textMain }}>Nova Categoria</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><Input label="Nome" value={name} onChange={setName} placeholder="Ex: Entradas" /><Input label="Descrição" value={desc} onChange={setDesc} placeholder="Opcional" /></div>
        <Btn variant="primary" icon="plus" onClick={save} disabled={saving} style={{ marginTop: 14 }}>{saving ? "A guardar..." : "Criar Categoria"}</Btn>
      </Card>
      {loading ? <Spinner /> : cats.length === 0 ? <Card style={{ padding: 60, textAlign: "center" }}><Icon name="category" size={34} color={C.textMuted} /><p style={{ color: C.textSub, marginTop: 12 }}>Nenhuma categoria</p></Card> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cats.map(c => (
            <Card key={c.id} style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: C.gold + "15", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="tag" size={15} color={C.gold} /></div>
                <div><p style={{ margin: 0, fontWeight: 600, color: C.textMain, fontSize: 14 }}>{c.name}</p>{c.description && <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textSub }}>{c.description}</p>}</div>
              </div>
              <Btn variant="danger" size="sm" onClick={() => del(c.id)}><Icon name="trash" size={13} color={C.danger} /></Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MesasTab({ restaurant, showToast }) {
  const [mesas, setMesas] = useState([]); const [loading, setLoading] = useState(true);
  const [num, setNum] = useState(""); const [cap, setCap] = useState(""); const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    if (!restaurant) return; setLoading(true);
    try { const m = await sbFetch(`mesas?restaurant_id=eq.${restaurant.id}&select=*&order=table_number.asc`); setMesas(m || []); } catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  }, [restaurant]);
  useEffect(() => { load(); }, [load]);
  const save = async () => {
    if (!num) return showToast("Número obrigatório", "error"); setSaving(true);
    try { await sbFetch("mesas", { method: "POST", body: JSON.stringify({ table_number: Number(num), capacity: Number(cap) || 4, status: "free", restaurant_id: restaurant.id }) }); showToast("Mesa criada!"); setNum(""); setCap(""); load(); } catch (e) { showToast(e.message, "error"); } finally { setSaving(false); }
  };
  const toggle = async (m) => { try { await sbFetch(`mesas?id=eq.${m.id}`, { method: "PATCH", body: JSON.stringify({ status: m.status === "free" ? "occupied" : "free" }) }); load(); } catch (e) { showToast(e.message, "error"); } };
  const del = async (id) => { if (!confirm("Eliminar?")) return; try { await sbFetch(`mesas?id=eq.${id}`, { method: "DELETE" }); showToast("Eliminada!"); load(); } catch (e) { showToast(e.message, "error"); } };
  const sColor = s => s === "free" ? C.success : s === "occupied" ? C.danger : C.orange;
  const sLabel = s => s === "free" ? "Livre" : s === "occupied" ? "Ocupada" : "Reservada";
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Mesas" subtitle={`${mesas.length} mesa(s)`} restaurant={restaurant} />
      <Card style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.textMain }}>Nova Mesa</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><Input label="Número" value={num} onChange={setNum} placeholder="Ex: 1" type="number" /><Input label="Capacidade" value={cap} onChange={setCap} placeholder="Ex: 4" type="number" /></div>
        <Btn variant="primary" icon="plus" onClick={save} disabled={saving} style={{ marginTop: 14 }}>{saving ? "A guardar..." : "Criar Mesa"}</Btn>
      </Card>
      {loading ? <Spinner /> : mesas.length === 0 ? <Card style={{ padding: 60, textAlign: "center" }}><Icon name="chair" size={34} color={C.textMuted} /><p style={{ color: C.textSub, marginTop: 12 }}>Nenhuma mesa</p></Card> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {mesas.map(m => (
            <Card key={m.id} style={{ padding: 18, textAlign: "center", border: `1px solid ${sColor(m.status)}25` }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: sColor(m.status) + "15", border: `1px solid ${sColor(m.status)}25`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><Icon name="chair" size={20} color={sColor(m.status)} /></div>
              <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 16, color: C.textMain }}>Mesa {m.table_number}</p>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: C.textSub }}>👥 {m.capacity}</p>
              <Badge color={sColor(m.status)}>{sLabel(m.status)}</Badge>
              <div style={{ display: "flex", gap: 6, marginTop: 12, justifyContent: "center" }}>
                <Btn variant="dark" size="sm" onClick={() => toggle(m)} style={{ fontSize: 11 }}>🔄</Btn>
                <Btn variant="danger" size="sm" onClick={() => del(m.id)}><Icon name="trash" size={12} color={C.danger} /></Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab({ restaurant, showToast, onPendingCount }) {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); const [expandedId, setExpandedId] = useState(null); const [orderItems, setOrderItems] = useState({});
  const load = useCallback(async () => {
    if (!restaurant) return; setLoading(true);
    try { const o = await sbFetch(`orders?restaurant_id=eq.${restaurant.id}&select=*&order=created_at.desc`); setOrders(o || []); onPendingCount?.((o || []).filter(x => x.status === "pending").length); } catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  }, [restaurant]);
  useEffect(() => { load(); const i = setInterval(load, 8000); return () => clearInterval(i); }, [load]);
  const loadItems = async (orderId) => {
    if (expandedId === orderId) { setExpandedId(null); return; }
    try { if (!orderItems[orderId]) { const items = await sbFetch(`orders_itens?order_id=eq.${orderId}&select=*`); setOrderItems(prev => ({ ...prev, [orderId]: items || [] })); } setExpandedId(orderId); } catch (e) { showToast(e.message, "error"); }
  };
  const update = async (id, status) => { try { await sbFetch(`orders?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); showToast("Atualizado!"); load(); } catch (e) { showToast(e.message, "error"); } };
  const sColor = s => s === "completed" ? C.success : s === "pending" ? C.orange : s === "cancelled" ? C.danger : C.blue;
  const sLabel = s => s === "completed" ? "Concluído" : s === "pending" ? "Pendente" : s === "cancelled" ? "Cancelado" : "Em preparação";
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Pedidos" subtitle={`${filtered.length} pedido(s) — últimas 24h`} restaurant={restaurant} pendingCount={pendingCount} />
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {["all", "pending", "preparing", "completed", "cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter === f ? C.gold : C.border}`, background: filter === f ? C.gold + "15" : "transparent", color: filter === f ? C.gold : C.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            {f === "all" ? "Todos" : f === "pending" ? `Pendentes${pendingCount > 0 ? ` (${pendingCount})` : ""}` : f === "preparing" ? "Em preparação" : f === "completed" ? "Concluídos" : "Cancelados"}
          </button>
        ))}
      </div>
      {loading ? <Spinner /> : filtered.length === 0 ? <Card style={{ padding: 60, textAlign: "center" }}><Icon name="orders" size={34} color={C.textMuted} /><p style={{ color: C.textSub, marginTop: 12 }}>Nenhum pedido nas últimas 24h</p><p style={{ color: C.textMuted, fontSize: 12, marginTop: 6 }}>Pedidos mais antigos estão em Arquivo de Pedidos</p></Card> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(o => (
            <Card key={o.id} style={{ padding: 18, border: o.status === "pending" ? `1px solid ${C.orange}50` : `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                    <p style={{ margin: 0, fontWeight: 700, color: C.textMain, fontSize: 14 }}>{o.customer_name || "Cliente"}</p>
                    <Badge color={sColor(o.status)}>{sLabel(o.status)}</Badge>
                    {o.payment_method && <Badge color={C.blue}>{o.payment_method === "cash" ? "💵 Cash" : "💳 Cartão"}</Badge>}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: C.textSub }}>Mesa {o.table_number} · {new Date(o.created_at).toLocaleDateString("pt-PT")} {new Date(o.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</p>
                  {o.observacoes && <p style={{ margin: "3px 0 0", fontSize: 12, color: C.blue }}>📝 {o.observacoes}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: C.gold }}>{Number(o.total || 0).toFixed(0)} Kz</p>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <button onClick={() => loadItems(o.id)} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: expandedId === o.id ? C.gold + "20" : C.surface2, color: expandedId === o.id ? C.gold : C.textSub, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>{expandedId === o.id ? "▲ Fechar" : "▼ Ver itens"}</button>
                    {o.status === "pending" && <Btn variant="success" size="sm" onClick={() => update(o.id, "preparing")}>✓ Validar</Btn>}
                    {o.status === "preparing" && <Btn variant="primary" size="sm" onClick={() => update(o.id, "completed")}>✓ Pronto</Btn>}
                    {(o.status === "pending" || o.status === "preparing") && <Btn variant="danger" size="sm" onClick={() => update(o.id, "cancelled")}><Icon name="trash" size={12} color={C.danger} /></Btn>}
                  </div>
                </div>
              </div>
              {expandedId === o.id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, animation: "fadeIn .2s ease" }}>
                  {(orderItems[o.id] || []).length === 0 ? <p style={{ color: C.textMuted, fontSize: 13 }}>Sem itens</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(orderItems[o.id] || []).map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.surface2, borderRadius: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 26, height: 26, borderRadius: 6, background: C.gold + "20", color: C.gold, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.quantity}×</span><span style={{ fontSize: 14, fontWeight: 600, color: C.textMain }}>{item.item_name}</span></div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{Number(item.subtotal).toFixed(0)} Kz</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderTop: `1px solid ${C.border}`, marginTop: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.textSub }}>Total</span>
                        <span style={{ fontSize: 15, fontWeight: 900, color: C.gold }}>{Number(o.total).toFixed(0)} Kz</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function WaitersTab({ restaurant, showToast, onCountChange }) {
  const [calls, setCalls] = useState([]); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (!restaurant) return; setLoading(true);
    try { const c = await sbFetch(`chamadas_garcom?restaurant_id=eq.${restaurant.id}&select=*&order=created_at.desc&limit=30`); setCalls(c || []); onCountChange?.((c || []).filter(x => x.status === "pendente").length); }
    catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  }, [restaurant]);
  useEffect(() => { load(); const i = setInterval(load, 6000); return () => clearInterval(i); }, [load]);
  const resolve = async (id) => { try { await sbFetch(`chamadas_garcom?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ status: "atendido" }) }); showToast("Marcado como atendido!"); load(); } catch (e) { showToast(e.message, "error"); } };
  const pendentes = calls.filter(c => c.status === "pendente");
  const atendidas = calls.filter(c => c.status === "atendido");
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Chamadas de Atendente" subtitle={`${pendentes.length} pendente(s) · apagadas após 24h`} restaurant={restaurant} />
      {loading ? <Spinner /> : <>
        {pendentes.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: C.danger, textTransform: "uppercase", letterSpacing: 1 }}>Pendentes</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendentes.map(c => (
                <Card key={c.id} style={{ padding: 18, border: `1px solid ${C.danger}50` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: C.danger + "20", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.5s infinite" }}><Icon name="handBell" size={20} color={C.danger} /></div>
                      <div><p style={{ margin: 0, fontWeight: 800, color: C.textMain, fontSize: 16 }}>Mesa {c.table_number}</p><p style={{ margin: "2px 0 0", fontSize: 12, color: C.textSub }}>{new Date(c.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</p></div>
                    </div>
                    <Btn variant="success" icon="check" onClick={() => resolve(c.id)}>Marcar atendido</Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        <div>
          <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: 1 }}>Histórico (últimas 24h)</h3>
          {atendidas.length === 0 ? <Card style={{ padding: 40, textAlign: "center" }}><p style={{ color: C.textSub }}>Nenhuma chamada atendida ainda</p></Card> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {atendidas.map(c => (
                <Card key={c.id} style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontWeight: 600, color: C.textSub, fontSize: 13 }}>Mesa {c.table_number} · {new Date(c.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</p>
                    <Badge color={C.success}>Atendido</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </>}
    </div>
  );
}

function RestaurantTab({ restaurant, user, showToast, onSaved }) {
  const [form, setForm] = useState({ nome: restaurant?.nome || "", bio: restaurant?.bio || "", city: restaurant?.city || "", phone: restaurant?.phone || "", email: restaurant?.email || "", avata_url: restaurant?.avata_url || "", whatsapp: restaurant?.whatsapp || "", instagram: restaurant?.instagram || "", facebook: restaurant?.facebook || "" });
  const [saving, setSaving] = useState(false);
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const save = async () => {
    setSaving(true);
    try {
      if (restaurant) await sbFetch(`Restaurants?id=eq.${restaurant.id}`, { method: "PATCH", body: JSON.stringify(form) });
      else await sbFetch("Restaurants", { method: "POST", body: JSON.stringify({ ...form, user_id: user.id }) });
      showToast("Guardado!"); onSaved();
    } catch (e) { showToast(e.message, "error"); } finally { setSaving(false); }
  };
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <Topbar title="Restaurante" subtitle="Configurações e informações" restaurant={restaurant} />
      <Card style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 22, borderBottom: `1px solid ${C.border}` }}>
          {/* ✅ Avatar com tamanho fixo */}
          <div style={{ width: 72, height: 72, borderRadius: 16, overflow: "hidden", border: `2px solid ${C.border}`, flexShrink: 0, background: C.surface2 }}>
            {form.avata_url ? (
              <img src={form.avata_url} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} onError={e => { e.target.style.display = "none"; }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="fork" size={30} color="#0B0D12" /></div>
            )}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textMain }}>{form.nome || "Nome do Restaurante"}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textSub }}>{form.city}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="Nome" value={form.nome} onChange={f("nome")} placeholder="Nome do restaurante" />
          <Input label="Cidade" value={form.city} onChange={f("city")} placeholder="Ex: Luanda" />
          <Input label="Telefone" value={form.phone} onChange={f("phone")} placeholder="+244 ..." />
          <Input label="Email" value={form.email} onChange={f("email")} placeholder="email@restaurante.com" type="email" />
          <Input label="WhatsApp" value={form.whatsapp} onChange={f("whatsapp")} placeholder="244999999999" />
          <Input label="Instagram (@usuario)" value={form.instagram} onChange={f("instagram")} placeholder="@meurestaurante" />
          <div style={{ gridColumn: "1/-1" }}><Input label="Facebook (URL)" value={form.facebook} onChange={f("facebook")} placeholder="https://facebook.com/..." /></div>
          <div style={{ gridColumn: "1/-1" }}>
            <Input label="URL do Logótipo" value={form.avata_url} onChange={f("avata_url")} placeholder="https://..." />
            {form.avata_url && (
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface2 }}>
                  <img src={form.avata_url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} onError={e => e.target.style.display = "none"} />
                </div>
                <p style={{ fontSize: 12, color: C.textSub }}>Pré-visualização do logótipo</p>
              </div>
            )}
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: C.textSub, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Bio / Descrição</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Descreva o seu restaurante..." style={{ width: "100%", padding: 12, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.surface2, color: C.textMain, fontSize: 14, fontFamily: "Inter, sans-serif", resize: "vertical", minHeight: 90, boxSizing: "border-box" }} />
          </div>
        </div>
        <Btn variant="primary" onClick={save} disabled={saving} style={{ marginTop: 20 }}>{saving ? "A guardar..." : "Guardar Alterações"}</Btn>
      </Card>
    </div>
  );
}

function AuthPage({ onLogin, showToast }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!email || !password) return showToast("Preencha todos os campos", "error");
    setLoading(true);
    try {
      if (mode === "login") { const d = await sbAuth("token?grant_type=password", { email, password }); onLogin(d.access_token, d.user); }
      else { await sbAuth("signup", { email, password, data: { full_name: name } }); showToast("Conta criada! Verifique o email."); setMode("login"); }
    } catch (e) { showToast(e.message, "error"); } finally { setLoading(false); }
  };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${C.gold}07, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}><Logo size="lg" /><p style={{ margin: "10px 0 0", color: C.textSub, fontSize: 14 }}>Plataforma de gestão para restaurantes</p></div>
        <Card style={{ padding: 32 }}>
          <h2 style={{ margin: "0 0 22px", fontSize: 18, fontWeight: 700, color: C.textMain }}>{mode === "login" ? "Bem-vindo de volta" : "Criar conta"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "register" && <Input label="Nome completo" value={name} onChange={setName} placeholder="O seu nome" />}
            <Input label="Email" value={email} onChange={setEmail} placeholder="email@exemplo.com" type="email" />
            <Input label="Senha" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
            <Btn variant="primary" size="lg" onClick={submit} disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}</Btn>
          </div>
          <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: C.textSub }}>
            {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ color: C.gold, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>{mode === "login" ? "Registar" : "Entrar"}</button>
          </p>
        </Card>
      </div>
    </div>
  );
}

function SetupPage({ user, onCreated, showToast }) {
  const [nome, setNome] = useState(""); const [city, setCity] = useState(""); const [saving, setSaving] = useState(false);
  const create = async () => {
    if (!nome) return showToast("Nome obrigatório", "error"); setSaving(true);
    try { await sbFetch("Restaurants", { method: "POST", body: JSON.stringify({ nome, city, user_id: user.id }) }); showToast("Criado!"); onCreated(); } catch (e) { showToast(e.message, "error"); } finally { setSaving(false); }
  };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}><Logo size="lg" /></div>
        <Card style={{ padding: 32 }}>
          <h2 style={{ margin: "0 0 22px", fontSize: 18, fontWeight: 700, color: C.textMain }}>Criar Restaurante</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Nome" value={nome} onChange={setNome} placeholder="Ex: Restaurante Boa Mesa" />
            <Input label="Cidade" value={city} onChange={setCity} placeholder="Ex: Luanda" />
            <Btn variant="primary" size="lg" onClick={create} disabled={saving} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>{saving ? "A criar..." : "Criar Restaurante"}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null); const [restaurant, setRestaurant] = useState(null);
  const [tab, setTab] = useState("dashboard"); const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true); const [pendingCount, setPendingCount] = useState(0);
  const [waiterCount, setWaiterCount] = useState(0); const [liveNotifications, setLiveNotifications] = useState([]);
  const prevScansRef = useState({})[0]; const prevWaiterIdsRef = useState(new Set())[0];

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type, key: Date.now() }), []);

  const checkMesaScans = useCallback(async (rest) => {
    if (!rest) return;
    try {
      const mesas = await sbFetch(`mesas?restaurant_id=eq.${rest.id}&select=id,table_number,last_scan&last_scan=not.is.null`);
      if (!mesas) return;
      for (const m of mesas) {
        if (!m.last_scan) continue;
        const prev = prevScansRef[m.id];
        if (prev !== m.last_scan) {
          prevScansRef[m.id] = m.last_scan;
          if (prev !== undefined) {
            const hora = new Date(m.last_scan).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
            const id = Date.now() + Math.random();
            setLiveNotifications(n => [...n, { id, type: "scan", mesa: m.table_number, hora }]);
            setTimeout(() => setLiveNotifications(n => n.filter(x => x.id !== id)), 8000);
          }
        }
      }
    } catch (e) { console.error(e); }
  }, []);

  const checkWaiterCalls = useCallback(async (rest) => {
    if (!rest) return;
    try {
      const calls = await sbFetch(`chamadas_garcom?restaurant_id=eq.${rest.id}&status=eq.pendente&select=*&order=created_at.desc`);
      setWaiterCount((calls || []).length);
      for (const c of calls || []) {
        if (!prevWaiterIdsRef.has(c.id)) {
          prevWaiterIdsRef.add(c.id);
          const hora = new Date(c.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
          const id = Date.now() + Math.random();
          setLiveNotifications(n => [...n, { id, type: "waiter", mesa: c.table_number, hora }]);
          setTimeout(() => setLiveNotifications(n => n.filter(x => x.id !== id)), 10000);
        }
      }
    } catch (e) { console.error(e); }
  }, []);

  const loadRestaurant = useCallback(async (u) => {
    if (!u) return;
    try {
      const r = await sbFetch(`Restaurants?user_id=eq.${u.id}&select=*&limit=1`);
      setRestaurant(r?.[0] || null);
      if (r?.[0]) {
        await arquivarPedidosAnteriores(r[0].id);
        await arquivarPedidosDiarios(r[0].id);
        await limparChamadasAntigas(r[0].id);
        await checkMesaScans(r[0]);
        await checkWaiterCalls(r[0]);
      }
    } catch (e) { console.error(e); }
  }, [checkMesaScans, checkWaiterCalls]);

  const handleLogin = async (token, u) => { setUser(u); try { localStorage.setItem("ff_token", token); } catch (e) {} await loadRestaurant(u); };
  const handleLogout = () => { setUser(null); setRestaurant(null); setPendingCount(0); setWaiterCount(0); try { localStorage.removeItem("ff_token"); } catch (e) {} };

  useEffect(() => {
    (async () => {
      try { const t = localStorage.getItem("ff_token"); if (t) { const u = await sbMe(t); if (u?.id) { setUser(u); await loadRestaurant(u); } else localStorage.removeItem("ff_token"); } } catch (e) {} finally { setLoading(false); }
    })();
  }, [loadRestaurant]);

  useEffect(() => {
    if (!restaurant) return;
    const i = setInterval(() => { checkMesaScans(restaurant); checkWaiterCalls(restaurant); }, 8000);
    return () => clearInterval(i);
  }, [restaurant, checkMesaScans, checkWaiterCalls]);

  if (loading) return <><style>{FONTS}</style><div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div></>;
  if (!user) return <><style>{FONTS}</style><AuthPage onLogin={handleLogin} showToast={showToast} />{toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</>;
  if (!restaurant) return <><style>{FONTS}</style><SetupPage user={user} onCreated={() => loadRestaurant(user)} showToast={showToast} />{toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</>;

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ fontFamily: "Inter, sans-serif", background: C.bg, minHeight: "100vh", color: C.textMain }}>
        <Sidebar tab={tab} setTab={setTab} restaurant={restaurant} onLogout={handleLogout} pendingCount={pendingCount} waiterCount={waiterCount} />
        <main style={{ marginLeft: 210, padding: "32px 36px", minHeight: "100vh" }}>
          {tab === "dashboard" && <DashboardTab restaurant={restaurant} pendingCount={pendingCount} waiterCount={waiterCount} />}
          {tab === "menu" && <MenuTab restaurant={restaurant} showToast={showToast} />}
          {tab === "categories" && <CategoriesTab restaurant={restaurant} showToast={showToast} />}
          {tab === "mesas" && <MesasTab restaurant={restaurant} showToast={showToast} />}
          {tab === "orders" && <OrdersTab restaurant={restaurant} showToast={showToast} onPendingCount={setPendingCount} />}
          {tab === "waiters" && <WaitersTab restaurant={restaurant} showToast={showToast} onCountChange={setWaiterCount} />}
          {tab === "relatorios" && <RelatoriosTab restaurant={restaurant} showToast={showToast} />}
          {tab === "arquivo-pedidos" && <ArquivoPedidosTab restaurant={restaurant} showToast={showToast} />}
          {tab === "arquivo-relatorios" && <ArquivoRelatoriosTab restaurant={restaurant} showToast={showToast} />}
          {tab === "restaurant" && <RestaurantTab restaurant={restaurant} user={user} showToast={showToast} onSaved={() => loadRestaurant(user)} />}
        </main>
        <LiveNotifications notifications={liveNotifications} onDismiss={id => setLiveNotifications(n => n.filter(x => x.id !== id))} />
        {toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}