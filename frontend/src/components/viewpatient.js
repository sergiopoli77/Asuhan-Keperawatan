import React from 'react';
import './viewpatient.css';

const ViewPatient = ({ show, onClose, data, onEdit }) => {
  if (!show || !data) return null;

  const avatarLetter = (data.name || data.nama || '').charAt(0).toUpperCase() || 'P';

  return (
    <div className="viewpatient-overlay">
      <div className="viewpatient-card">
        <div className="vp-header">
          <div className="vp-avatar">{avatarLetter}</div>
          <div>
            <h4 className="vp-title">{data.name || data.nama}</h4>
            <div className="vp-sub">No. RM: {data.rm} • ID: {data.id}</div>
          </div>
        </div>

        <div className="vp-grid">
          <div className="vp-item">
            <div className="vp-label">Usia</div>
            <div className="vp-value">{data.age || data.usia || '-'}</div>
          </div>
          <div className="vp-item">
            <div className="vp-label">Jenis Kelamin</div>
            <div className="vp-value">{data.gender || data.jenisKelamin || '-'}</div>
          </div>

          <div className="vp-item vp-full">
            <div className="vp-label">Diagnosis</div>
            <div className="vp-value">{data.diagnosis || '-'}</div>
          </div>

          <div className="vp-item vp-full">
            <div className="vp-label">Status</div>
            <div className="vp-value">{data.status || '-'}</div>
          </div>
        </div>

        <div className="vp-actions">
          <button className="vp-btn close" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
