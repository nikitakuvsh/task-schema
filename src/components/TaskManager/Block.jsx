import React, { useState, useRef } from "react";

function Block({ block, index, onMouseDown, onCreateConnectedBlock }) {
    const [nameTask, setNameTask] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isRenaming, setIsRenaming] = useState(false);
    const [color, setColor] = useState(block.color || "#ffffff");
    const [blockSize, setBlockSize] = useState({
        width: block.width,
        height: block.height,
    });
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
        e.stopPropagation(); // Отключаем передвижение блока
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
        onCreateConnectedBlock(index); // Вызываем функцию из пропсов с текущим индексом
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
        >
            {isRenaming ? (
                <form onSubmit={handleSaveName}>
                    <input
                        autoFocus
                        type="text"
                        value={nameTask}
                        onChange={(e) => setNameTask(e.target.value)}
                        onBlur={() => setIsRenaming(false)}
                        style={{
                            padding: "4px",
                            fontSize: "14px",
                            width: "80%",
                            boxSizing: "border-box",
                        }}
                    />
                </form>
            ) : (
                <h3 className="block__title">{nameTask || `Блок ${index + 1}`}</h3>
            )}

            {showMenu && (
                <ul
                    className="block__menu"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                    }}
                >
                    <li className="block__menu-li" onClick={handleRename}>
                        Переименовать
                    </li>
                    <li className="block__menu-li" onClick={handleOpenColorPicker}>
                        Изменить цвет
                    </li>
                    <li className="block__menu-li">Загрузить документ</li>
                    <li className="block__menu-li" onClick={handleCreateConnectedBlockClick}>Создать новый блок со связью</li>
                    <li className="block__menu-li">Связать с существующим блоком</li>
                    <li className="block__menu-li">Удалить</li>
                </ul>
            )}

            {/* Скрытый input для выбора цвета */}
            <input
                ref={colorInputRef}
                type="color"
                value={color}
                onChange={handleColorChange}
                style={{ display: "none" }}
            />

            {/* Ручка для изменения размера */}
            <div
                className="resize-handle resize-handle--bottom-right"
                style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    width: "10px",
                    height: "10px",
                    background: "rgba(0, 0, 0, 0.5)",
                    cursor: "nwse-resize",
                }}
                onMouseDown={(e) => handleResize(e, "bottom-right")}
            />
        </div>
    );
}

export default Block;
