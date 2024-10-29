import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import Draggable from "react-draggable";
import './TaskManager.css';
import Connection from "./Connection"; // Добавляем компонент Connection

function TaskManager() {
    const [blocks, setBlocks] = useState([]);
    const [connections, setConnections] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);

    const createBlock = () => {
        const newBlock = { id: blocks.length, width: 100, height: 100, x: 20, y: 20 + blocks.length * 120 };
        setBlocks([...blocks, newBlock]);
    };

    const handleBlockDragStop = (index, data) => {
        setBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[index] = {
                ...updatedBlocks[index],
                x: data.x - offsetX,
                y: data.y - offsetY,
            };
            return updatedBlocks;
        });
    };

    const handleResizeStop = (index, data) => {
        setBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[index] = {
                ...updatedBlocks[index],
                width: data.size.width,
                height: data.size.height,
            };
            return updatedBlocks;
        });
    };

    const connectBlocks = (fromIndex, toIndex) => {
        const fromBlock = blocks[fromIndex];
        const toBlock = blocks[toIndex];
        
        setConnections([...connections, { from: fromBlock.id, to: toBlock.id }]);
    };

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

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="scheme-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <select className="scheme__select" id="timeframe-selector">
                <option className="scheme__option" value="day">День</option>
                <option className="scheme__option" value="week">Неделя</option>
                <option className="scheme__option" value="month">Месяц</option>
                <option className="scheme__option" value="year">Год</option>
            </select>

            <button className="scheme__add-button" onClick={createBlock}>
                Создать блок
            </button>

            <div className="palette" id="block-pallete"></div>
            <div
                className="paper"
                id="paper"
                style={{
                    position: 'relative',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    backgroundPosition: `${offsetX}px ${offsetY}px`
                }}
                onMouseDown={handleMouseDown}
            >
                {/* Рисуем соединения через компонент Connection */}
                {connections.map((conn, index) => {
                    const fromBlock = blocks.find(block => block.id === conn.from);
                    const toBlock = blocks.find(block => block.id === conn.to);
                    return (
                        <Connection
                            key={index}
                            from={fromBlock}
                            to={toBlock}
                            offsetX={offsetX}
                            offsetY={offsetY}
                        />
                    );
                })}

                {/* Блоки */}
                {blocks.map((block, index) => (
                    <Draggable
                        key={block.id}
                        position={{ x: block.x + offsetX, y: block.y + offsetY }}
                        onStop={(e, data) => handleBlockDragStop(index, data)}
                    >
                        <ResizableBox
                            className="paper__block"
                            width={block.width}
                            height={block.height}
                            minConstraints={[50, 50]}
                            // maxConstraints={[300, 300]}
                            resizeHandles={["se"]}
                            onResizeStart={(e) => e.stopPropagation()}
                            onResizeStop={(e, data) => handleResizeStop(index, data)}
                        >
                            <div className="resizable-content">
                                Блок {index + 1}
                                {index > 0 && (
                                    <button onClick={() => connectBlocks(index - 1, index)}>Соединить с предыдущим</button>
                                )}
                            </div>
                        </ResizableBox>
                    </Draggable>
                ))}
            </div>

            <button className="task-manager__button" id="save-btn">Save Schema</button>
            <button className="task-manager__button" id="load-btn">Load Schema</button>

            {/* Координаты смещения */}
            <div className="offset-display">
                Координаты смещения: X: {offsetX}, Y: {offsetY}
            </div>
        </div>
    );
}

export default TaskManager;
