import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header/header';
import Sidebar from '../../components/Sidebar/sidebar';
import ProblemCard from '../../components/ProblemCard/ProblemCard';
import './dashboard.css';

const API = 'https://onrender.com';


// Backend xatosini o'qiladigan matnga aylantiradi (obyekt alert'da [object Object] bo'lib qolmasin)
const errMsg = (err) => {
  const d = err.response?.data;
  if (d?.details?.length) return d.details.map((x) => `${x.field}: ${x.message}`).join('\n');
  return d?.message || err.message;
};

const fmtDate = (s) => (s ? s.split('-').reverse().join('.') : '—');

// Modal va Field komponentlari tashqarida e'lon qilingan: aks holda har yozishda qayta yaratilib, input fokusini yo'qotadi
const Modal = ({ title, onClose, onSubmit, submitText, children }) => (
  <div className="dash-modal-overlay" onClick={onClose}>
    <form className="dash-modal" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit}>
      <h3>{title}</h3>
      {children}
      <div className="dash-modal-actions">
        <button type="button" className="dash-btn-cancel" onClick={onClose}>Bekor qilish</button>
        <button type="submit" className="dash-btn-submit">{submitText}</button>
      </div>
    </form>
  </div>
);

const Field = ({ label, value, onChange, placeholder, type = 'text', required = true }) => (
  <label className="dash-field">
    <span>{label}</span>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
  </label>
);

const emptyStudent = { full_name: '', email: '', phone: '', direction: '', group_name: '' };
const emptyCompany = { name: '', field: '', address: '', contact: '' };

