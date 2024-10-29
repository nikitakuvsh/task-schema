import React from 'react';

const Connection = ({ from, to, offsetX, offsetY }) => {
    if (!from || !to) return null;

    const fromX = from.x + from.width;
    const fromY = from.y + from.height;
    const toX = to.x + to.width / 2;
    const toY = to.y + to.height / 1.2;

    return (
        <svg className='schema-svg'>
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
            </defs>
            <path
                d={`M ${fromX + offsetX} ${fromY + offsetY} 
                    C ${(fromX + toX) / 2 + offsetX} ${fromY + 50 + offsetY}, 
                    ${(fromX + toX) / 2 + offsetX + 100} ${toY - 100 + offsetY}, 
                    ${toX + offsetX} ${toY + offsetY}`}
                fill="transparent"
                stroke="black"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
            />
        </svg>
    );
};

export default Connection;
