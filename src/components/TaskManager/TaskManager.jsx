import React, { useState, useRef, useEffect } from "react";
import Block from "./Block";
import LeaderLines from "./LeaderLines";
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
    const [startDate, setStartDate] = useState(new Date()); // Начальная дата для шкалы времени
    const [endDate, setEndDate] = useState(new Date()); // Конечная дата для шкалы времени
    const [scale, setScale] = useState(1); // Масштаб доски (1 - нормальный, больше - увеличено, меньше - уменьшено)

    const timeInterval = 12 * 60 * 60 * 1000; // 12 часов в миллисекундах

    const handleAddTaskMouseDown = (e) => {
        setDraggingButton(true);
        const startX = e.clientX - planeOffset.x;
        const startY = e.clientY - planeOffset.y;
        setCurrentBlock({ x: startX, y: startY, width: 200, height: 200 });
    };

    const handleMouseMove = (e) => {
        // Перетаскивание плоскости
        if (draggingPlane) {
            const deltaX = (e.clientX - startPlaneDrag.x) / 1.3;
            const deltaY = (e.clientY - startPlaneDrag.y) / 1.3;
            setPlaneOffset((prev) => {
                const newOffset = { x: prev.x + deltaX, y: prev.y + deltaY };
                
                // Обновляем startDate и endDate с интервалом 12 часов
                const newStartDate = new Date(new Date() - newOffset.x * 1000);
                setStartDate(newStartDate);
                setEndDate(new Date(newStartDate.getTime() + timeInterval)); // 12 часов от начала

                return newOffset;
            });
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

    // Обработка колесика мыши для изменения масштаба
    const handleWheel = (e) => {
        e.preventDefault();
        const scaleDelta = e.deltaY < 0 ? 1.1 : 0.9; // Увеличение или уменьшение масштаба
        setScale((prevScale) => {
            const newScale = prevScale * scaleDelta;
            return Math.min(Math.max(newScale, 0.1), 3); // Ограничиваем масштаб от 0.1 до 3
        });
    };

    // Обновление времени на шкале при изменении масштаба
    useEffect(() => {
        const newTimeInterval = timeInterval * scale; // Увеличиваем или уменьшаем интервал времени в зависимости от масштаба
        setStartDate(new Date(startDate.getTime()));
        setEndDate(new Date(startDate.getTime() + newTimeInterval));
    }, [scale, startDate]);

    return (
        <div className="task-manager" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onWheel={handleWheel}>
            <button className="task-manager__button button--add-task" onMouseDown={handleAddTaskMouseDown}>Добавить задачу</button>
            <div className="task-manager__timeline-wrapper">
                <span className="task-manager__timeline timeline-start">
                    {startDate.toLocaleString()} {/* Выводим начальную дату */}
                </span>
                <span className="task-manager__timeline timeline-end">
                    {endDate.toLocaleString()} {/* Выводим конечную дату */}
                </span>
            </div>
            <div className="task-manager__plane" onMouseDown={handlePlaneMouseDown}
                style={{
                    transform: `translate(${planeOffset.x}px, ${planeOffset.y}px) scale(${scale})`,
                }}
            >
                {blocks.map((block, index) => (
                    <Block key={index} index={index} block={block} onMouseDown={handleBlockMouseDown} />
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
                <LeaderLines blocks={blocks} planeOffset={planeOffset} />
            </div>
            <div className="task-manager__buttons-container">
                <button className="task-manager__button button--save-schema">Save schema</button>
                <button className="task-manager__button button--load-schema">Load schema</button>
            </div>
        </div>
    );
}

export default TaskManager;
