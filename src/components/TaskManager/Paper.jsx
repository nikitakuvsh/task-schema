import React, { useState } from 'react';
import Block from './Block';
import Connection from './Connection';

function Paper({ blocks, connections, offsetX, offsetY, setOffsetX, setOffsetY, onBlockPositionUpdate, onBlockSizeUpdate, onConnectBlocks }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);

    const handleMouseDown = (e) => {
        if (e.target.id === "paper") {
            setIsDragging(true);
            setDragStartX(e.clientX - offsetX);
            setDragStartY(e.clientY - offsetY);
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setOffsetX(e.clientX - dragStartX);
            setOffsetY(e.clientY - dragStartY);
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div
            className="paper"
            id="paper"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ backgroundPosition: `${offsetX}px ${offsetY}px` }}
        >
            <svg className="connections">
                {connections.map((conn, index) => (
                    <Connection
                        key={index}
                        from={blocks.find(block => block.id === conn.from)}
                        to={blocks.find(block => block.id === conn.to)}
                        offsetX={offsetX}
                        offsetY={offsetY}
                    />
                ))}
            </svg>
            {blocks.map((block, index) => (
                <Block
                    key={block.id}
                    index={index}
                    block={block}
                    offsetX={offsetX}
                    offsetY={offsetY}
                    onPositionUpdate={onBlockPositionUpdate}
                    onSizeUpdate={onBlockSizeUpdate}
                    onConnect={onConnectBlocks}
                />
            ))}
        </div>
    );
}

export default Paper;
