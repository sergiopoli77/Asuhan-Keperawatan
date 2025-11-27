import React, { useState, useEffect } from 'react';
import './addpatients.css';

const AddPatients = ({ show, onClose, onSave, saving, initialData }) => {
  const [rm, setRm] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Laki-laki');
  const [diagnosis, setDiagnosis] = useState('');
  const [status, setStatus] = useState('Rawat Jalan');

  useEffect(() => {
    if (initialData) {
      setRm(initialData.rm || '');
      setName(initialData.name || initialData.nama || '');
      setAge(initialData.age || initialData.usia || '');
      setGender(initialData.gender || initialData.jenisKelamin || 'Laki-laki');
      setDiagnosis(initialData.diagnosis || '');
      setStatus(initialData.status || 'Rawat Jalan');
    } else if (!show) {
      // reset form when modal closed and no initialData
      setRm(''); setName(''); setAge(''); setGender('Laki-laki'); setDiagnosis(''); setStatus('Rawat Jalan');
    }
  }, [show, initialData]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!rm || !name) return alert('Nama dan No. RM wajib diisi');
    const payload = {
      rm: String(rm).trim(),
      name: String(name).trim(),
      age: age ? Number(age) : null,
      gender,
      diagnosis,
      status
    };
    // if editing, pass id as second arg
    onSave && onSave(payload, initialData && initialData.id);
  };

  return (
    <div className="addpatients-overlay">
      <div className="addpatients-card">
        <h3>{initialData ? 'Perbarui Data Pasien' : 'Tambah Pasien Baru'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="addpatients-grid">
            <div>
              <label>No. RM</label>
              <input value={rm} onChange={(e)=>setRm(e.target.value)} placeholder="RMxxx" required />
            </div>
            <div>
              <label>Nama</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nama lengkap" required />
            </div>
            <div>
              <label>Usia</label>
              <input value={age} onChange={(e)=>setAge(e.target.value)} placeholder="Usia" />
            </div>
            <div>
              <label>Jenis Kelamin</label>
              <select value={gender} onChange={(e)=>setGender(e.target.value)}>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div className="full">
              <label>Diagnosis</label>
              <input value={diagnosis} onChange={(e)=>setDiagnosis(e.target.value)} placeholder="Diagnosis" />
            </div>
            <div className="full">
              <label>Status</label>
              <select value={status} onChange={(e)=>setStatus(e.target.value)}>
                <option value="Rawat Jalan">Rawat Jalan</option>
                <option value="Rawat Inap">Rawat Inap</option>
                <option value="Pulang">Pulang</option>
              </select>
            </div>
          </div>
          <div className="addpatients-actions">
            <button type="button" className="addpatients-button cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="addpatients-button save" disabled={saving}>{saving ? 'Menyimpan...' : (initialData ? 'Perbarui Pasien' : 'Simpan Pasien')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatients;
