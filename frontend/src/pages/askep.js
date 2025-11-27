import React, { useState, useEffect } from 'react';
import '../assets/Dashboard.css';
import '../assets/Askep.css';
import { db } from '../config/firebase';
import { ref, get } from 'firebase/database';
import Assessment from '../components/assessment';

const Askep = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [assessmentData, setAssessmentData] = useState({
    subjective: '',
    objective: '',
    vital_signs: {
      blood_pressure: '',
      pulse: '',
      temperature: '',
      respiration: '',
      oxygen_saturation: ''
    },
    lab_results: '',
    additional_notes: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('assessment');
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  // patients loaded from RTDB `pasien` node
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const pasienRef = ref(db, 'pasien');
        const snap = await get(pasienRef);
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
        console.error('Gagal memuat pasien dari RTDB', err);
        setPatients([]);
      }
    };
    loadPatients();
  }, []);

  // Contoh rencana yang dihasilkan AI
  const samplePlan = {
    nursing_diagnoses: [
      {
        id: 1,
        diagnosis: "Ketidakseimbangan nutrisi kurang dari kebutuhan tubuh",
        related_to: "Gangguan metabolisme glukosa",
        evidenced_by: "Kadar gula darah 250 mg/dL, penurunan berat badan 5 kg",
        priority: "Tinggi"
      },
      {
        id: 2,
        diagnosis: "Risiko ketidakstabilan kadar glukosa darah",
        related_to: "Kurangnya pengetahuan tentang manajemen diabetes",
        evidenced_by: "Pasien belum pernah mendapat edukasi diabetes",
        priority: "Sedang"
      }
    ],
    interventions: [
      {
        id: 1,
        diagnosis_id: 1,
        intervention: "Monitor kadar glukosa darah",
        rationale: "Untuk memantau efektivitas terapi dan mencegah komplikasi",
        frequency: "Setiap 6 jam"
      },
      {
        id: 2,
        diagnosis_id: 1,
        intervention: "Berikan diet sesuai program diabetes",
        rationale: "Mengontrol asupan karbohidrat untuk stabilitas gula darah",
        frequency: "Setiap makan"
      },
      {
        id: 3,
        diagnosis_id: 2,
        intervention: "Berikan edukasi tentang manajemen diabetes",
        rationale: "Meningkatkan pengetahuan pasien untuk self-care",
        frequency: "Setiap hari"
      }
    ],
    outcomes: [
      {
        id: 1,
        diagnosis_id: 1,
        outcome: "Kadar glukosa darah dalam rentang normal (80-140 mg/dL)",
        indicators: ["Gula darah puasa < 126 mg/dL", "Gula darah 2 jam PP < 140 mg/dL"],
        timeframe: "3 hari"
      },
      {
        id: 2,
        diagnosis_id: 2,
        outcome: "Pasien mampu melakukan self-monitoring gula darah",
        indicators: ["Dapat menggunakan glucometer", "Memahami jadwal pemeriksaan"],
        timeframe: "5 hari"
      }
    ]
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setAssessmentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAssessmentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleGeneratePlan = async () => {
    if (!selectedPatient || !assessmentData.subjective || !assessmentData.objective) {
      alert('Mohon lengkapi data pasien dan assessment terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    
    // Simulasi proses AI (dalam implementasi nyata, ini akan memanggil API)
    setTimeout(() => {
      setGeneratedPlan(samplePlan);
      setIsGenerating(false);
      setActiveTab('plan');
    }, 3000);
  };

  const handleSavePlan = () => {
    if (generatedPlan) {
      alert('Rencana asuhan keperawatan berhasil disimpan!');
      // Logic untuk menyimpan ke database
    }
  };

  const handleNewAssessment = () => {
    setSelectedPatient('');
    setAssessmentData({
      subjective: '',
      objective: '',
      vital_signs: {
        blood_pressure: '',
        pulse: '',
        temperature: '',
        respiration: '',
        oxygen_saturation: ''
      },
      lab_results: '',
      additional_notes: ''
    });
    setGeneratedPlan(null);
    setActiveTab('assessment');
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  // When a patient is selected, try to load full patient details and prefill assessment
  useEffect(() => {
    const loadPatientDetails = async () => {
      if (!selectedPatient) {
        setAssessmentData(prev => ({
          ...prev,
          subjective: '',
          objective: ''
        }));
        return;
      }
      try {
        const snap = await get(ref(db, `pasien/${selectedPatient}`));
        if (snap.exists()) {
          const p = snap.val();
          // Prefill subjective with diagnosis/notes if available
          const preSubjective = p.keluhan || p.subjective || (p.diagnosis ? `Diagnosis medis: ${p.diagnosis}\nRiwayat penyakit: ` : '');
          const preObjective = p.objective || '';
          setAssessmentData(prev => ({
            ...prev,
            subjective: preSubjective,
            objective: preObjective
          }));
        }
      } catch (err) {
        console.error('Gagal memuat detail pasien', err);
      }
    };
    loadPatientDetails();
  }, [selectedPatient]);

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div className="header-content">
          <h1>Rivero Tulenan</h1>
          <p className="header-subtitle">Buat rencana asuhan keperawatan</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowAssessmentModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Assessment Baru
          </button>
          {generatedPlan && (
            <button className="btn-primary" onClick={handleSavePlan}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H5c-1.1 0-1.99.9-1.99 2L4 19c0 1.1.89 2 2 2h10c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V7h10v2z"/>
              </svg>
              Simpan Rencana
            </button>
          )}
        </div>
      </div>
 

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'assessment' ? 'active' : ''}`}
          onClick={() => setActiveTab('assessment')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L4 19c0 1.1.89 2 2 2h10c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V7h10v2z"/>
          </svg>
          Assessment
        </button>
      </div>

      {/* Assessment Tab */}
      {activeTab === 'assessment' && (
        <div className="assessment-section">
          {/* Patient Selection */}
          <div className="form-section">
            <h3 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
              </svg>
              Pilih Pasien
            </h3>
            <div className="form-group">
              <select 
                className="form-select"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">-- Pilih Pasien --</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.rm}) - {patient.diagnosis}
                  </option>
                ))}
              </select>
              {selectedPatientData && (
                <div className="patient-info-card">
                  <div className="patient-details">
                    <h4>{selectedPatientData.name}</h4>
                    <p>No. RM: {selectedPatientData.rm}</p>
                    <p>Diagnosis Medis: {selectedPatientData.diagnosis}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subjective & Objective only show after a patient is selected */}
          {selectedPatient ? (
            <>
              {/* Subjective Data */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9H7v-2h6v2zm4-4H7V5h10v2z"/>
                  </svg>
                  Data Subjektif
                </h3>
                <div className="form-group">
                  <label>Keluhan Utama & Riwayat Penyakit</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="Masukkan keluhan pasien, riwayat penyakit, dan informasi subjektif lainnya..."
                    value={assessmentData.subjective}
                    onChange={(e) => handleInputChange('subjective', e.target.value)}
                  />
                </div>
              </div>

              {/* Objective Data */}
              <div className="form-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  Data Objektif
                </h3>
                
                {/* Vital Signs */}
                <div className="vital-signs-grid">
                  <div className="form-group">
                    <label>Tekanan Darah</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="120/80 mmHg"
                      value={assessmentData.vital_signs.blood_pressure}
                      onChange={(e) => handleInputChange('vital_signs.blood_pressure', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nadi</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="80 x/menit"
                      value={assessmentData.vital_signs.pulse}
                      onChange={(e) => handleInputChange('vital_signs.pulse', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Suhu</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="36.5°C"
                      value={assessmentData.vital_signs.temperature}
                      onChange={(e) => handleInputChange('vital_signs.temperature', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pernapasan</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="20 x/menit"
                      value={assessmentData.vital_signs.respiration}
                      onChange={(e) => handleInputChange('vital_signs.respiration', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Saturasi O2</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="98%"
                      value={assessmentData.vital_signs.oxygen_saturation}
                      onChange={(e) => handleInputChange('vital_signs.oxygen_saturation', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pemeriksaan Fisik</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="Hasil pemeriksaan fisik, inspeksi, palpasi, perkusi, auskultasi..."
                    value={assessmentData.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Hasil Laboratorium</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Hasil lab, rontgen, dan pemeriksaan penunjang lainnya..."
                    value={assessmentData.lab_results}
                    onChange={(e) => handleInputChange('lab_results', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Catatan Tambahan</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Informasi tambahan yang relevan..."
                    value={assessmentData.additional_notes}
                    onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="form-section">
              <p style={{color:'#556',padding:'1rem'}}>Pilih pasien terlebih dahulu untuk mengisi data subjektif dan objektif.</p>
            </div>
          )}
        </div>
      )}
      {/* Assessment modal opened from header */}
      <Assessment
        show={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onSave={(payload) => {
          // payload: { patientId, assessment }
          setShowAssessmentModal(false);
          if (payload?.patientId) setSelectedPatient(payload.patientId);
          if (payload?.assessment) setAssessmentData(payload.assessment);
        }}
      />

      {/* AI Generated Plan Tab */}
      {activeTab === 'plan' && generatedPlan && (
        <div className="plan-section">
          <div className="plan-header">
            <div className="plan-info">
              <h3>Rencana Asuhan Keperawatan</h3>
              <p>Pasien: {selectedPatientData?.name} ({selectedPatientData?.rm})</p>
              <p>Dibuat dengan AI pada: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
            <div className="ai-confidence">
              <div className="confidence-score">
                <span className="score">95%</span>
                <span className="label">AI Confidence</span>
              </div>
            </div>
          </div>

          {/* Nursing Diagnoses */}
          <div className="plan-section-content">
            <h4 className="plan-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L4 19c0 1.1.89 2 2 2h10c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V7h10v2z"/>
              </svg>
              Diagnosis Keperawatan
            </h4>
            <div className="diagnoses-list">
              {generatedPlan.nursing_diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="diagnosis-card">
                  <div className="diagnosis-header">
                    <h5>{diagnosis.diagnosis}</h5>
                    <span className={`priority-badge ${diagnosis.priority.toLowerCase()}`}>
                      {diagnosis.priority}
                    </span>
                  </div>
                  <div className="diagnosis-details">
                    <p><strong>Berhubungan dengan:</strong> {diagnosis.related_to}</p>
                    <p><strong>Ditandai dengan:</strong> {diagnosis.evidenced_by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interventions */}
          <div className="plan-section-content">
            <h4 className="plan-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Intervensi Keperawatan
            </h4>
            <div className="interventions-list">
              {generatedPlan.interventions.map((intervention) => (
                <div key={intervention.id} className="intervention-card">
                  <div className="intervention-content">
                    <h6>{intervention.intervention}</h6>
                    <p className="rationale"><strong>Rasional:</strong> {intervention.rationale}</p>
                    <div className="intervention-meta">
                      <span className="frequency">Frekuensi: {intervention.frequency}</span>
                    </div>
                  </div>
                  <div className="intervention-actions">
                    <button className="btn-small">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div className="plan-section-content">
            <h4 className="plan-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L18 22l-6-3.15L6 22l1.91-7.26L2 9l6.91-1.74L12 2z"/>
              </svg>
              Kriteria Hasil (NOC)
            </h4>
            <div className="outcomes-list">
              {generatedPlan.outcomes.map((outcome) => (
                <div key={outcome.id} className="outcome-card">
                  <div className="outcome-header">
                    <h6>{outcome.outcome}</h6>
                    <span className="timeframe">Target: {outcome.timeframe}</span>
                  </div>
                  <div className="outcome-indicators">
                    <p><strong>Indikator:</strong></p>
                    <ul>
                      {outcome.indicators.map((indicator, index) => (
                        <li key={index}>{indicator}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Askep;
