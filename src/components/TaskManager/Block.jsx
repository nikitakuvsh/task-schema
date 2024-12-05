import React from "react";

function Block({ block, index, onMouseDown }) {
    return (
        <div
            id={`block-${index}`}
            className="task-manager__block"
            style={{
                left: `${block.x}px`,
                top: `${block.y}px`,
                width: `${block.width}px`,
                height: `${block.height}px`,
            }}
            onMouseDown={(e) => onMouseDown(e, index)}
        ></div>

    );
}

export default Block;
