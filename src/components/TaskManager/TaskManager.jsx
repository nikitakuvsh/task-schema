import React, { useState, useRef, useEffect } from "react";
import Block from "./Block";
import LeaderLines from "./LeaderLines";
import Timeline from "./TimeLine";
import "./TaskManager.css";

function TaskManager() {
    const [blocks, setBlocks] = useState([]);
    const [draggingButton, setDraggingButton] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [draggingBlockIndex, setDraggingBlockIndex] = useState(null);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
    const [planeOffset, setPlaneOffset] = useState({ x: -5000, y: -5000 });
    const [draggingPlane, setDraggingPlane] = useState(false);
    const [startPlaneDrag, setStartPlaneDrag] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    // Для timeline
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const timeInterval = 12 * 60 * 60 * 1000; // 12 часов

    const updateTimeline = () => {
        const newStartDate = new Date(startDate.getTime() - planeOffset.x * 1000 / scale);
        const newEndDate = new Date(newStartDate.getTime() + timeInterval / scale);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const handleAddTaskMouseDown = (e) => {
        setDraggingButton(true);
        setCurrentBlock({
            x: e.clientX - planeOffset.x,
            y: e.clientY - planeOffset.y,
            width: 200,
            height: 200,
        });
    };

    const handleMouseMove = (e) => {
        if (draggingPlane) {
            const deltaX = (e.clientX - startPlaneDrag.x) / 1.3;
            const deltaY = (e.clientY - startPlaneDrag.y) / 1.3;
            setPlaneOffset((prev) => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY,
            }));
            setStartPlaneDrag({ x: e.clientX, y: e.clientY });
        }
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
        e.stopPropagation();
        setDraggingBlockIndex(index);
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const handlePlaneMouseDown = (e) => {
        if (!draggingButton && draggingBlockIndex === null) {
            setDraggingPlane(true);
            setStartPlaneDrag({ x: e.clientX, y: e.clientY });
        }
    };

    // Обновляем timeline при изменении scale или planeOffset
    useEffect(() => {
        updateTimeline();
    }, [scale, planeOffset]);

    const handleCreateConnectedBlock = (sourceIndex) => {
        setBlocks((prev) => {
            const sourceBlock = prev[sourceIndex];
            const newBlock = {
                x: sourceBlock.x + 250, // Расстояние справа от исходного блока
                y: sourceBlock.y,
                width: 200,
                height: 200,
            };
            return [...prev, newBlock];
        });
    };
    

    return (
        <div
            className="task-manager"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <button className="task-manager__button button--add-task" onMouseDown={handleAddTaskMouseDown}>Добавить задачу</button>
            <Timeline startDate={startDate.toLocaleString()} endDate={endDate.toLocaleString()}/>
            <div
                className="task-manager__plane"
                onMouseDown={handlePlaneMouseDown}
                style={{
                    transform: `translate(${planeOffset.x}px, ${planeOffset.y}px) scale(${scale})`,
                }}
            >
                {blocks.map((block, index) => (
                    <Block
                        key={index}
                        index={index}
                        block={block}
                        onMouseDown={handleBlockMouseDown}
                        onCreateConnectedBlock={handleCreateConnectedBlock}
                    />
                ))}
                {draggingButton && currentBlock && (
                    <div
                        className="task-manager__block task-manager__block--temp"
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
                <button className="task-manager__button button--save-schema">Скачать схему</button>
                <button className="task-manager__button button--load-schema">Загрузить схему</button>
                <button className="task-manager__button button--save">Сохранить</button>
            </div>
        </div>
    );
}

export default TaskManager;
