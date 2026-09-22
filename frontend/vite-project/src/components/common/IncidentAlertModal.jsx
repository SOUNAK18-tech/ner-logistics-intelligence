/**
 * IncidentAlertModal.jsx — live alert toast
 *
 * Behaviour
 *  1. When the site opens, the latest unacknowledged alert is shown once.
 *  2. Whenever a new incident is reported OR an admin/officer sends an alert message,
 *     the toast appears instantly (via Socket.IO) with a ping sound.
 *  3. The toast starts SMALL. Click it to read the full text.
 *  4. If you don't touch it, it fades out (transparent) after COLLAPSED_MS.
 *     Hovering pauses the fade. An expanded toast stays until you close it.
 *
 * Tweak the timings here:
 */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, X, ArrowRight, MessageSquare, ChevronDown } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { alertsAPI, auth } from '../../services/api';

const OPEN_DELAY_MS   = 1200;  // wait after page load before showing the "latest alert"
const COLLAPSED_MS    = 6000;  // how long the small toast stays fully visible
const FADE_MS         = 900;   // length of the fade-out

// ── Sound ───────────────────────────────────────────────────────────────────
// Browsers block audio until the user has clicked/tapped/typed on the page at least once.
// We try to play immediately; if blocked, the ping is played on the very next interaction.
let _ctx = null;
let _pendingPing = false;

const beep = (ctx) => {
  const now = ctx.currentTime;
  [[880, 1320, 0], [1174, 1760, 0.22]].forEach(([f0, f1, off]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, now + off);
    osc.frequency.exponentialRampToValueAtTime(f1, now + off + 0.14);
    gain.gain.setValueAtTime(0.25, now + off);
    gain.gain.exponentialRampToValueAtTime(0.01, now + off + 0.22);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now + off); osc.stop(now + off + 0.25);
  });
};

const playPing = () => {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!_ctx) _ctx = new AC();
    if (_ctx.state === 'running') { beep(_ctx); return; }
    _ctx.resume().then(() => {
      if (_ctx.state === 'running') beep(_ctx); else armPendingPing();
    }).catch(armPendingPing);
  } catch { /* audio unsupported */ }
};

