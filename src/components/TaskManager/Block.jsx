import React, { useState, useRef } from "react";

function Block({ block, index, onMouseDown }) {
    const [nameTask, setNameTask] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isRenaming, setIsRenaming] = useState(false);
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

    return (
        <div
            id={`block-${index}`}
            ref={blockRef}
            className="task-manager__block"
            style={{
                left: `${block.x}px`,
                top: `${block.y}px`,
                width: `${block.width}px`,
                height: `${block.height}px`,
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
                        position: "absolute",
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        zIndex: 1000,
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        listStyle: "none",
                        padding: "8px",
                        margin: 0,
                    }}
                >
                    <li onClick={handleRename} style={{ padding: "8px", cursor: "pointer" }}>Переименовать</li>
                    <li style={{ padding: "8px", cursor: "pointer" }}>Загрузить документ</li>
                    <li style={{ padding: "8px", cursor: "pointer" }}>Создать новый блок со связью</li>
                    <li style={{ padding: "8px", cursor: "pointer" }}>Связать с существующим блоком</li>
                    <li style={{ padding: "8px", cursor: "pointer" }}>Удалить</li>
                </ul>
            )}
        </div>
    );
}

export default Block;
