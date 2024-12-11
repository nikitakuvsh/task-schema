import React, { useState } from "react";

function AsideRight({ onClose }) {
    const [openBlocks, setOpenBlocks] = useState({}); // Для отслеживания открытых блоков

    const toggleBlock = (blockName) => {
        setOpenBlocks((prev) => ({
            ...prev,
            [blockName]: !prev[blockName], // Переключение состояния конкретного блока
        }));
    };

    return (
        <div className="task-manager__aside-right">
            <button className="aside__close-btn" onClick={onClose}>✖</button>
            <div className="task-manager__aside-content">
                {/* Блок "Дедлайн" */}
                <div className="aside__block">
                    <h2 className="aside__block-title" onClick={() => toggleBlock("deadline")}>
                        Дедлайн
                        <span className={`aside__toggle-icon ${openBlocks.deadline ? "open" : ""}`}>
                            ▼
                        </span>
                    </h2>
                    {openBlocks.deadline && (
                        <p className="aside__block-props">10:05 00 20024</p>
                    )}
                </div>
                {/* Блок "Описание" */}
                <div className="aside__block">
                    <h2 className="aside__block-title" onClick={() => toggleBlock("description")}>
                        Описание
                        <span className={`aside__toggle-icon ${openBlocks.description ? "open" : ""}`}>
                            ▼
                        </span>
                    </h2>
                    {openBlocks.description && (
                        <p className="aside__block-props">Здеся будет какое-то жёсткое описание</p>
                    )}
                </div>
                {/* Блок "Файлы" */}
                <div className="aside__block">
                    <h2 className="aside__block-title" onClick={() => toggleBlock("files")}>
                        Файлы
                        <span className={`aside__toggle-icon ${openBlocks.files ? "open" : ""}`}>
                            ▼
                        </span>
                    </h2>
                    {openBlocks.files && (
                        <p className="aside__block-props">Здеся будут загруженные файлы</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AsideRight;
