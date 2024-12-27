import React, { useState, useRef, useEffect } from "react";
import workerIcon from '../../img/icons/worker.svg';
import downloadIcon from '../../img/icons/download-icon.svg';

function Block({ block, index, onMouseDown, onCreateConnectedBlock, onDoubleClick, onConnectBlocks, allBlocks = [], onRenameBlock, forceUpdateLines, selectedBlocks, scale, isDarkTheme, nameTask, handleSetNameTask, updateTimeBlock }) {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isRenaming, setIsRenaming] = useState(false);
    const [color, setColor] = useState(block.color || "#ffffff");
    const [blockSize, setBlockSize] = useState({ width: block.width, height: block.height });
    const [showConnectionMenu, setShowConnectionMenu] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const colorInputRef = useRef(null);
    const blockRef = useRef(null);
    const fileInputRef = useRef(null);
    const isSelected = selectedBlocks.some((b) => b === block);

    const handleRightClick = (e) => {
        e.preventDefault();
        if (blockRef.current) {
            const blockRect = blockRef.current.getBoundingClientRect();
            const relativeX = e.clientX - blockRect.left;
            const relativeY = e.clientY - blockRect.top;
            setMenuPosition({ top: relativeY, left: relativeX });
        }
        setShowMenu(true);
    };

    const handleOutsideClick = (e) => {
        if (!e.target.closest(`#block-${index}`)) setShowMenu(false);
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleRename = () => {
        setIsRenaming(true);
        setShowMenu(false);
    };

    const handleSaveName = (e) => {
        e.preventDefault();
        setIsRenaming(false);
        onRenameBlock(index, nameTask);
    };

    const handleOpenColorPicker = () => {
        if (colorInputRef.current) colorInputRef.current.click();
        setShowMenu(false);
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const handleResize = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = blockSize.width;
        const startHeight = blockSize.height;
    
        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
    
            setBlockSize((prev) => {
                const newSize = {
                    width: direction.includes("right") ? startWidth + deltaX : prev.width,
                    height: direction.includes("bottom") ? startHeight + deltaY : prev.height,
                };
    
                forceUpdateLines(); // Обновляем линии
    
                return newSize;
            });
        };
    
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
    
            // Вызываем updateTimeBlock с обновленным блоком
            updateTimeBlock(
                {
                    ...block,
                    width: blockSize.width, // Используем новое значение ширины
                },
                index
            );
        };
    
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };
    

    const handleCreateConnectedBlockClick = () => {
        setShowMenu(false);
        onCreateConnectedBlock(index);
    };

    const handleConnectToExistingBlockClick = () => {
        setShowMenu(false);
        setShowConnectionMenu(true);
    };

    const handleSelectBlockForConnection = (targetIndex) => {
        onConnectBlocks(index, targetIndex);
        setShowConnectionMenu(false);
    };

    const handleAddFiles = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
        setShowMenu(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            console.log("File selected:", file);
        }
    };

    // useEffect(() => {
    //     if (deadline?.BlockStartDate && deadline?.BlockEndDate) {
    //         handleResize();
    //     }
    // }, [deadline?.BlockStartDate, deadline?.BlockEndDate]);
    

    return (
        <div id={`block-${index}`} ref={blockRef} className={`task-manager__block ${isSelected ? 'selected' : ''}`}
            style={{
                left: `${block.x * scale}px`,
                top: `${block.y * scale}px`,
                width: `${blockSize.width * scale}px`,
                height: `${blockSize.height * scale}px`,
                backgroundColor: isSelected ? 'rgb(3, 184, 255)' : color,
            }}
            onMouseDown={(e) => e.button === 0 && onMouseDown(e, index)}
            onContextMenu={handleRightClick}
            onDoubleClick={onDoubleClick}
        >
            {isRenaming ? (
                <form onSubmit={handleSaveName}>
                    <input className={`block__set-name-task ${isDarkTheme ? 'dark' : 'light'}`} autoFocus type="text" value={nameTask} onChange={handleSetNameTask} onBlur={() => setIsRenaming(false)} />
                </form>
            ) : (
                <h3 className={`block__title ${isDarkTheme ? 'dark' : 'light'}`}>{nameTask || `Блок ${index + 1}`}</h3>
            )}

            {showMenu && (
                <ul className="block__menu" style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px`}}>
                    <li className="block__menu-li" onClick={handleRename}>Переименовать</li>
                    <li className="block__menu-li" onClick={handleOpenColorPicker}>Изменить цвет</li>
                    <li className="block__menu-li" onClick={handleAddFiles}>Загрузить документ</li>
                    <li className="block__menu-li" onClick={handleCreateConnectedBlockClick}>Создать новый блок со связью</li>
                    <li className="block__menu-li" onClick={handleConnectToExistingBlockClick}>Связать с существующим блоком</li>
                    <li className="block__menu-li">Свернуть цепочку</li>
                    <li className="block__menu-li">Удалить</li>
                </ul>
            )}

            {showConnectionMenu && (
                <ul className="connection-menu" style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }} >
                    {Array.isArray(allBlocks) && allBlocks.length > 0
                        ? allBlocks.map(
                            (block, targetIndex) =>
                                targetIndex !== index && (
                                    <li key={targetIndex} className={`connection-menu-item ${isDarkTheme ? 'dark' : 'light'}`} onClick={() => handleSelectBlockForConnection(targetIndex)}>
                                        {block.name || `Блок ${targetIndex + 1}`}
                                    </li>
                                )
                        )
                        : <li>Нет доступных блоков для связи</li>}
                </ul>
            )}

            <input className="block__input-color--hidden" ref={colorInputRef} type="color" value={color} onChange={handleColorChange} style={{top: `${menuPosition.top + 25}px`, left: `${menuPosition.left}px`}} />
            <input className="block__input-file--hidden" ref={fileInputRef} type="file" onChange={handleFileChange} />

            <div className="block__icons-container">
                <img className="block__icon icon--worker" alt="Исполнитель" title="Исполнитель" src={workerIcon} />
                <img className="block__icon icon--download-files" alt="Скачать файлы" title="Скачать файлы" src={downloadIcon} />
            </div>

            <div className="resize-handle resize-handle--bottom-right" onMouseDown={(e) => handleResize(e, "bottom-right")} />
        </div>
    );
}

export default Block;