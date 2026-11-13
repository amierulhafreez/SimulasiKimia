import { SimulationAnalytics } from '../types/simulation';

const STORAGE_KEY = 'cikguhafreez_simulasi_analytics_v1';
const ANON_UID_KEY = 'cikguhafreez_anon_visitor_uid';

const CLOUD_API_BASE = 'https://countapi.mileshilliard.com/api/v1';
const CLOUD_KEY_HOME = 'cikguhafreez_simulasi_v1_home_visits';
const CLOUD_KEY_TOTAL_CLICKS = 'cikguhafreez_simulasi_v1_total_clicks';

// Baseline counts representing initial usage records
const DEFAULT_ANALYTICS: SimulationAnalytics = {
  totalHomeVisits: 1485,
  simulations: {
    'pentitratan-asid-alkali': { views: 412, clicks: 1250, completed: 290 },
    'ujian-gas': { views: 368, clicks: 980, completed: 245 },
    'penggumpalan-lateks': { views: 295, clicks: 810, completed: 180 },
    'pemanasan-dan-penyejukkan-naftalena': { views: 340, clicks: 890, completed: 210 },
    'penyeimbangan-persamaan-kimia': { views: 490, clicks: 1420, completed: 330 },
    'penghasilan-formula-kimia': { views: 280, clicks: 640, completed: 175 },
    'kereaktifan-k1-dan-k17': { views: 260, clicks: 710, completed: 160 },
    'penghasilan-sebatian-kovalen': { views: 230, clicks: 590, completed: 140 },
    'elektrolisis': { views: 385, clicks: 1120, completed: 265 },
    'keterlarutan-garam': { views: 310, clicks: 780, completed: 195 },
    'ujian-kation': { views: 345, clicks: 920, completed: 215 },
    'ujian-anion': { views: 320, clicks: 870, completed: 200 },
    'daya-tarikan-zarah': { views: 190, clicks: 450, completed: 120 },
    'penentuan-isomer': { views: 275, clicks: 760, completed: 170 },
    'formula-struktur-karbon': { views: 290, clicks: 810, completed: 185 },
    'penghasilan-sabun': { views: 240, clicks: 630, completed: 155 },
    'pencucian-sabun-detergen-air-liat': { views: 215, clicks: 580, completed: 140 },
    'haba-penyesaran': { views: 315, clicks: 840, completed: 190 },
    'haba-peneutralan': { views: 270, clicks: 720, completed: 165 },
    'haba-pemendakan': { views: 255, clicks: 690, completed: 150 },
    'penyediaan-larutan-piawai': { views: 210, clicks: 540, completed: 145 },
    'kadar-tindak-balas-saiz': { views: 235, clicks: 620, completed: 165 },
    'kadar-tindak-balas-kepekatan': { views: 220, clicks: 590, completed: 150 },
    'kadar-tindak-balas-suhu': { views: 245, clicks: 640, completed: 160 },
    'kadar-tindak-balas-mangkin': { views: 210, clicks: 530, completed: 135 },
    'keadaan-zarah-jirim': { views: 265, clicks: 710, completed: 195 },
    'pengekstrakan-besi': { views: 195, clicks: 510, completed: 135 },
    'pengekstrakan-aluminium': { views: 205, clicks: 530, completed: 140 },
    'haba-pembakaran': { views: 250, clicks: 680, completed: 175 },
    'nilai-bahan-api': { views: 220, clicks: 590, completed: 155 },
    'pengaratan-besi': { views: 205, clicks: 520, completed: 130 },
    'pengoksidaan-etanol': { views: 195, clicks: 490, completed: 125 },
    'pengesteran-alkohol-asid-karboksilik': { views: 225, clicks: 560, completed: 145 },
    'tindak-balas-alkena': { views: 185, clicks: 470, completed: 120 },
    'fermentasi-dan-penyulingan-etanol': { views: 210, clicks: 530, completed: 135 },
    'alkana-vs-alkena': { views: 190, clicks: 480, completed: 125 },
    'kekerasan-aloi-logam-tulen': { views: 230, clicks: 610, completed: 150 },
    'kekenyalan-getah-asli-tervulkan': { views: 240, clicks: 620, completed: 155 }
  }
};

function sanitizeKey(simId: string): string {
  return simId.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
}

