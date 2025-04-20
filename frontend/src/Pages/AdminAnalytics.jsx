
import React, { useState } from 'react';
// import axios from 'axios';
import { privateAxios } from '../api/axios';
import '../Styles/AdminAnalytics.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminAnalytics() {
  const [monthYear, setMonthYear] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // const token = localStorage.getItem('authToken');
      // const response = await axios.get(
      //   `${process.env.REACT_APP_BACKEND}/api/admin/analytics`, {
      //     params: { monthYear },
      //     headers: {
      //       'Authorization': `Bearer ${token}`
      //     }
      //   }
      // );

      const response = await privateAxios.get('/api/admin/analytics', {
        params: { monthYear }
      });
      
      setAnalyticsData(response.data);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const ageGroupData = [
    { name: 'Under 18', count: analyticsData?.ageGroups?.under18 || 0 },
    { name: '18-30', count: analyticsData?.ageGroups?.['18-30'] || 0 },
    { name: '30-45', count: analyticsData?.ageGroups?.['30-45'] || 0 },
    { name: '45-60', count: analyticsData?.ageGroups?.['45-60'] || 0 },
    { name: '60+', count: analyticsData?.ageGroups?.above60 || 0 },
  ];

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Camp Analytics Dashboard</h1>

      <form onSubmit={handleSubmit} className="analytics-form">
        <div className="analytics-form-group">
          <label>Select Month</label>
          <input
            type="month"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="analytics-submit-btn"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Generate Analytics'}
        </button>
      </form>

      {error && (
        <div className="analytics-error">
          {error}
        </div>
      )}

      {analyticsData && (
        <div className="analytics-results">
          <div className="gender-distribution">
            <h2>Gender Distribution</h2>
            <div className="gender-stats">
              <div className="stat-box">
                <h3>Male Patients</h3>
                <p>{analyticsData.genderCount.male || 0}</p>
              </div>
              <div className="stat-box">
                <h3>Female Patients</h3>
                <p>{analyticsData.genderCount.female || 0}</p>
              </div>
            </div>
          </div>

          <div className="age-distribution">
            <h2>Age Group Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#33b48b" name="Number of Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAnalytics;
