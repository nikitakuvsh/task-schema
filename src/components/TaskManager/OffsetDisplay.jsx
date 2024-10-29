import React from 'react';

function OffsetDisplay({ offsetX, offsetY }) {
    return (
        <div className="offset-display">
            Координаты смещения: X: {offsetX}, Y: {offsetY}
        </div>
    );
}

export default OffsetDisplay;