async function cloudHit(key: string): Promise<number | null> {
  try {
    const res = await fetch(`${CLOUD_API_BASE}/hit/${key}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const val = typeof json.value === 'number' ? json.value : parseInt(json.value, 10);
    return isNaN(val) ? null : val;
  } catch {
    return null;
  }
}

async function cloudGet(key: string): Promise<number | null> {
  try {
    const res = await fetch(`${CLOUD_API_BASE}/get/${key}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const val = typeof json.value === 'number' ? json.value : parseInt(json.value, 10);
    return isNaN(val) ? null : val;
  } catch {
    return null;
  }
}

class AnalyticsService {
  private listeners: Array<(data: SimulationAnalytics) => void> = [];
  private isSyncing = false;
  private syncTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.ensureAnonymousUid();
    this.initBackgroundSync();
  }

  // Generate or retrieve persistent anonymous device/visitor ID (no login needed)
  public ensureAnonymousUid(): string {
    if (typeof window === 'undefined') return 'server';
    try {
      let uid = localStorage.getItem(ANON_UID_KEY);
      if (!uid) {
        uid = 'anon_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem(ANON_UID_KEY, uid);
      }
      return uid;
    } catch {
      return 'anon_fallback';
    }
  }

  public getAnalytics(): SimulationAnalytics {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SimulationAnalytics;
        return {
          totalHomeVisits: Math.max(parsed.totalHomeVisits ?? 0, DEFAULT_ANALYTICS.totalHomeVisits),
          simulations: {
            ...DEFAULT_ANALYTICS.simulations,
            ...(parsed.simulations || {}),
          },
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ANALYTICS;
  }

  private save(data: SimulationAnalytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notify(data);
    } catch (e) {
      console.warn('Analytics save failed', e);
    }
  }

  public subscribe(fn: (data: SimulationAnalytics) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify(data: SimulationAnalytics) {
    this.listeners.forEach(fn => fn(data));
  }

  // Initialize background live sync every 45s and on tab focus
  private initBackgroundSync() {
    if (typeof window === 'undefined') return;

    // Sync on tab active
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncFromCloud();
      }
    });

    // Periodic sync
    this.syncTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.syncFromCloud();
      }
    }, 45000);
  }

  // Fetch latest global visit count from real-time cloud API
  public async syncFromCloud(): Promise<SimulationAnalytics> {
    if (this.isSyncing) return this.getAnalytics();
    this.isSyncing = true;

    try {
      const cloudVisits = await cloudGet(CLOUD_KEY_HOME);
      if (cloudVisits && cloudVisits > 0) {
        const current = this.getAnalytics();
        if (cloudVisits > current.totalHomeVisits) {
          current.totalHomeVisits = cloudVisits;
          this.save(current);
        }
      }
    } catch {
      // Silently fall back to cached data
    } finally {
      this.isSyncing = false;
    }

    return this.getAnalytics();
  }

  // Rekod bila pelawat tiba di laman utama (Atomic Real-time Hit)
  public recordHomeVisit(): SimulationAnalytics {
    const data = this.getAnalytics();
    const sessionKey = 'session_counted_' + new Date().toDateString();

    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'true');
      data.totalHomeVisits += 1;
      this.save(data);

      // Hit real-time cloud counter asynchronously
      cloudHit(CLOUD_KEY_HOME).then((cloudVal) => {
        if (cloudVal && cloudVal > data.totalHomeVisits) {
          data.totalHomeVisits = cloudVal;
          this.save(data);
        }
      });
    } else {
      // Already counted this session, sync latest cloud number
      this.syncFromCloud();
    }

    return data;
  }

  // Rekod bila mana-mana simulasi dibuka (Atomic Real-time View)
  public recordSimulationView(simId: string): SimulationAnalytics {
    const data = this.getAnalytics();
    if (!data.simulations[simId]) {
      data.simulations[simId] = { views: 0, clicks: 0, completed: 0 };
    }
    data.simulations[simId].views += 1;
    this.save(data);

    // Hit cloud counter for this simulation in background
    const safeKey = `cikguhafreez_v1_view_${sanitizeKey(simId)}`;
    cloudHit(safeKey);

    return data;
  }

  // Rekod bila pelajar klik radas atau butang interaksi (Atomic Real-time Click)
  public recordSimulationClick(simId: string, count: number = 1): SimulationAnalytics {
    const data = this.getAnalytics();
    if (!data.simulations[simId]) {
      data.simulations[simId] = { views: 0, clicks: 0, completed: 0 };
    }
    data.simulations[simId].clicks += count;
    this.save(data);

    // Hit cloud counter in background
    const safeKey = `cikguhafreez_v1_click_${sanitizeKey(simId)}`;
    cloudHit(safeKey);
    cloudHit(CLOUD_KEY_TOTAL_CLICKS);

    return data;
  }

  // Rekod bila eksperimen berjaya diselesaikan
  public recordSimulationCompleted(simId: string): SimulationAnalytics {
    const data = this.getAnalytics();
    if (!data.simulations[simId]) {
      data.simulations[simId] = { views: 0, clicks: 0, completed: 0 };
    }
    data.simulations[simId].completed += 1;
    this.save(data);

    // Hit cloud completion key in background
    const safeKey = `cikguhafreez_v1_done_${sanitizeKey(simId)}`;
    cloudHit(safeKey);

    return data;
  }
}

export const analytics = new AnalyticsService();
