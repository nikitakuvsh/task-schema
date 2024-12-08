// Timeline.js
import React from "react";

function Timeline({ startDate, endDate }) {
    return (
        <div className="task-manager__timeline-wrapper">
            <span className="task-manager__timeline timeline-start">{startDate}</span>
            <span className="task-manager__timeline timeline-end">{endDate}</span>
        </div>
    );
}

export default Timeline;
