import React, { useEffect, useState, useCallback } from 'react';
import api, { errMsg } from '../../api';
import Header from '../../components/Header/header';
import Sidebar from '../../components/Sidebar/sidebar';
import ProblemCard from '../../components/ProblemCard/ProblemCard';
import './dashboard.css';

const STATUS_UZ = { placed: 'Joylashtirildi', ongoing: 'Davom etmoqda', paused: 'Vaqtincha to‘xtatildi', terminated: 'Muddatidan oldin tugatildi', completed: 'Yakunlandi' };
const WEEKDAYS = [[1, 'Du'], [2, 'Se'], [3, 'Ch'], [4, 'Pa'], [5, 'Ju'], [6, 'Sh'], [7, 'Ya']];
const fmtDate = (s) => (s ? s.split('-').reverse().join('.') : '—');
const list = (res) => res?.data?.data ?? [];
const btn = { border: 'none', padding: '0.3rem 0.65rem', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', color: '#fff', marginRight: 4 };

// Backendning jadval bilan bir xil mantiqi: reja soati jadvaldan hisoblanadi
const calcHours = (f) => {
  if (!f.startDate || !f.endDate || f.endDate < f.startDate || !f.dailyHours) return 0;
  const ex = new Set(f.excludedDates.split(',').map((s) => s.trim()).filter(Boolean));
  let n = 0;
  for (let d = new Date(`${f.startDate}T00:00:00Z`); d <= new Date(`${f.endDate}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    const wd = d.getUTCDay() === 0 ? 7 : d.getUTCDay();
    if (f.workDays.includes(wd) && !ex.has(d.toISOString().slice(0, 10))) n += 1;
  }
  return n * Number(f.dailyHours);
};

// Modal va Field tashqarida: aks holda har yozishda qayta yaratilib, input fokusini yo'qotadi
const Modal = ({ title, onClose, onSubmit, submitText, children }) => (
  <div className="dash-modal-overlay" onClick={onClose}>
    <form className="dash-modal" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      <h3>{title}</h3>
      {children}
      <div className="dash-modal-actions">
        <button type="button" className="dash-btn-cancel" onClick={onClose}>Bekor qilish</button>
        <button type="submit" className="dash-btn-submit">{submitText}</button>
      </div>
    </form>
  </div>
);
const Field = ({ label, value, onChange, placeholder, type = 'text', required = true, ...rest }) => (
  <label className="dash-field">
    <span>{label}</span>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} {...rest} />
  </label>
);
const Select = ({ label, value, onChange, children, required = true }) => (
  <label className="dash-field">
    <span>{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} required={required} style={{ padding: '0.55rem', borderRadius: 6 }}>{children}</select>
  </label>
);

const emptyStudent = { fullName: '', email: '', phone: '', field: '', group: '' };
const emptyCompany = { name: '', field: '', address: '', contact: '' };
const emptyPlacement = {
  studentId: '', companyId: '', mentorId: '', startDate: '', endDate: '', workDays: [1, 2, 3, 4, 5],
  dailyHours: '4', excludedDates: '', format: 'office', goals: '', plannedHours: '', plannedHoursReason: '',
};

const Dashboard = ({ onLogout }) => {
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '', companyId: '', limit: 25, page: 1 });
  const [studentsList, setStudentsList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [problems, setProblems] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  const [studentOpen, setStudentOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [placementForm, setPlacementForm] = useState(emptyPlacement);

  const loadTable = useCallback(async (f) => {
    const params = { ...f };
    Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
    const res = await api.get('/dashboard/table', { params });
    setRows(list(res)); setMeta(res.data.meta || { total: 0, page: 1, totalPages: 1 });
  }, []);

  // Bittasi xato bersa, qolganlari baribir ko'rinadi
  const loadAll = useCallback(async (f) => {
    const calls = await Promise.allSettled([
      api.get('/dashboard/stats').then((r) => setStats(r.data.data || {})),
      loadTable(f),
      api.get('/students', { params: { limit: 100 } }).then((r) => setStudentsList(list(r))),
      api.get('/companies', { params: { limit: 100 } }).then((r) => setCompaniesList(list(r))),
      api.get('/action-items', { params: { limit: 50 } }).then((r) => setProblems(list(r))),
    ]);
    const failed = calls.find((c) => c.status === 'rejected');
    setLoadError(failed ? `Yuklashda xatolik: ${errMsg(failed.reason)}` : '');
  }, [loadTable]);

  useEffect(() => {
    if (token) loadAll(filters);
    else setLoadError('Tizimga kirilmagan (token topilmadi).');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const applyFilters = (patch) => {
    const next = { ...filters, page: 1, ...patch };
    setFilters(next);
    loadTable(next).catch((e) => setLoadError(errMsg(e)));
  };
  const goPage = (page) => applyFilters({ page });
  const refresh = () => loadAll(filters);

  // ---------- CSV (jadvaldagi filtrlar bilan bir xil) ----------
  const handleCSVExport = async () => {
    try {
      const { search, status, companyId } = filters;
      const params = { search, status, companyId };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/dashboard/export', { params, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = `amaliyot-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (err) {
      let msg = errMsg(err);
      if (err.response?.data instanceof Blob) { try { msg = JSON.parse(await err.response.data.text()).message; } catch { /* e'tiborsiz */ } }
      alert('CSV yuklab bo‘lmadi: ' + msg);
    }
  };

  // ---------- Taklif havolasi ----------
  const makeInvite = async (body) => {
    try {
      const res = await api.post('/users/invite', body);
      window.prompt(`Havola 72 soat amal qiladi. Nusxalab ${res.data.data.email} ga yuboring:`, res.data.data.inviteLink);
    } catch (err) { alert('Taklif yaratib bo‘lmadi: ' + errMsg(err)); }
  };
  const inviteStudent = (s) => makeInvite({ role: 'intern', studentId: s.id, email: s.email });
  const inviteMentor = (c) => {
    const fullName = window.prompt('Mentor F.I.Sh.:'); if (!fullName) return;
    const email = window.prompt('Mentor emaili:'); if (!email) return;
    makeInvite({ role: 'mentor', companyId: c.id, fullName, email });
  };

  // ---------- O'quvchi / kompaniya ----------
  const archive = async (path, id, label) => {
    if (!window.confirm(`${label}ni arxivlashni tasdiqlaysizmi? (tarix saqlanadi)`)) return;
    try { await api.delete(`${path}/${id}`); await refresh(); } catch (err) { alert('Xatolik: ' + errMsg(err)); }
  };
  const submitStudent = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/students', { ...studentForm, phone: studentForm.phone.replace(/[^0-9+]/g, '') });
      setStudentOpen(false); setStudentForm(emptyStudent); await refresh();
    } catch (err) { alert('Xatolik: ' + errMsg(err)); } finally { setSaving(false); }
  };
  const submitCompany = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.post('/companies', companyForm); setCompanyOpen(false); setCompanyForm(emptyCompany); await refresh(); }
    catch (err) { alert('Xatolik: ' + errMsg(err)); } finally { setSaving(false); }
  };

  // ---------- Amaliyot yaratish ----------
  const openPlacement = () => { setPlacementForm(emptyPlacement); setMentors([]); setPlacementOpen(true); };
  const pickCompany = async (companyId) => {
    setPlacementForm((f) => ({ ...f, companyId, mentorId: '' }));
    if (!companyId) return setMentors([]);
    try { const r = await api.get('/users', { params: { role: 'mentor', status: 'active', companyId } }); setMentors(list(r)); }
    catch (err) { alert(errMsg(err)); }
  };
  const toggleDay = (d) => setPlacementForm((f) => ({ ...f, workDays: f.workDays.includes(d) ? f.workDays.filter((x) => x !== d) : [...f.workDays, d].sort() }));
  const autoHours = calcHours(placementForm);
  const submitPlacement = async (e) => {
    e.preventDefault(); setSaving(true);
    const f = placementForm;
    const body = {
      studentId: f.studentId, companyId: f.companyId, mentorId: f.mentorId, startDate: f.startDate, endDate: f.endDate,
      workDays: f.workDays, dailyHours: Number(f.dailyHours), format: f.format,
      excludedDates: f.excludedDates.split(',').map((s) => s.trim()).filter(Boolean),
      goals: f.goals.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    if (f.plannedHours && Number(f.plannedHours) !== autoHours) { body.plannedHours = Number(f.plannedHours); body.plannedHoursReason = f.plannedHoursReason; }
    try { await api.post('/placements', body); setPlacementOpen(false); await refresh(); }
    catch (err) { alert('Xatolik: ' + errMsg(err)); } finally { setSaving(false); }
  };

  // ---------- Amaliyot holatini o'zgartirish (TZ qoidalari serverda tekshiriladi) ----------
  const changeStatus = async (row, status) => {
    const body = { status, version: row.version };
    const needReason = ['paused', 'terminated'].includes(status) || ['completed', 'terminated'].includes(row.status);
    if (needReason) { const r = window.prompt('Sabab (majburiy):'); if (!r) return; body.reason = r; }
    if (status === 'completed') {
      const c = window.prompt('Yakuniy xulosa (majburiy):'); if (!c) return; body.conclusion = c;
      if (!needReason) { const r = window.prompt('Reja soati to‘liq bajarilmagan bo‘lsa, sabab (aks holda bo‘sh qoldiring):'); if (r) body.reason = r; }
    }
    if (row.status === 'paused' && status === 'ongoing') {
      const d = window.prompt('Yangi tugash sanasi (YYYY-MM-DD):', row.endDate); if (!d) return; body.newEndDate = d;
    }
    try { await api.put(`/placements/${row.id}/status`, body); await refresh(); } catch (err) { alert('Xatolik: ' + errMsg(err)); }
  };
  const actionsFor = (row) => ({
    placed: [['Boshlash', 'ongoing', '#16a34a']],
    ongoing: [['To‘xtatish', 'paused', '#d97706'], ['Yakunlash', 'completed', '#2563eb'], ['Erta tugatish', 'terminated', '#ef4444']],
    paused: [['Davom ettirish', 'ongoing', '#16a34a'], ['Erta tugatish', 'terminated', '#ef4444']],
    completed: [['Qayta ochish', 'ongoing', '#6b7280']],
    terminated: [['Qayta ochish', 'ongoing', '#6b7280']],
  }[row.status] || []);

  const problemCards = problems.map((a) => ({
    id: a.id,
    title: a.placement?.student?.fullName ? `${a.placement.student.fullName} — yordam vazifasi` : 'Muammo kartasi',
    description: a.description,
    responsible: a.responsible?.fullName || a.responsible?.email || '—',
    status: a.status === 'in_progress' ? 'progress' : a.status,
    deadline: fmtDate(a.dueDate),
  }));
  const freeStudents = studentsList.filter((s) => !s.hasActivePlacement);

  return (
    <div className="dashboard-root-layout">
      <Header onLogout={onLogout} />
      <div className="dashboard-main-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="dashboard-workspace">
          {loadError && <div className="dash-error-banner">{loadError}</div>}

          {activeTab === 'dashboard' && (
            <>
              <div className="dashboard-stats-grid">
                <div className="stat-box-item blue-border"><h6>Noyob O‘quvchilar</h6><h3>{stats.uniqueStudents ?? 0}</h3></div>
                <div className="stat-box-item green-border"><h6>Faol Amaliyotlar</h6><h3>{stats.activePlacements ?? 0}</h3></div>
                <div className="stat-box-item yellow-border"><h6>Taklif Olganlar</h6><h3>{stats.offeredStudents ?? 0}</h3></div>
                <div className="stat-box-item purple-border"><h6>Ish Boshlaganlar</h6><h3>{stats.startedWork ?? 0}</h3></div>
              </div>

              <div className="dashboard-sections-split">
                <div className="table-wrapper-section">
                  <div className="section-title-bar">
                    <h3>Amaliyotchilar Monitoringi</h3>
                    <div>
                      <button className="csv-export-button" style={{ backgroundColor: '#2563eb', marginRight: 8 }} onClick={openPlacement}>+ Yangi amaliyot</button>
                      <button className="csv-export-button" onClick={handleCSVExport}>📥 CSV Eksport</button>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); applyFilters({}); }} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '0.75rem 0' }}>
                    <input placeholder="Ism bo‘yicha qidirish" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
                    <select value={filters.status} onChange={(e) => applyFilters({ status: e.target.value })}>
                      <option value="">Barcha holatlar</option>
                      {Object.entries(STATUS_UZ).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={filters.companyId} onChange={(e) => applyFilters({ companyId: e.target.value })}>
                      <option value="">Barcha kompaniyalar</option>
                      {companiesList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={filters.limit} onChange={(e) => applyFilters({ limit: Number(e.target.value) })}>
                      <option value={25}>25 ta</option><option value={50}>50 ta</option>
                    </select>
                    <button type="submit">Qidirish</button>
                  </form>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="dashboard-main-table">
                      <thead>
                        <tr>
                          <th>Talaba</th><th>Kompaniya / Mentor</th><th>Muddat</th><th>Tasdiqlangan / Reja</th>
                          <th>Oxirgi baho</th><th>Holat</th><th>Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr><td colSpan="7" className="empty-row-msg">Hozircha amaliyot ma’lumotlari mavjud emas.</td></tr>
                        ) : rows.map((row) => (
                          <tr key={row.id}>
                            <td><span className="student-name-txt">{row.student?.fullName}</span><br /><small>{row.student?.field}</small></td>
                            <td>{row.company?.name || '—'}<br /><small>{row.mentor?.fullName || row.mentor?.email || '—'}</small></td>
                            <td>{fmtDate(row.startDate)} — {fmtDate(row.endDate)}{row.calendar?.overdueDays > 0 && <><br /><small style={{ color: '#b91c1c' }}>{row.calendar.overdueDays} kun kechikdi</small></>}</td>
                            <td>{row.progress?.approvedHours ?? 0} / {row.progress?.plannedHours ?? 0} soat ({row.progress?.completionPercent ?? 0}%)
                              {row.progress?.overHours > 0 && <small> +{row.progress.overHours} soat ortiqcha</small>}</td>
                            <td>{row.lastWeeklyAverage ?? '—'}{row.lastWeeklyEvaluated ? <small> ({row.lastWeeklyEvaluated}/5)</small> : null}</td>
                            <td><span className={`status-pill ${row.status}`}>{row.statusLabel || row.status}</span></td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              {actionsFor(row).map(([label, st, color]) => (
                                <button key={st + label} style={{ ...btn, backgroundColor: color }} onClick={() => changeStatus(row, st)}>{label}</button>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
                    <button disabled={meta.page <= 1} onClick={() => goPage(meta.page - 1)}>← Oldingi</button>
                    <span>{meta.page} / {meta.totalPages || 1} (jami {meta.total})</span>
                    <button disabled={meta.page >= (meta.totalPages || 1)} onClick={() => goPage(meta.page + 1)}>Keyingi →</button>
                  </div>
                </div>

                <div className="problems-sidebar-section">
                  <h3 className="section-sub-title">⚠️ Faol Muammolar Kartasi</h3>
                  <div className="problems-scroll-box">
                    {problemCards.length === 0 ? <p className="empty-row-msg">Hozircha muammolar yo‘q.</p>
                      : problemCards.map((p) => <ProblemCard key={p.id} title={p.title} description={p.description} responsible={p.responsible} status={p.status} deadline={p.deadline} />)}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'students' && (
            <div className="table-wrapper-section">
              <div className="section-title-bar">
                <h3>👥 O‘quvchilarni Boshqarish paneli</h3>
                <button className="csv-export-button" style={{ backgroundColor: '#2563eb' }} onClick={() => setStudentOpen(true)}>+ Yangi O‘quvchi</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="dashboard-main-table" style={{ marginTop: '1.5rem' }}>
                  <thead><tr><th>F.I.Sh.</th><th>Email</th><th>Telefon</th><th>Yo‘nalish</th><th>Guruh</th><th>Akkaunt</th><th style={{ textAlign: 'center' }}>Amal</th></tr></thead>
                  <tbody>
                    {studentsList.length === 0 ? <tr><td colSpan="7" className="empty-row-msg">Tizimda o‘quvchi mavjud emas.</td></tr>
                      : studentsList.map((s) => (
                        <tr key={s.id}>
                          <td><strong>{s.fullName}</strong></td><td>{s.email}</td><td>{s.phone}</td><td>{s.field}</td><td>{s.group || '—'}</td>
                          <td>{s.hasAccount ? '✅ ulangan' : '—'}</td>
                          <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {!s.hasAccount && <button style={{ ...btn, backgroundColor: '#2563eb' }} onClick={() => inviteStudent(s)}>Taklif havolasi</button>}
                            <button style={{ ...btn, backgroundColor: '#ef4444' }} onClick={() => archive('/students', s.id, 'Ushbu o‘quvchi profili')}>Arxivlash</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="table-wrapper-section">
              <div className="section-title-bar">
                <h3>🏢 Hamkor Kompaniyalar paneli</h3>
                <button className="csv-export-button" style={{ backgroundColor: '#2563eb' }} onClick={() => setCompanyOpen(true)}>+ Yangi Kompaniya</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="dashboard-main-table" style={{ marginTop: '1.5rem' }}>
                  <thead><tr><th>Nomi</th><th>Yo‘nalishi</th><th>Manzil</th><th>Aloqa</th><th style={{ textAlign: 'center' }}>Amal</th></tr></thead>
                  <tbody>
                    {companiesList.length === 0 ? <tr><td colSpan="5" className="empty-row-msg">Tizimda hamkor kompaniya mavjud emas.</td></tr>
                      : companiesList.map((c) => (
                        <tr key={c.id}>
                          <td><strong>{c.name}</strong></td><td>{c.field}</td><td>{c.address}</td><td>{c.contact}</td>
                          <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <button style={{ ...btn, backgroundColor: '#2563eb' }} onClick={() => inviteMentor(c)}>+ Mentor taklifi</button>
                            <button style={{ ...btn, backgroundColor: '#ef4444' }} onClick={() => archive('/companies', c.id, 'Ushbu kompaniya')}>Arxivlash</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'problems' && (
            <div className="table-wrapper-section">
              <h3>🛠️ Muammolar Kartalari</h3>
              <div style={{ marginTop: '1rem' }}>
                {problemCards.length === 0 ? <p className="empty-row-msg">Hozircha muammolar yo‘q.</p>
                  : problemCards.map((p) => <ProblemCard key={p.id} title={p.title} description={p.description} responsible={p.responsible} status={p.status} deadline={p.deadline} />)}
              </div>
            </div>
          )}
        </main>
      </div>

      {studentOpen && (
        <Modal title="Yangi O‘quvchi Profili" onClose={() => setStudentOpen(false)} onSubmit={submitStudent} submitText={saving ? 'Saqlanmoqda...' : 'Saqlash'}>
          <Field label="F.I.Sh." value={studentForm.fullName} onChange={(v) => setStudentForm({ ...studentForm, fullName: v })} placeholder="Eshmatov Toshmat" />
          <Field label="Email (akkaunt taklifi uchun)" type="email" value={studentForm.email} onChange={(v) => setStudentForm({ ...studentForm, email: v })} />
          <Field label="Telefon" value={studentForm.phone} onChange={(v) => setStudentForm({ ...studentForm, phone: v })} placeholder="+998901234567" />
          <Field label="Yo‘nalish" value={studentForm.field} onChange={(v) => setStudentForm({ ...studentForm, field: v })} placeholder="Backend Node.js" />
          <Field label="Guruh" value={studentForm.group} onChange={(v) => setStudentForm({ ...studentForm, group: v })} placeholder="N-101" required={false} />
        </Modal>
      )}

      {companyOpen && (
        <Modal title="Yangi Hamkor Kompaniya" onClose={() => setCompanyOpen(false)} onSubmit={submitCompany} submitText={saving ? 'Saqlanmoqda...' : 'Qo‘shish'}>
          <Field label="Kompaniya nomi" value={companyForm.name} onChange={(v) => setCompanyForm({ ...companyForm, name: v })} />
          <Field label="Faoliyat sohasi" value={companyForm.field} onChange={(v) => setCompanyForm({ ...companyForm, field: v })} />
          <Field label="Manzil" value={companyForm.address} onChange={(v) => setCompanyForm({ ...companyForm, address: v })} />
          <Field label="Aloqa (telefon/email)" value={companyForm.contact} onChange={(v) => setCompanyForm({ ...companyForm, contact: v })} />
        </Modal>
      )}

      {placementOpen && (
        <Modal title="Yangi Amaliyot (joylashtirish)" onClose={() => setPlacementOpen(false)} onSubmit={submitPlacement} submitText={saving ? 'Saqlanmoqda...' : 'Yaratish'}>
          <Select label="O‘quvchi (faol amaliyoti yo‘qlar)" value={placementForm.studentId} onChange={(v) => setPlacementForm({ ...placementForm, studentId: v })}>
            <option value="">— tanlang —</option>
            {freeStudents.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </Select>
          <Select label="Kompaniya" value={placementForm.companyId} onChange={pickCompany}>
            <option value="">— tanlang —</option>
            {companiesList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Mentor (kompaniya mentorlari)" value={placementForm.mentorId} onChange={(v) => setPlacementForm({ ...placementForm, mentorId: v })}>
            <option value="">{mentors.length ? '— tanlang —' : 'Mentor yo‘q: kompaniya qatoridan taklif yuboring'}</option>
            {mentors.map((m) => <option key={m.id} value={m.id}>{m.fullName || m.email}</option>)}
          </Select>
          <Field label="Boshlanish sanasi" type="date" value={placementForm.startDate} onChange={(v) => setPlacementForm({ ...placementForm, startDate: v })} />
          <Field label="Tugash sanasi" type="date" value={placementForm.endDate} onChange={(v) => setPlacementForm({ ...placementForm, endDate: v })} />
          <div className="dash-field">
            <span>Haftalik ish kunlari</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {WEEKDAYS.map(([d, l]) => (
                <label key={d}><input type="checkbox" checked={placementForm.workDays.includes(d)} onChange={() => toggleDay(d)} /> {l}</label>
              ))}
            </div>
          </div>
          <Field label="Kunlik reja soati (0.5 qadam)" type="number" step="0.5" min="0.5" max="12" value={placementForm.dailyHours} onChange={(v) => setPlacementForm({ ...placementForm, dailyHours: v })} />
          <Field label="Dam olish/istisno kunlar (YYYY-MM-DD, vergul bilan)" value={placementForm.excludedDates} onChange={(v) => setPlacementForm({ ...placementForm, excludedDates: v })} required={false} placeholder="2026-12-31, 2027-01-01" />
          <Select label="Format" value={placementForm.format} onChange={(v) => setPlacementForm({ ...placementForm, format: v })}>
            <option value="office">Ofisda</option><option value="remote">Masofaviy</option><option value="hybrid">Aralash</option>
          </Select>
          <label className="dash-field">
            <span>Tekshiriladigan natijalar (3–5 ta, har biri yangi qatorda)</span>
            <textarea rows={4} required value={placementForm.goals} onChange={(e) => setPlacementForm({ ...placementForm, goals: e.target.value })} />
          </label>
          <p style={{ margin: '0.25rem 0' }}><b>Jadvaldan hisoblangan reja:</b> {autoHours} soat</p>
          <Field label="Qo‘lda tuzatish (ixtiyoriy)" type="number" value={placementForm.plannedHours} onChange={(v) => setPlacementForm({ ...placementForm, plannedHours: v })} required={false} />
          {placementForm.plannedHours && Number(placementForm.plannedHours) !== autoHours && (
            <Field label="Tuzatish sababi (majburiy)" value={placementForm.plannedHoursReason} onChange={(v) => setPlacementForm({ ...placementForm, plannedHoursReason: v })} />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
