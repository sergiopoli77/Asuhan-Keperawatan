import React from 'react';
import './addpatients.css';

const ViewPatient = ({ show, onClose, data }) => {
  if (!show || !data) return null;

  return (
    <div className="addpatients-overlay">
      <div className="addpatients-card">
        <h3>Detail Pasien</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div>
            <label>No. RM</label>
            <div style={{padding:8}}>{data.rm}</div>
          </div>
          <div>
            <label>Nama</label>
            <div style={{padding:8}}>{data.name || data.nama}</div>
          </div>
          <div>
            <label>Usia</label>
            <div style={{padding:8}}>{data.age || data.usia}</div>
          </div>
          <div>
            <label>Jenis Kelamin</label>
            <div style={{padding:8}}>{data.gender || data.jenisKelamin}</div>
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <label>Diagnosis</label>
            <div style={{padding:8}}>{data.diagnosis}</div>
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <label>Status</label>
            <div style={{padding:8}}>{data.status}</div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
          <button className="addpatients-button cancel" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