const armPendingPing = () => {
  if (_pendingPing) return;
  _pendingPing = true;
  const fire = () => {
    _pendingPing = false;
    ['pointerdown', 'keydown', 'touchstart'].forEach(e => window.removeEventListener(e, fire));
    try { _ctx?.resume().then(() => beep(_ctx)); } catch { /* ignore */ }
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach(e => window.addEventListener(e, fire, { once: true }));
};

// ── Normalise anything the backend sends into one shape ─────────────────────
const toToast = (data, kind) => {
  const id = String(data._id || data.id || `t-${Date.now()}`);
  const time = new Date(data.createdAt || Date.now())
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Plain alert / message sent by an admin or officer (has no road_segment)
  if (kind === 'message') {
    const from = data.createdBy || 'Control Room';
    return {
      id, kind, time,
      title: `Message from ${from}`,
      severity: (data.severity || 'HIGH').toUpperCase(),
      district: data.district || '',
      text: data.message || 'New alert',
      regional: data.regionalMessage || '',
      lat: null, lon: null,
    };
  }

  // Road incident reported by a field officer
  const type = (data.incident_type || data.type || 'Hazard').replace(/_/g, ' ').toUpperCase();
  const road = data.road_name || data.road_segment_id?.road_name || 'NER Corridor';
  const district = data.district || data.road_segment_id?.district || '';
  const geo = data.location?.coordinates;
  let lat = Array.isArray(geo) ? parseFloat(geo[1]) : parseFloat(data.latitude ?? data.lat);
  let lon = Array.isArray(geo) ? parseFloat(geo[0]) : parseFloat(data.longitude ?? data.lon);
  if (!isFinite(lat) || !isFinite(lon) || lat === 0 || lon === 0) { lat = null; lon = null; }

  return {
    id, kind: 'incident', time,
    title: type,
    severity: (data.road_block === 'full' ? 'CRITICAL' : data.road_block === 'partial' ? 'HIGH' : 'MODERATE'),
    road, district,
    blockage: (data.road_block || '').toLowerCase(),
    officer: data.field_officer_name || data.createdBy || 'Field Officer',
    slope: data.slope ?? data.slope_deg,
    rain: data.rainfall_mm,
    text: data.description || data.message || `Road hazard reported on ${road}.`,
    lat, lon,
  };
};

let _shownOnOpen = false; // once per page load

export const IncidentAlertModal = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const show = useCallback((t) => {
    setToast(t); setExpanded(false); setFading(false); setPaused(false);
    playPing();
    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      try { new Notification(`🚨 ${t.title}`, { body: t.text, icon: '/favicon.svg', tag: 'sih-alert' }); } catch { /* ignore */ }
    }
  }, []);

  const close = useCallback(() => { setToast(null); setExpanded(false); setFading(false); }, []);

  // Ask for desktop-notification permission (used when the tab is in the background)
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // 1) Show the latest unacknowledged alert once when the site opens
  useEffect(() => {
    if (_shownOnOpen) return;
    _shownOnOpen = true;
    const t = setTimeout(async () => {
      try {
        const list = await alertsAPI.getAll('acknowledged=false');
        const latest = Array.isArray(list) ? list[0] : null;
        if (latest) show(toToast(latest, latest.type === 'INCIDENT' ? 'incident' : 'message'));
      } catch { /* backend asleep or unreachable — stay silent */ }
    }, OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, [show]);

  // 2) Live events
  useEffect(() => {
    const s = socket?.current || socket;
    if (!s || typeof s.on !== 'function') return;

    const onIncident = (d) => d && show(toToast(d, 'incident'));
    // road-incident reports ALSO create an Alert (type INCIDENT) → skip it, incident_created already covers it
    const onAlert = (d) => { if (d && d.type !== 'INCIDENT') show(toToast(d, 'message')); };

    // Chat text from an admin / officer (skip our own messages and when the Chat page is open)
    const onChat = ({ message: m } = {}) => {
      if (!m || window.location.pathname.startsWith('/chat')) return;
      const me = auth.getUser() || {};
      const mine = [me.id, me._id, me.userId].filter(Boolean).map(String);
      if (mine.includes(String(m.senderId))) return;
      show(toToast({
        _id: m._id, createdAt: m.createdAt, createdBy: m.senderName,
        message: m.text || '📷 Photo attached', severity: 'MODERATE',
      }, 'message'));
    };

    s.on('incident_created', onIncident);
    s.on('alert_created', onAlert);
    s.on('new_chat_message', onChat);
    const onLocal = (e) => e.detail && onIncident(e.detail);
    window.addEventListener('incident_created', onLocal);
    window.addEventListener('incident_reported', onLocal);
    return () => {
      s.off('incident_created', onIncident);
      s.off('alert_created', onAlert);
      s.off('new_chat_message', onChat);
      window.removeEventListener('incident_created', onLocal);
      window.removeEventListener('incident_reported', onLocal);
    };
  }, [socket, show]);

  // 3) Auto-fade (only while collapsed and not hovered)
  useEffect(() => {
    if (!toast || expanded || paused) return;
    const t1 = setTimeout(() => setFading(true), COLLAPSED_MS);
    const t2 = setTimeout(close, COLLAPSED_MS + FADE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast, expanded, paused, close]);

  if (!toast) return null;

  const isMsg = toast.kind === 'message';
  const Icon = isMsg ? MessageSquare : AlertTriangle;
  const accent = toast.severity === 'CRITICAL' ? '#dc2626' : toast.severity === 'HIGH' ? '#ea580c' : '#d97706';
  const place = isMsg ? toast.district : [toast.road, toast.district].filter(Boolean).join(' · ');

  const goToMap = () => {
    const loc = encodeURIComponent(place);
    navigate(`/planner?focusLat=${toast.lat}&focusLon=${toast.lon}&incidentId=${encodeURIComponent(toast.id)}` +
      `&incidentLoc=${loc}&incidentType=${encodeURIComponent(toast.title)}&desc=${encodeURIComponent(toast.text)}&zoom=16`);
    close();
  };

  return (
    <div
      style={{
        position: 'fixed', top: 16, right: 16, zIndex: 999999,
        width: 'calc(100vw - 32px)', maxWidth: expanded ? 360 : 320,
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(-6px)' : 'translateY(0)',
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease, max-width .2s ease`,
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={() => { setPaused(true); setFading(false); }}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        onClick={() => !expanded && setExpanded(true)}
        style={{
          background: 'var(--surface, #fff)', borderRadius: 12, overflow: 'hidden',
          borderLeft: `4px solid ${accent}`,
          boxShadow: '0 10px 28px rgba(15,23,42,0.18), 0 2px 6px rgba(15,23,42,0.08)',
          cursor: expanded ? 'default' : 'pointer',
        }}
      >
        {/* Header row — always visible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px 9px 12px' }}>
          <Icon size={16} color={accent} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--ink, #0f172a)', lineHeight: 1.2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {toast.title}
            </div>
            {!expanded && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748b)', marginTop: 1,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {place || toast.text} · <span style={{ color: accent, fontWeight: 700 }}>tap to read</span>
              </div>
            )}
          </div>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary, #94a3b8)', flexShrink: 0 }}>{toast.time}</span>
          {expanded ? (
            <button onClick={(e) => { e.stopPropagation(); close(); }} title="Close"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
              <X size={15} color="#64748b" />
            </button>
          ) : <ChevronDown size={14} color="#94a3b8" />}
        </div>

        {/* Full details — only after click */}
        {expanded && (
          <div style={{ padding: '0 12px 11px 12px' }}>
            {place && (
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: accent, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                <MapPin size={11} /> {place}
              </div>
            )}
            <div style={{ fontSize: '0.8rem', color: 'var(--ink, #1e293b)', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
              {toast.text}
            </div>
            {toast.regional && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475569)', marginTop: 6, lineHeight: 1.4 }}>
                {toast.regional}
              </div>
            )}
            {!isMsg && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8, fontSize: '0.68rem', color: 'var(--text-secondary, #64748b)' }}>
                {toast.blockage && <span>🚧 <strong>{toast.blockage}</strong> block</span>}
                {toast.slope != null && <span>🏔 <strong>{toast.slope}°</strong></span>}
                {toast.rain != null && <span>🌧 <strong>{toast.rain}mm</strong></span>}
                <span>👤 <strong>{toast.officer}</strong></span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
              {toast.lat != null ? (
                <button onClick={goToMap} style={linkBtn('#2563eb')}><MapPin size={11} /> View on map</button>
              ) : <span />}
              <button onClick={() => { close(); navigate(isMsg ? '/alerts' : '/incidents'); }} style={linkBtn('#64748b')}>
                {isMsg ? 'All alerts' : 'All incidents'} <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const linkBtn = (color) => ({
  background: 'none', border: 'none', padding: 0, cursor: 'pointer', color,
  fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3,
});