const Dashboard = () => {
  // 1. HOLATLAR
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [tableData, setTableData] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [companyForm, setCompanyForm] = useState(emptyCompany);

  const [companiesList, setCompaniesList] = useState([]); // Baza uchun jonli ro'yxat
  const [studentsList, setStudentsList] = useState([]); // Baza uchun jonli ro'yxat


  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Muammo kartalari backenddagi haqiqiy "action-items" dan olinadi
  const problems = actionItems.map((a) => ({
    id: a.id,
    title: a.placement?.student?.full_name ? `${a.placement.student.full_name} — yordam vazifasi` : 'Muammo kartasi',
    description: a.description,
    responsible: a.responsible?.full_name || '—',
    status: a.status === 'in_progress' ? 'progress' : a.status,
    deadline: fmtDate(a.due_date),
  }));

  // 2. MA'LUMOTLARNI YUKLASH (bittasi xato bo'lsa, qolganlari baribir ko'rinadi)
  const fetchDashboardData = async () => {
    const calls = await Promise.allSettled([
      axios.get(`${API}/dashboard/coordinator`, { headers }),
      axios.get(`${API}/placements`, { headers, params: { limit: 25 } }),
      axios.get(`${API}/action-items`, { headers, params: { limit: 25 } }),
      axios.get(`${API}/students`, { headers, params: { limit: 50 } }),
      axios.get(`${API}/companies`, { headers, params: { limit: 50 } }),
    ]); 

    const [s, t, a, st, c] = calls;
    if (s.status === 'fulfilled') setStats(s.value.data.data || {});
    if (t.status === 'fulfilled') setTableData(t.value.data.data || []);
    if (a.status === 'fulfilled') setActionItems(a.value.data.data || []);
    if (st.status === 'fulfilled') setStudents(st.value.data.data || []);
    if (c.status === 'fulfilled') setCompanies(c.value.data.data || []);

    const failed = calls.find((x) => x.status === 'rejected');
    if (!failed) return setLoadError('');
    const code = failed.reason.responmse?.status;
    setLoadError(code === 401 ? 'Sessiya tugagan. Qaytadan kiring.' : `Yuklashda xatolik: ${errMsg(failed.reason)}`);
  };
  const fetchCompanies = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/companies', { headers });
        setCompaniesList(res.data || []);
    } catch (err) {
        console.error("Kompaniyalarni yuklashda xatolik:", err);
    }
  };

  const handleCompanyDelete = async (id) => {
    if (window.confirm("Ushbu kompaniyani ro'yxatdan o'chirishni tasdiqlaysizmi?")) {
      try {
        await axios.delete(`http://localhost:3000/api/companies/${id}`, { headers });
        alert("Kompaniya muvaffaqiyatli o'chirildi!");
        fetchCompanies(); // Kompaniyalarni qayta yuklash
        fetchDashboardData();
      } catch (err) {
        alert("O'chirishda Xatolik: " + err.response?.data || err.message);
      }
    }
  }


    // 👥 1. Talabalarni bazadan yuklash funksiyasi
  const fetchStudents = async () => {
      try {
          const res = await axios.get('http://localhost:3000/api/students', { headers });
          setStudentsList(res.data || []);
      } catch (err) {
          console.error("Talabalarni yuklashda xatolik:", err);
      }
  };

  // 🗑️ 2. Talabani o'chirish logikasi
  const handleStudentDelete = async (id) => {
      if (window.confirm("Ushbu o‘quvchi profilini o‘chirishni tasdiqlaysizmi?")) {
          try {
              await axios.delete(`http://localhost:3000/api/students/${id}`, { headers });
              alert("O‘quvchi muvaffaqiyatli o‘chirildi!");
              fetchStudents(); // Ro'yxatni yangilash
              fetchDashboardData();
          } catch (err) {
              alert("O‘chirishda xatolik: " + (err.response?.data || err.message));
          }
      }
  };

  // Sahifa yuklanganda va tab o'zgarganda ishga tushishi uchun useEffect-ni ham yangilab qo'ying:
  useEffect(() => {
      if (token) {
          fetchDashboardData();
          fetchCompanies();
          fetchStudents();
      }
  }, [token]);

  useEffect(() => {
      if (activeTab === 'students') fetchStudents();
  }, [activeTab]);


  useEffect(() => {
    if (token) {
      fetchDashboardData();
      fetchCompanies();
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'companies') fetchCompanies();
  } , [activeTab]);
  

  useEffect(() => {
    if (token) fetchDashboardData();
    else setLoadError('Tizimga kirilmagan (token topilmadi).');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // 3. CSV EKSPORT — token URL'da emas, Authorization header bilan (blob sifatida yuklab olinadi)
  const handleCSVExport = async () => {
    try {
      const res = await axios.get(`${API}/export/placements`, { headers, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `amaliyot-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('CSV yuklab bo‘lmadi: ' + errMsg(err));
    }
  };

  // 4. YANGI O'QUVCHI (akkaunt keyin taklif havolasi orqali yaratiladi)
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${API}/students`, { ...studentForm, group_name: studentForm.group_name || undefined }, { headers });
      alert('O‘quvchi muvaffaqiyatli saqlandi!');
      setIsStudentModalOpen(false);
      setStudentForm(emptyStudent);
      fetchDashboardData();
    } catch (err) {
      alert('Xatolik: ' + errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  // 5. YANGI KOMPANIYA
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${API}/companies`, companyForm, { headers });
      alert('Hamkor kompaniya muvaffaqiyatli qo‘shildi!');
      setIsCompanyModalOpen(false);
      setCompanyForm(emptyCompany);
      fetchDashboardData();
    } catch (err) {
      alert('Xatolik: ' + errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-root-layout">
      <Header />
      <div className="dashboard-main-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="dashboard-workspace">
          {loadError && <div className="dash-error-banner">{loadError}</div>}

          {/* BANNER 1: STATISTIKA VA MONITORING JADVALI */}
          {activeTab === 'dashboard' && (
            <>
              <div className="dashboard-stats-grid">
                <div className="stat-box-item blue-border"><h6>Noyob O‘quvchilar</h6><h3>{stats.unique_students ?? 0}</h3></div>
                <div className="stat-box-item green-border"><h6>Faol Amaliyotlar</h6><h3>{stats.active_placements ?? 0}</h3></div>
                <div className="stat-box-item yellow-border"><h6>Taklif Olganlar</h6><h3>{stats.students_with_offer ?? 0}</h3></div>
                <div className="stat-box-item purple-border"><h6>Ish Boshlaganlar</h6><h3>{stats.students_started_work ?? 0}</h3></div>
              </div>

              <div className="dashboard-sections-split">
                <div className="table-wrapper-section">
                  <div className="section-title-bar">
                    <h3>Amaliyotchilar Monitoringi</h3>
                    <button className="csv-export-button" onClick={handleCSVExport}>📥 UTF-8 CSV Eksport</button>
                  </div>
                  <table className="dashboard-main-table">
                    <thead>
                      <tr>
                        <th>Talaba F.I.Sh.</th>
                        <th>Hamkor Kompaniya</th>
                        <th>Tasdiqlangan Soat / Reja</th>
                        <th>Amaliyot Holati</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.length === 0 ? (
                        <tr><td colSpan="4" className="empty-row-msg">Hozircha amaliyot ma’lumotlari mavjud emas.</td></tr>
                      ) : (
                        tableData.map((row) => (
                          <tr key={row.id}>
                            <td><span className="student-name-txt">{row.student?.full_name}</span></td>
                            <td>{row.company?.name || 'Kompaniyasiz'}</td>
                            <td>
                              {row.progress?.approved_hours ?? 0} / {row.progress?.planned_hours ?? 0} soat
                              {' '}({row.progress?.completion_percent ?? 0}%)
                            </td>
                            <td><span className={`status-pill ${row.status}`}>{row.status_label || row.status}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="problems-sidebar-section">
                  <h3 className="section-sub-title">⚠️ Faol Muammolar Kartasi</h3>
                  <div className="problems-scroll-box">
                    {problems.length === 0 ? (
                      <p className="empty-row-msg">Hozircha muammolar yo‘q.</p>
                    ) : (
                      problems.map((prob) => (
                        <ProblemCard
                          key={prob.id}
                          title={prob.title}
                          description={prob.description}
                          responsible={prob.responsible}
                          status={prob.status}
                          deadline={prob.deadline}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* BANNER 2: O'QUVCHILAR */}
          {activeTab === 'students' && (
    <div className="table-wrapper-section">
        <div className="section-title-bar">
            <h3>👥 O‘quvchilarni Boshqarish paneli</h3>
            <button className="csv-export-button" style={{backgroundColor: '#2563eb'}} onClick={() => setIsStudentModalOpen(true)}>+ Yangi O‘quvchi Qo‘shish</button>
        </div>
        
        {/* Talabalar uchun dinamik real jadval ro'yxati */}
        <table className="dashboard-main-table" style={{marginTop: '1.5rem'}}>
            <thead>
                <tr>
                    <th>O‘quvchi F.I.Sh.</th>
                    <th>Telefon raqami</th>
                    <th>Yo‘nalishi</th>
                    <th>Guruh kodi</th>
                    <th style={{textAlign: 'center'}}>Amal</th>
                </tr>
            </thead>
            <tbody>
                {studentsList.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row-msg">Tizimda hali biror amaliyotchi o‘quvchi mavjud emas.</td></tr>
                ) : (
                    studentsList.map((stud) => (
                        <tr key={stud.id}>
                            <td><strong>{stud.fullName}</strong></td>
                            <td>{stud.phone}</td>
                            <td>{stud.field}</td>
                            <td>{stud.group}</td>
                            <td style={{textAlign: 'center'}}>
                                <button 
                                    onClick={() => handleStudentDelete(stud.id)}
                                    style={{backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem'}}
                                >
                                    O‘chirish
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
)}

          {/* BANNER 3: KOMPANIYALAR */}
          {activeTab === 'companies' && (
    <div className="table-wrapper-section">
        <div className="section-title-bar">
            <h3>🏢 Hamkor Kompaniyalar paneli</h3>
            <button className="csv-export-button" style={{backgroundColor: '#2563eb'}} onClick={() => setIsCompanyModalOpen(true)}>+ Yangi Kompaniya Qo‘shish</button>
        </div>
        
        {/* Yangi qo'shilgan jonli ro'yxat jadvali */}
        <table className="dashboard-main-table" style={{marginTop: '1.5rem'}}>
            <thead>
                <tr>
                    <th>Kompaniya Nomi</th>
                    <th>Yo‘nalishi</th>
                    <th>Manzil</th>
                    <th>Aloqa</th>
                    <th style={{textAlign: 'center'}}>Amal</th>
                </tr>
            </thead>
            <tbody>
                {companiesList.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row-msg">Tizimda hamkor kompaniya mavjud emas.</td></tr>
                ) : (
                    companiesList.map((comp) => (
                        <tr key={comp.id}>
                            <td><strong>{comp.name}</strong></td>
                            <td>{comp.field}</td>
                            <td>{comp.address}</td>
                            <td>{comp.contact}</td>
                            <td style={{textAlign: 'center'}}>
                                <button 
                                    onClick={() => handleCompanyDelete(comp.id)}
                                    style={{backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem'}}
                                >
                                    O‘chirish
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
)}


          {/* BANNER 4: MUAMMOLAR ARXIVI */}
          {activeTab === 'problems' && (
            <div className="table-wrapper-section">
              <h3>🛠️ Muammolar Kartalari</h3>
              <p style={{ color: '#6b7280' }}>
                Tizim avtomat ochgan va qo‘lda yaratilgan barcha muammo kartalari va yordam vazifalari.
              </p>
              <div style={{ marginTop: '1rem' }}>
                {problems.length === 0 ? (
                  <p className="empty-row-msg">Hozircha muammolar yo‘q.</p>
                ) : (
                  problems.map((prob) => (
                    <ProblemCard
                      key={prob.id}
                      title={prob.title}
                      description={prob.description}
                      responsible={prob.responsible}
                      status={prob.status}
                      deadline={prob.deadline}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* O'QUVCHI QO'SHISH MODALI */}
      {isStudentModalOpen && (
        <Modal
          title="Yangi O‘quvchi Profilini Yaratish"
          onClose={() => setIsStudentModalOpen(false)}
          onSubmit={handleStudentSubmit}
          submitText={saving ? 'Saqlanmoqda...' : 'Saqlash'}
        >
          <Field label="F.I.Sh. (to‘liq)" value={studentForm.full_name} onChange={(v) => setStudentForm({ ...studentForm, full_name: v })} placeholder="Eshmatov Toshmat" />
          <Field label="Email (akkaunt taklifi uchun)" type="email" value={studentForm.email} onChange={(v) => setStudentForm({ ...studentForm, email: v })} placeholder="toshmat@mail.uz" />
          <Field label="Telefon raqami" value={studentForm.phone} onChange={(v) => setStudentForm({ ...studentForm, phone: v })} placeholder="+998901234567" required={false} />
          <Field label="Yo‘nalish" value={studentForm.direction} onChange={(v) => setStudentForm({ ...studentForm, direction: v })} placeholder="Backend Node.js" />
          <Field label="Guruh kodi" value={studentForm.group_name} onChange={(v) => setStudentForm({ ...studentForm, group_name: v })} placeholder="N-101" required={false} />
        </Modal>
      )}

      {/* KOMPANIYA QO'SHISH MODALI */}
      {isCompanyModalOpen && (
        <Modal
          title="Yangi Hamkor Kompaniya Qo‘shish"
          onClose={() => setIsCompanyModalOpen(false)}
          onSubmit={handleCompanySubmit}
          submitText={saving ? 'Saqlanmoqda...' : 'Qo‘shish'}
        >
          <Field label="Kompaniya nomi" value={companyForm.name} onChange={(v) => setCompanyForm({ ...companyForm, name: v })} placeholder="Algoritm Consulting Group" />
          <Field label="Faoliyat sohasi" value={companyForm.field} onChange={(v) => setCompanyForm({ ...companyForm, field: v })} placeholder="IT konsalting" required={false} />
          <Field label="Manzil" value={companyForm.address} onChange={(v) => setCompanyForm({ ...companyForm, address: v })} placeholder="Toshkent sh., Chilonzor" required={false} />
          <Field label="Aloqa (telefon/email)" value={companyForm.contact} onChange={(v) => setCompanyForm({ ...companyForm, contact: v })} placeholder="+998712001122" required={false} />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;