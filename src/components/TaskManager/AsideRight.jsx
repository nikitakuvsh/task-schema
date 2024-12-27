import React, { useState } from "react";
import downloadIcon from '../../img/icons/download-icon.svg';

function AsideRight({ onClose, deadline, blockIndex, isDarkTheme }) {
    const [openBlocks, setOpenBlocks] = useState({});

    const toggleBlock = (blockName) => {
        setOpenBlocks((prev) => ({
            ...prev,
            [blockName]: !prev[blockName],
        }));
    };

    const truncateText = (text, maxLength = 10) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };
    

    return (
        <div className={`task-manager__aside-right ${isDarkTheme ? 'dark' : 'lite'}`}>
            <button className="aside__close-btn" onClick={onClose}>✖</button>
            <div className="task-manager__aside-content">
                <h2 className={`aside__block-title ${isDarkTheme ? 'dark' : 'lite'} name--block`}>{truncateText('Название блока офыволфр олрфолыр волрфыол рволфыр олврф ыролврфыл фырволрфыолврол фроыврол фрыолв олфырвло рфыолвр фолыр волфры олврфол ырвол фыолрвлфоыр')}</h2>
                <div className={`aside__block ${isDarkTheme ? 'dark' : 'lite'}`}>
                    <h2 className={`aside__block-title ${isDarkTheme ? 'dark' : 'lite'}`} onClick={() => toggleBlock("deadline")}>
                        Дедлайн
                        <span className={`aside__toggle-icon ${openBlocks.deadline ? "open" : ""}`}>▼</span>
                    </h2>
                    {openBlocks.deadline && (
                        <p className={`aside__block-props ${isDarkTheme ? 'dark' : 'lite'}`}>{deadline.BlockStartDate.toLocaleTimeString()} - {deadline.BlockEndDate.toLocaleTimeString()}</p>
                        
                    )}
                </div>
                <div className={`aside__block ${isDarkTheme ? 'dark' : 'lite'}`}>
                    <h2 className={`aside__block-title ${isDarkTheme ? 'dark' : 'lite'}`} onClick={() => toggleBlock("description")}>
                        Описание
                        <span className={`aside__toggle-icon ${openBlocks.description ? "open" : ""}`}>▼</span>
                    </h2>
                    {openBlocks.description && (
                       <textarea
                            className={`aside__block-props ${isDarkTheme ? 'dark' : 'lite'} props-input`}
                            defaultValue='Введите своё описание'
                            rows="3"
                            cols="20" // Количество символов в строке
                        />
                    )}
                </div>
                <div className={`aside__block ${isDarkTheme ? 'dark' : 'lite'}`}>
                    <h2 className={`aside__block-title ${isDarkTheme ? 'dark' : 'lite'}`} onClick={() => toggleBlock("files")}>
                        Файлы
                        <span className={`aside__toggle-icon ${openBlocks.files ? "open" : ""}`}>▼</span>
                    </h2>
                    {openBlocks.files && (
                        <div className="aside__block-files">
                            <div className="aide__block-file">
                                <h2 className={`aside__block-file-title ${isDarkTheme ? 'dark' : 'lite'}`}>Пример файла 1</h2>
                                <button className={`aside__block-file-download`}><img className="aside__block-file-download-icon" src={downloadIcon} alt="скачать файл"/></button>
                            </div>

                            <div className="aide__block-file">
                                <h2 className={`aside__block-file-title ${isDarkTheme ? 'dark' : 'lite'}`}>Пример файла 2</h2>
                                <button className="aside__block-file-download"><img className="aside__block-file-download-icon" src={downloadIcon} alt="скачать файл"/></button>
                            </div>

                            <div className="aide__block-file">
                                <h2 className={`aside__block-file-title ${isDarkTheme ? 'dark' : 'lite'}`}>Пример файла 3</h2>
                                <button className="aside__block-file-download"><img className="aside__block-file-download-icon" src={downloadIcon} alt="скачать файл"/></button>
                            </div>
                        </div> 
                    )}
                </div>
                <button className={`aside__block-button ${isDarkTheme ? 'dark' : 'lite'}`}>Сохранить</button>
            </div>
        </div>
    );
}

export default AsideRight;
