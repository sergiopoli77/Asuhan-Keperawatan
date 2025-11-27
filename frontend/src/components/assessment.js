import React, { useState, useEffect } from 'react';
import '../components/assessment.css';
import { db } from '../config/firebase';
import { ref, get, push } from 'firebase/database';

const Assessment = ({ show, onClose, onSave }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [assessment, setAssessment] = useState({
    subjective: '',
    vital_signs: {
      blood_pressure: '',
      pulse: '',
      temperature: '',
      respiration: '',
      oxygen_saturation: ''
    },
    pemeriksaan_fisik: '',
    lab_results: '',
    additional_notes: ''
  });

  useEffect(() => {
    if (!show) return;
    const loadPatients = async () => {
      try {
        const snap = await get(ref(db, 'pasien'));
        if (!snap.exists()) {
          setPatients([]);
          return;
        }
        const val = snap.val();
        const list = Object.keys(val).map(key => ({
          id: key,
          rm: val[key].rm || '',
          name: val[key].name || val[key].nama || '',
          diagnosis: val[key].diagnosis || ''
        }));
        setPatients(list);
      } catch (err) {
        console.error('Gagal memuat pasien', err);
        setPatients([]);
      }
    };
    loadPatients();
  }, [show]);

  useEffect(() => {
    if (!selectedPatient) {
      setAssessment(prev => ({ ...prev, subjective: '' }));
      return;
    }
    // try to prefill from patient record if available
    const fillFromPatient = async () => {
      try {
        const snap = await get(ref(db, `pasien/${selectedPatient}`));
        if (snap.exists()) {
              const p = snap.val();
              const preSubjective = p.keluhan || p.subjective || (p.diagnosis ? `Diagnosis medis: ${p.diagnosis}` : '');
              setAssessment(prev => ({ ...prev, subjective: preSubjective }));
            }
      } catch (err) {
        console.error('Gagal memuat detail pasien', err);
      }
    };
    fillFromPatient();
  }, [selectedPatient]);

  

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setAssessment(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setAssessment(prev => ({ ...prev, [field]: value }));
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedPatient) {
      alert('Pilih pasien terlebih dahulu');
      return;
    }

    // If everything is empty, confirm before saving
    const vit = assessment.vital_signs || {};
    const vitEmpty = !vit.blood_pressure && !vit.pulse && !vit.temperature && !vit.respiration && !vit.oxygen_saturation;
    const physEmpty = !assessment.pemeriksaan_fisik;
    if (!assessment.subjective && vitEmpty && physEmpty && !assessment.lab_results && !assessment.additional_notes) {
      const ok = window.confirm('Semua field assessment kosong. Tetap simpan?');
      if (!ok) return;
    }

    setIsSaving(true);
    try {
      const payload = {
        assessment,
        patientId: selectedPatient,
        createdAt: new Date().toISOString(),
        createdBy: ''
      };

      const listRef = ref(db, `assessment/${selectedPatient}`);
      const newRef = await push(listRef, payload);

      // notify parent with saved id
      if (onSave) onSave({ id: newRef.key, ...payload });

      alert('Assessment berhasil disimpan');
    } catch (err) {
      console.error('Gagal menyimpan assessment', err);
      alert('Gagal menyimpan assessment. Cek konsol.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="assessment-overlay">
      <div className="assessment-card">
        <h3>Assessment Baru</h3>

        <div className="assessment-row">
          <div>
            <label>Pilih Pasien</label>
            <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
              <option value="">-- Pilih Pasien --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.rm})</option>
              ))}
            </select>

            {selectedPatient && (
              <div className="patient-info-mini">
                <strong>Pasien:</strong> {patients.find(x=>x.id===selectedPatient)?.name} <br/>
                <small>RM: {patients.find(x=>x.id===selectedPatient)?.rm}</small>
              </div>
            )}
          </div>

          {/* show fields only after a patient is selected */}
          {selectedPatient ? (
            <>
              <div style={{marginTop:10}}>
                <div>
                  <label>Data Subjektif</label>
                  <textarea rows={4} value={assessment.subjective} onChange={(e)=>handleInputChange('subjective', e.target.value)} />
                </div>

                <h4 style={{marginTop:12}}>Data Objektif</h4>
                <div style={{marginTop:8}}>
                  <div className="two">
                    <div>
                      <label>Tekanan Darah</label>
                      <input value={assessment.vital_signs.blood_pressure} onChange={(e)=>handleInputChange('vital_signs.blood_pressure', e.target.value)} />
                    </div>
                    <div>
                      <label>Nadi</label>
                      <input value={assessment.vital_signs.pulse} onChange={(e)=>handleInputChange('vital_signs.pulse', e.target.value)} />
                    </div>
                  </div>

                  <div className="two" style={{marginTop:8}}>
                    <div>
                      <label>Suhu</label>
                      <input value={assessment.vital_signs.temperature} onChange={(e)=>handleInputChange('vital_signs.temperature', e.target.value)} />
                    </div>
                    <div>
                      <label>Pernapasan</label>
                      <input value={assessment.vital_signs.respiration} onChange={(e)=>handleInputChange('vital_signs.respiration', e.target.value)} />
                    </div>
                  </div>

                  <div className="two" style={{marginTop:8}}>
                    <div>
                      <label>Saturasi O2</label>
                      <input value={assessment.vital_signs.oxygen_saturation} onChange={(e)=>handleInputChange('vital_signs.oxygen_saturation', e.target.value)} placeholder="98%" />
                    </div>
                    <div>
                      <label>Pemeriksaan Fisik</label>
                      <textarea rows={3} value={assessment.pemeriksaan_fisik} onChange={(e)=>handleInputChange('pemeriksaan_fisik', e.target.value)} placeholder="Hasil pemeriksaan fisik, inspeksi, palpasi, perkusi, auskultasi..." />
                    </div>
                  </div>

                  <div style={{marginTop:8}}>
                    <label>Hasil Laboratorium</label>
                    <textarea rows={3} value={assessment.lab_results} onChange={(e)=>handleInputChange('lab_results', e.target.value)} />
                  </div>

                  <div style={{marginTop:8}}>
                    <label>Catatan Tambahan</label>
                    <textarea rows={2} value={assessment.additional_notes} onChange={(e)=>handleInputChange('additional_notes', e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{marginTop:12, color:'#556'}}>Pilih pasien terlebih dahulu untuk mengisi data assessment.</div>
          )}

          <div className="assessment-actions">
            <button className="assessment-button cancel" onClick={onClose} disabled={isSaving}>Batal</button>
            <button className="assessment-button save" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan Assessment'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
