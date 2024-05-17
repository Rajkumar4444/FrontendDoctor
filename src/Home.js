
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditPatient from './EditPatient';

const Home = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [editPatientId, setEditPatientId] = useState(null);

  useEffect(() => {
    const fetchPatientAndDoctors = async () => {
      try {
        const patientsResponse = await axios.get('https://backendhospital-ji3g.onrender.com/patients');
        const doctorsResponse = await axios.get('https://backendhospital-ji3g.onrender.com/doctors');
        setPatients(patientsResponse.data);
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error('Error Fetching Data:', error);
      }
    };
    fetchPatientAndDoctors();
  }, []);

  const handleDoctorChange = (event) => {
    const selectedDoctorId = parseInt(event.target.value);
    setSelectedDoctorId(selectedDoctorId);
  };

  const filteredPatients = selectedDoctorId
    ? patients.filter((patient) => patient.doctor?.id === selectedDoctorId)
    : patients;

  const handleEdit = (patientId) => {
    setEditPatientId(patientId);
  };

  const handleUpdate = () => {
    setEditPatientId(null);
  };

  const handleDelete = async (patientId) => {
    try {
      await axios.delete(`https://backendhospital-ji3g.onrender.com/patients/${patientId}`);
      setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleCloseEdit = () => {
    setEditPatientId(null);
  };

  return (
    <center>
      <div>
        <h2>Patients</h2>
        <label>Select Doctor: </label>
        <select onChange={handleDoctorChange}>
          <option value={null}>All Doctors</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specalization}
            </option>
          ))}
        </select>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Weight</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Disease</th>
              <th>Doctor</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.weight}</td>
                <td>{patient.gender}</td>
                <td>{patient.age}</td>
                <td>{patient.disease}</td>
                <td>
                  {patient.doctor?.name} - {patient.doctor?.specalization}
                </td>
                <td>
                  <button onClick={() => handleEdit(patient.id)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(patient.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editPatientId !== null && (
          <EditPatient
            patientId={editPatientId}
            onClose={handleCloseEdit}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </center>
  );
};

export default Home;