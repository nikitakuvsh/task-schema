import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Подключаем стили библиотеки
import Draggable from "react-draggable";
import './TaskManager.css';

function TaskManager() {
    const [blocks, setBlocks] = useState([]);
    const [connections, setConnections] = useState([]);

    const createBlock = () => {
        const newBlock = { id: blocks.length, width: 100, height: 100, x: 20, y: 20 + blocks.length * 120 };
        setBlocks([...blocks, newBlock]);
    };

    const handleBlockDragStop = (index, data) => {
        setBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[index] = {
                ...updatedBlocks[index],
                x: data.x,
                y: data.y,
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

    return (
        <div className="scheme-container">
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
            <div className="paper" id="paper" style={{ position: 'relative' }}>
                {/* Рисуем стрелки */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    {connections.map((conn, index) => {
                        const fromBlock = blocks.find(block => block.id === conn.from);
                        const toBlock = blocks.find(block => block.id === conn.to);

                        if (!fromBlock || !toBlock) return null; // Проверка на существование блоков

                        // Определяем координаты стрелки
                        const fromX = fromBlock.x + fromBlock.width;
                        const fromY = fromBlock.y + fromBlock.height; // Низ блока
                        const toX = toBlock.x + toBlock.width / 2;
                        const toY = toBlock.y; // Верх блока

                        // Корректируем положение стрелки, чтобы она немного "заходила" на блоки
                        const offset = 90; // Смещение для стрелок
                        return (
                            <path
                                key={`connection-${index}`}
                                d={`M ${fromX} ${fromY} C ${(fromX + toX) / 2} ${fromY + 50}, ${(fromX + toX) / 2} ${toY - 50}, ${toX} ${toY + offset}`}
                                fill="transparent"
                                stroke="black"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                        </marker>
                    </defs>
                </svg>

                {/* Блоки */}
                {blocks.map((block, index) => (
                    <Draggable
                        key={block.id}
                        position={{ x: block.x, y: block.y }}
                        bounds="#paper"
                        onStop={(e, data) => handleBlockDragStop(index, data)}
                    >
                        <ResizableBox
                            className="paper__block"
                            width={block.width}
                            height={block.height}
                            minConstraints={[50, 50]} // Минимальный размер
                            maxConstraints={[300, 300]} // Максимальный размер
                            resizeHandles={["se"]} // Ручка изменения размера в правом нижнем углу
                            onResizeStart={(e) => {
                                e.stopPropagation(); // Останавливаем событие, чтобы не перетаскивать блок
                            }}
                            onResizeStop={(e, data) => handleResizeStop(index, data)}
                        >
                            <div className="resizable-content">
                                Блок {index + 1}
                                {/* Добавьте кнопку или логику для соединения блоков */}
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
        </div>
    );
}

export default TaskManager;
