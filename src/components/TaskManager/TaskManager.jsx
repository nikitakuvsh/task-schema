import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Подключаем стили библиотеки
import Draggable from "react-draggable";
import './TaskManager.css';

function TaskManager() {
    const [blocks, setBlocks] = useState([]);

    const createBlock = () => {
        setBlocks([...blocks, { id: blocks.length, width: 100, height: 100 }]);
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
            <div className="paper" id="paper">
                {blocks.map((block, index) => (
                    <Draggable key={block.id} bounds="#paper">
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
                            onResizeStop={(e, data) => {
                                setBlocks((prevBlocks) => {
                                    const updatedBlocks = [...prevBlocks];
                                    updatedBlocks[index] = {
                                        ...updatedBlocks[index],
                                        width: data.size.width,
                                        height: data.size.height,
                                    };
                                    return updatedBlocks;
                                });
                            }}
                        >
                            <div className="resizable-content">
                                Блок {index + 1}
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
