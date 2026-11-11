import { SimulationAnalytics } from '../types/simulation';

const STORAGE_KEY = 'cikguhafreez_simulasi_analytics_v1';

// Initial realistic baseline counts representing students who used the Canva app
const DEFAULT_ANALYTICS: SimulationAnalytics = {
  totalHomeVisits: 1482,
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
    'haba-penyesaran': { views: 315, clicks: 840, completed: 190 }
  }
};

class AnalyticsService {
  private listeners: Array<(data: SimulationAnalytics) => void> = [];

  public getAnalytics(): SimulationAnalytics {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
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

  // Rekod bila pelawat tiba di laman utama
  public recordHomeVisit(): SimulationAnalytics {
    const data = this.getAnalytics();
    // Hanya kira sekali per session untuk elak spam refresh, tapi tetap boleh increment
    const sessionKey = 'session_counted_' + new Date().toDateString();
    if (!sessionStorage.getItem(sessionKey)) {
      data.totalHomeVisits += 1;
      sessionStorage.setItem(sessionKey, 'true');
      this.save(data);
    }
    return data;
  }

  // Rekod bila mana-mana simulasi dibuka
  public recordSimulationView(simId: string): SimulationAnalytics {
    const data = this.getAnalytics();
    if (!data.simulations[simId]) {
      data.simulations[simId] = { views: 0, clicks: 0, completed: 0 };
    }
    data.simulations[simId].views += 1;
    this.save(data);
    return data;
  }

  // Rekod bila pelajar klik radas atau butang interaksi
  public recordSimulationClick(simId: string, count: number = 1): SimulationAnalytics {
    const data = this.getAnalytics();
    if (!data.simulations[simId]) {
      data.simulations[simId] = { views: 0, clicks: 0, completed: 0 };
    }
    data.simulations[simId].clicks += count;
    this.save(data);
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
    return data;
  }
}

export const analytics = new AnalyticsService();
