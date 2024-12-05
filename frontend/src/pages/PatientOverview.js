import React, { useState } from 'react';
import './styles/PatientOverview.css';

const PatientOverview = () => {
  const [sortBy, setSortBy] = useState('healthStatus');
  const [feedback, setFeedback] = useState('');

  return (
    <div className="patient-overview">
      <div className="profile-section">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-picture"
        />
        <h2 className="patient-name">John Doe</h2>
        <div className="share-records">
          <label>
            <input type="checkbox" /> Share Records w/ other therapists
          </label>
        </div>
      </div>

      <div className="overview-cards-section">
        <div className="overview-card">
          <h3>Patient Survey Answers</h3>
          <div className="overview-card-content scrollable">
            {Array.from({ length: 20 }).map((_, i) => (
              <button key={i} className="overview-card-row">
                {`2023-11-${i + 1 < 10 ? '0' : ''}${i + 1} - ${
                  i % 2 === 0 ? 'Daily Survey' : 'Custom Survey'
                }`}
              </button>
            ))}
          </div>
        </div>

        <div className="overview-card">
          <h3>Notes</h3>
          <div className="overview-card-content scrollable">
            {Array.from({ length: 20 }).map((_, i) => (
              <button key={i} className="overview-card-row">
                {`2023-11-${i + 1 < 10 ? '0' : ''}${i + 1} - ${
                  i % 2 === 0 ? 'Patient was responsive' : 'Follow-up needed'
                }`}
              </button>
            ))}
          </div>
          <button className="add-note-btn">Add Note</button>
        </div>

        <div className="overview-card">
          <h3>Feedback</h3>
          <div className="overview-card-content scrollable">
            {Array.from({ length: 10 }).map((_, i) => (
              <button key={i} className="overview-card-row">
                {`2023-11-${i + 1 < 10 ? '0' : ''}${i + 1} - ${
                  i % 2 === 0 ? 'Excellent progress' : 'Needs improvement'
                }`}
              </button>
            ))}
          </div>
          <textarea
            className="feedback-textbox"
            placeholder="Write feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button className="send-feedback-btn">Send</button>
        </div>
      </div>

      <div className="graph-section">
        <h3>Patient Health Graph</h3>
        <div className="graph-placeholder">
          <p>Graph will be displayed here.</p>
        </div>
        <div className="graph-controls">
          <label htmlFor="sort">Sort Graph By:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="healthStatus">Health Status</option>
            <option value="dateRange">Date Range</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PatientOverview;



