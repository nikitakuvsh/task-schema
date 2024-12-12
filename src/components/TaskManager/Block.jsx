import React, { useState, useRef } from "react";

function Block({ block, index, onMouseDown, onCreateConnectedBlock, onDoubleClick, onConnectBlocks, allBlocks = [], onRenameBlock,}) {
    const [nameTask, setNameTask] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isRenaming, setIsRenaming] = useState(false);
    const [color, setColor] = useState(block.color || "#ffffff");
    const [blockSize, setBlockSize] = useState({ width: block.width, height: block.height, });
    const [showConnectionMenu, setShowConnectionMenu] = useState(false);
    const colorInputRef = useRef(null);
    const blockRef = useRef(null);

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
        const handleOutsideClick = (e) => {
            if (showConnectionMenu && !e.target.closest(".connection-menu")) {
                setShowConnectionMenu(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [showConnectionMenu])

    React.useEffect(() => {
        if (showMenu) document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [showMenu]);

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

            setBlockSize((prev) => ({
                width: direction.includes("right") ? startWidth + deltaX : prev.width,
                height: direction.includes("bottom") ? startHeight + deltaY : prev.height,
            }));
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
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

    return (
        <div
            id={`block-${index}`}
            ref={blockRef}
            className="task-manager__block"
            style={{
                left: `${block.x}px`,
                top: `${block.y}px`,
                width: `${blockSize.width}px`,
                height: `${blockSize.height}px`,
                backgroundColor: color,
                position: "absolute",
                boxSizing: "border-box",
            }}
            onMouseDown={(e) => e.button === 0 && onMouseDown(e, index)}
            onContextMenu={handleRightClick}
            onDoubleClick={onDoubleClick}
        >
            {isRenaming ? (
                <form onSubmit={handleSaveName}>
                    <input className="block__set-name-task" autoFocus type="text" value={nameTask} onChange={(e) => setNameTask(e.target.value)} onBlur={() => setIsRenaming(false)}/>
                </form>
            ) : (
                <h3 className="block__title">{nameTask || `Блок ${index + 1}`}</h3>
            )}

            {showMenu && (
                <ul className="block__menu" style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px`, }}>
                    <li className="block__menu-li" onClick={handleRename}>Переименовать</li>
                    <li className="block__menu-li" onClick={handleOpenColorPicker}>Изменить цвет</li>
                    <li className="block__menu-li">Загрузить документ</li>
                    <li className="block__menu-li" onClick={handleCreateConnectedBlockClick}>Создать новый блок со связью</li>
                    <li className="block__menu-li" onClick={handleConnectToExistingBlockClick}>Связать с существующим блоком</li>
                    <li className="block__menu-li">Удалить</li>
                </ul>
            )}

            {showConnectionMenu && (
                <ul
                    className="connection-menu"
                    style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px`,}}>
                    {Array.isArray(allBlocks) && allBlocks.length > 0
                        ? allBlocks.map(
                            (block, targetIndex) =>
                                targetIndex !== index && (
                                    <li key={targetIndex} className="connection-menu-item" onClick={() => handleSelectBlockForConnection(targetIndex)}>{block.name || `Блок ${targetIndex + 1}`} </li>
                                )
                        )
                        : <li>Нет доступных блоков для связи</li>}
                </ul>
            )}

            <input ref={colorInputRef} type="color" value={color} onChange={handleColorChange} style={{ display: "none" }}/>

            <div className="resize-handle resize-handle--bottom-right" onMouseDown={(e) => handleResize(e, "bottom-right")}/>
        </div>
    );
}

export default Block;
