import React from 'react';
import './ProblemCard.css'; // Fayl nomiga mos ravishda ulandi

const ProblemCard = ({ title, description, responsible, status, deadline }) => {
    return (
        <div className={`problem-card-box ${status}`}>
            <div className="problem-card-header">
                <h4 className="problem-title">{title}</h4>
                <span className={`status-badge-card ${status}`}>{status.toUpperCase()}</span>
            </div>
            <p className="problem-desc">{description}</p>
            <div className="problem-footer">
                <span className="problem-meta">👤 Mas’ul: {responsible}</span>
                <span className="problem-meta">📅 Muddat: {deadline}</span>
            </div>
        </div>
    );
};

export default ProblemCard;
