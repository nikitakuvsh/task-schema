import React, { useState } from "react";
import "./TaskManager.css";

function TaskManager() {
    const [blocks, setBlocks] = useState([]);
    const [draggingBlockIndex, setDraggingBlockIndex] = useState(null);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e, index) => {
        setDraggingBlockIndex(index);
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (draggingBlockIndex !== null) {
            const deltaX = e.clientX - startDrag.x;
            const deltaY = e.clientY - startDrag.y;
            setBlocks((prev) =>
                prev.map((block, index) =>
                    index === draggingBlockIndex
                        ? { ...block, x: block.x + deltaX, y: block.y + deltaY }
                        : block
                )
            );
            setStartDrag({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setDraggingBlockIndex(null);
    };

    const handleAddTask = () => {
        setBlocks((prev) => [
            ...prev,
            { x: 100, y: 100, width: 200, height: 100 },
        ]);
    };

    return (
        <div
            className="task-manager"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <button
                className="task-manager__button button--add-task"
                onClick={handleAddTask}
            >
                Добавить задачу
            </button>

            {/* Таймлайн */}
            <div className="task-manager__timeline">
                {/* Место для таймлайна */}
            </div>

            {/* Доска */}
            <div className="task-manager__plane">
                {blocks.map((block, index) => (
                    <div
                        key={index}
                        className="task-manager__block"
                        style={{
                            position: "absolute",
                            left: `${block.x}px`,
                            top: `${block.y}px`,
                            width: `${block.width}px`,
                            height: `${block.height}px`,
                            backgroundColor: "lightblue",
                            border: "1px solid #000",
                        }}
                        onMouseDown={(e) => handleMouseDown(e, index)}
                    >
                        Задача {index + 1}
                    </div>
                ))}
            </div>

            {/* Кнопки сохранения/загрузки схем */}
            <div className="task-manager__buttons-container">
                <button className="task-manager__button button--save-schema">
                    Скачать схему
                </button>
                <button className="task-manager__button button--load-schema">
                    Загрузить схему
                </button>
                <button className="task-manager__button button--save">Сохранить</button>
            </div>
        </div>
    );
}

export default TaskManager;
