import React, { useState } from "react";

function Block({ block, index, onMouseDown }) {
    const [nameTask, setNameTask] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    const handleRightClick = (e) => {
        e.preventDefault();
        setShowMenu(true);
    };

    const handleOptionClick = (option) => {
        console.log(`Selected option: ${option}`);
        setShowMenu(false);
    };

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
            onContextMenu={handleRightClick}
        >
            <h3 className="block__title">{nameTask || `Блок ${index + 1}`}</h3>
            {showMenu && (
                <ul
                    className="block__menu"
                    style={{
                        top: `${block.y + block.height + 10}px`,
                        left: `${block.x}px`,
                    }}
                >
                    <li onClick={() => handleOptionClick("Редактировать")}>Редактировать</li>
                    <li onClick={() => handleOptionClick("Удалить")}>Удалить</li>
                    <li onClick={() => handleOptionClick("Подробнее")}>Подробнее</li>
                </ul>
            )}
        </div>
    );
}

export default Block;
