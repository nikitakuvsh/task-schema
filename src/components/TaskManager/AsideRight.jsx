import React, { useState } from "react";
import downloadIcon from '../../img/icons/download-icon.svg';

function AsideRight({ onClose, deadline }) {
    const [openBlocks, setOpenBlocks] = useState({});

    const toggleBlock = (blockName) => {
        setOpenBlocks((prev) => ({
            ...prev,
            [blockName]: !prev[blockName],
        }));
    };

    return (
        <div className="task-manager__aside-right">
            <button className="aside__close-btn" onClick={onClose}>✖</button>
            <div className="task-manager__aside-content">
                <div className="aside__block">
                    <h2 className="aside__block-title" onClick={() => toggleBlock("deadline")}>
                        Дедлайн
                        <span className={`aside__toggle-icon ${openBlocks.deadline ? "open" : ""}`}>▼</span>
                    </h2>
                    {openBlocks.deadline && (
                        <p className="aside__block-props">{deadline.BlockStartDate.toLocaleTimeString()} - {deadline.BlockEndDate.toLocaleTimeString()}</p>
                        
                    )}
                </div>
                <div className="aside__block">
                    <h2 className="aside__block-title" onClick={() => toggleBlock("description")}>
                        Описание
                        <span className={`aside__toggle-icon ${openBlocks.description ? "open" : ""}`}>▼</span>
                    </h2>
                    {openBlocks.description && (
                       <textarea
                            className="aside__block-props props-input"
                            defaultValue='Введите своё описание'
                            rows="3"
                            cols="20" // Количество символов в строке
                        />
                    )}
                </div>
                <div className="aside__block">
                    <h2 className="aside__block-title" onClick={() => toggleBlock("files")}>
                        Файлы
                        <span className={`aside__toggle-icon ${openBlocks.files ? "open" : ""}`}>▼</span>
                    </h2>
                    {openBlocks.files && (
                        <div className="aside__block-files">
                            <div className="aide__block-file">
                                <h2 className="aside__block-file-title">Пример файла 1</h2>
                                <button className="aside__block-file-download"><img className="aside__block-file-download-icon" src={downloadIcon} alt="скачать файл"/></button>
                            </div>

                            <div className="aide__block-file">
                                <h2 className="aside__block-file-title">Пример файла 2</h2>
                                <button className="aside__block-file-download"><img className="aside__block-file-download-icon" src={downloadIcon} alt="скачать файл"/></button>
                            </div>

                            <div className="aide__block-file">
                                <h2 className="aside__block-file-title">Пример файла 3</h2>
                                <button className="aside__block-file-download"><img className="aside__block-file-download-icon" src={downloadIcon} alt="скачать файл"/></button>
                            </div>
                        </div> 
                    )}
                </div>
            </div>
        </div>
    );
}

export default AsideRight;
