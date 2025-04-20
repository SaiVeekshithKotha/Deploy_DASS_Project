import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { privateAxios } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/ViewVolunteer.css';

function ViewVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND || 'http://localhost:5002';

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      // const response = await axios.get(`${BACKEND_URL}/api/admin/get_volunteers`);
      const response = await privateAxios.get('/api/admin/get_volunteers');
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      alert('Error fetching volunteers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (volunteerId) => {
    // Navigate to volunteer profile page
    navigate(`/volunteer/${volunteerId}`);
  };

  return (
    <div className="volunteer-container">
      <h1>Volunteers</h1>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading volunteers...</p>
        </div>
      ) : volunteers.length === 0 ? (
        <div className="no-data-container">
          <i className="fas fa-user-times fa-3x"></i>
          <p>No volunteers found.</p>
          <button 
            className="add-volunteer-button" 
            onClick={() => navigate('/add-volunteer')}
          >
            Add New Volunteer
          </button>
        </div>
      ) : (
        <>
          <div className="actions-bar">
            <button 
              className="add-volunteer-button" 
              onClick={() => navigate('/add-volunteer')}
            >
              Add New Volunteer
            </button>
          </div>
          
          <div className="volunteer-table-container">
            <table className="volunteer-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer._id} onClick={() => handleRowClick(volunteer._id)}>
                    <td>{volunteer.user_name}</td>
                    <td>{volunteer.user_phone_no || '-'}</td>
                    <td className="action-cell">
                      <div className="tap-details">Tap to view details</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewVolunteers;