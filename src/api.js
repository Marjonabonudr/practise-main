import axios from 'axios';

export const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// timeout 60s: Render bepul tarifida server uyg'onishi ~30-50 soniya olishi mumkin
const api = axios.create({ baseURL: API, timeout: 60000 });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Faqat kirgan foydalanuvchining tokeni eskirganda chiqaramiz (login'dagi noto'g'ri parolda emas)
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

// Backend xatosini o'qiladigan matnga aylantiradi
export const errMsg = (err) => {
  const d = err.response?.data;
  if (typeof d === 'string') return d;
  if (d?.details?.length) return d.details.map((x) => `${x.field}: ${x.message}`).join('\n');
  if (Array.isArray(d?.message)) return d.message.join('\n');
  if (!err.response) return 'Serverga ulanib bo‘lmadi (server uxlayotgan bo‘lishi mumkin, 1 daqiqadan so‘ng qayta urining)';
  return d?.message || err.message;
};

export default api;
