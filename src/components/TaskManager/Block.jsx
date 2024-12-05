import React, { useState } from "react";

function Block({ block, index, onMouseDown }) {
    const [nameTask, setNameTask] = useState("");
    
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
        >
            <h3 className="block__title">{nameTask || `Блок ${index + 1}`}</h3>
        </div>
    );
}

export default Block;
