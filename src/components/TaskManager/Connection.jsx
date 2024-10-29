import React from 'react';

const Connection = ({ from, to }) => {
    if (!from || !to) return null;

    // Координаты центра блоков
    const fromCenterX = from.x + from.width / 2;
    const fromCenterY = from.y + from.height / 2;
    const toCenterX = to.x + to.width / 2;
    const toCenterY = to.y + to.height / 2;

    // Положение контрольных точек для плавной кривой
    const controlOffsetY = -90; // Регулируемое смещение для плавности кривой
    const controlPoint1X = fromCenterX;
    const controlPoint1Y = fromCenterY + controlOffsetY;
    const controlPoint2X = toCenterX;
    const controlPoint2Y = toCenterY + controlOffsetY;

    return (
        <svg>
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                </marker>
            </defs>
            <path
                d={`M ${fromCenterX} ${fromCenterY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${toCenterX} ${toCenterY}`}
                fill="transparent"
                stroke="black"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
            />
        </svg>
    );
};

export default Connection;
