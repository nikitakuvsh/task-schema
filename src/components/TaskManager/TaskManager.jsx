import React, { useState } from "react";
import "./TaskManager.css";

function TaskManager() {
    const [blocks, setBlocks] = useState([]); // Массив блоков
    const [draggingButton, setDraggingButton] = useState(false); // Перетаскивается ли новый блок
    const [currentBlock, setCurrentBlock] = useState(null); // Координаты текущего блока
    const [draggingBlockIndex, setDraggingBlockIndex] = useState(null); // Индекс перетаскиваемого блока
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 }); // Начальная позиция мыши для перетаскивания блока
    const [planeOffset, setPlaneOffset] = useState({ x: -5000, y: -5000 }); // Смещение плоскости
    const [draggingPlane, setDraggingPlane] = useState(false); // Перетаскивается ли плоскость
    const [startPlaneDrag, setStartPlaneDrag] = useState({ x: 0, y: 0 }); // Начальная позиция мыши для перетаскивания плоскости

    const handleAddTaskMouseDown = (e) => {
        setDraggingButton(true);
        const startX = e.clientX - planeOffset.x;
        const startY = e.clientY - planeOffset.y;
        setCurrentBlock({ x: startX, y: startY, width: 200, height: 200 });
    };

    const handleMouseMove = (e) => {
        // Перетаскивание плоскости
        if (draggingPlane) {
            const deltaX = e.clientX - startPlaneDrag.x;
            const deltaY = e.clientY - startPlaneDrag.y;
            setPlaneOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
            setStartPlaneDrag({ x: e.clientX, y: e.clientY });
        }

        // Перетаскивание блока
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

        // Перемещение нового блока
        if (draggingButton && currentBlock) {
            setCurrentBlock((prev) => ({
                ...prev,
                x: e.clientX - planeOffset.x - 50,
                y: e.clientY - planeOffset.y - 50,
            }));
        }
    };

    const handleMouseUp = () => {
        if (draggingButton && currentBlock) {
            setBlocks((prev) => [...prev, currentBlock]);
            setDraggingButton(false);
            setCurrentBlock(null);
        }
        setDraggingBlockIndex(null);
        setDraggingPlane(false);
    };

    const handleBlockMouseDown = (e, index) => {
        e.stopPropagation(); // Останавливаем всплытие события
        setDraggingBlockIndex(index);
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const handlePlaneMouseDown = (e) => {
        if (!draggingButton && draggingBlockIndex === null) {
            setDraggingPlane(true);
            setStartPlaneDrag({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div className="task-manager" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <button className="task-manager__button button--add-task" onMouseDown={handleAddTaskMouseDown} >Добавить задачу</button>
            <div className="task-manager__plane" onMouseDown={handlePlaneMouseDown}
                style={{
                    transform: `translate(${planeOffset.x}px, ${planeOffset.y}px)`,
                }}
            >
                {blocks.map((block, index) => (
                    <div key={index} className="task-manager__block"
                        style={{
                            left: `${block.x}px`,
                            top: `${block.y}px`,
                            width: `${block.width}px`,
                            height: `${block.height}px`,
                        }}
                        onMouseDown={(e) => handleBlockMouseDown(e, index)}
                    ></div>
                ))}
                {draggingButton && currentBlock && (
                    <div className="task-manager__block task-manager__block--temp"
                        style={{
                            left: `${currentBlock.x}px`,
                            top: `${currentBlock.y}px`,
                            width: `${currentBlock.width}px`,
                            height: `${currentBlock.height}px`,
                        }}
                    ></div>
                )}
            </div>
            <div className="task-manager__buttons-container">
                <button className="task-manager__button button--save-schema">Save schema</button>
                <button className="task-manager__button button--load-schema">Load schema</button>
            </div>
        </div>
    );
}

export default TaskManager;
