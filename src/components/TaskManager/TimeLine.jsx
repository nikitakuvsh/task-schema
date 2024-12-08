// Timeline.js
import React from "react";

function Timeline({ startDate, endDate }) {
    return (
        <div className="task-manager__timeline-wrapper">
            <span className="task-manager__timeline timeline-start">{startDate.toLocaleString()}</span>
            <span className="task-manager__timeline timeline-end">{endDate.toLocaleString()}</span>
        </div>
    );
}

export default Timeline;
