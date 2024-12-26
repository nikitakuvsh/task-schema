// Timeline.js
import React from "react";

function Timeline({ startDate, endDate, isDarkTheme }) {
    return (
        <div className="task-manager__timeline-wrapper">
            <span className={`task-manager__timeline timeline-start ${isDarkTheme ? 'dark' : 'light'}`}>{startDate}</span>
            <span className={`task-manager__timeline timeline-end ${isDarkTheme ? 'dark' : 'light'}`}>{endDate}</span>
        </div>
    );
}

export default Timeline;
