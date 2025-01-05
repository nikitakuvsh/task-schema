import React, { useState, useEffect, useRef } from "react";
import Block from "./Block";
import LeaderLines from "./LeaderLines";
import Timeline from "./TimeLine";
import AsideRight from "./AsideRight";
import "./TaskManager.css";
import Settings from './Settings/Settings';

function TaskManager() {
    const [blocks, setBlocks] = useState([]);
    const [draggingButton, setDraggingButton] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [draggingBlockIndex, setDraggingBlockIndex] = useState(null);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
    const [draggingPlane, setDraggingPlane] = useState(false);
    const [startPlaneDrag, setStartPlaneDrag] = useState({ x: 0, y: 0 });
    const [planeOffset, setPlaneOffset] = useState({ x: 0, y: 0, xTimeline: 0 });
    const [scale, setScale] = useState(1);
    const [asideVisible, setAsideVisible] = useState(false);
    const [connections, setConnections] = useState([]);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(null);
    const [showConnectionMenu, setShowConnectionMenu] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [prevplaneOffset, setPrevPlaneOffset] = useState(0);
    const timeInterval = 12 * 60 * 60 * 1000; // 12 часов
    const leaderLinesUpdateRef = useRef(null);
    const [selection, setSelection] = useState(null);
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [selectedBlockIndexes, setSelectedBlockIndexes] = useState([]);
    const [cursorTime, setCursorTime] = useState(new Date());
    const [cursorPosition, setCursorPosition] = useState({ x: -10, y: -10});
    const [deadlineBlock, setDeadlineBlock] = useState({BlockStartDate: 0, BlockEndDate: 0});
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isTimelineUnderCursorHidden, setIsTimelineUnderCursorHidden] = useState(false);
    const [isAnimatedLine, setIsAnimatedLine] = useState(true);
    const [blockIndex, setBlockIndex] = useState(null);
    const [nameTask, setNameTask] = useState("");

    const handleSetNameTask = (e, index) => {
        const newName = e.target.value;
        setBlocks((prevBlocks) =>
            prevBlocks.map((block, i) =>
                i === index ? { ...block, name: newName } : block
            )
        );
    };

    const toggleTheme = () => {
        setIsDarkTheme((prev) => !prev);
    }

    const toggleTimelineUnderCursor = () => {
        setIsTimelineUnderCursorHidden((prev) => !prev);
    }

    const toggleTypeLeaderLine = () => {
        setIsAnimatedLine((prev) => !prev);
    }

    const handleLeaderLinesUpdate = (updateFn) => {
        leaderLinesUpdateRef.current = updateFn;
    };

    const forceUpdateLines = () => {
        if (leaderLinesUpdateRef.current) {
            leaderLinesUpdateRef.current();
        }
    }

    const handleAddTaskMouseDown = (e) => {
        e.stopPropagation();
        setDraggingButton(true);

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const offsetX = planeOffset.x || 0;
        const offsetY = planeOffset.y || 0;

        if (scale === 0) {
            console.error("Scale is zero, cannot divide by zero.");
            return;
        }

        const adjustedX = (mouseX - offsetX) / scale;
        const adjustedY = (mouseY - offsetY) / scale;

        setCurrentBlock({
            x: adjustedX,
            y: adjustedY,
            width: 200 * scale,
            height: 200 * scale,
            name: '',
        });

    };


    const updateTimeline = () => {
        const offsetDifference = planeOffset.xTimeline - prevplaneOffset;
        const timeOffset = offsetDifference * timeInterval / window.innerWidth; // Смещение времени
        const newStartDate = new Date(startDate.getTime() - timeOffset);
        const newEndDate = new Date(newStartDate.getTime() + timeInterval / scale);
        
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setPrevPlaneOffset(planeOffset.xTimeline); // Сохраняем текущее смещение
    };
    
    const updateCursorTime = (mouseX, mouseY) => {
        const totalTimelineDuration = endDate.getTime() - startDate.getTime();
        const timelineWidth = window.innerWidth; // Ширина таймлайна
        const offsetX = (mouseX - planeOffset.x) / scale; // Смещение курсора с учетом масштаба
        const cursorPositionRatio = (offsetX + planeOffset.x * 2) / timelineWidth;
        
        const cursorTime = new Date(cursorPositionRatio * totalTimelineDuration);
        
        setCursorTime(cursorTime);
        setCursorPosition({ x: offsetX, y: mouseY});
    };
    
    const updateBlockTime = (block, index) => {
        const totalTimelineDuration = endDate.getTime() - startDate.getTime();
        const timelineWidth = window.innerWidth; // Ширина таймлайна
    
        // Левая граница блока
        const blockStartOffset = (block.x) / scale / timelineWidth;
        const BlockStartDate = new Date(blockStartOffset * totalTimelineDuration);
    
        // Правая граница блока
        const blockEndOffset = (block.x + block.width) / scale / timelineWidth;
        const BlockEndDate = new Date(blockEndOffset * totalTimelineDuration);
    
        setDeadlineBlock({ BlockStartDate, BlockEndDate });
        setBlockIndex(index);
        setNameTask(block.name);
    };
    
    
    
    
    const handleMouseMove = (e) => {
        if (draggingPlane) {
            const deltaX = e.clientX - startPlaneDrag.x;
            const deltaY = e.clientY - startPlaneDrag.y;

            setBlocks((prevBlocks) =>
                prevBlocks.map((block) => ({
                    ...block,
                    x: block.x,
                    y: block.y,
                }))
            );

            setPlaneOffset((prev) => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY,
                xTimeline: (prev.x + deltaX) / scale,
            }));

            setStartPlaneDrag({ x: e.clientX, y: e.clientY });
        }

        if (draggingBlockIndex !== null) {
            const deltaX = (e.clientX - startDrag.x) / scale;
            const deltaY = (e.clientY - startDrag.y) / scale;
        
            setBlocks((prevBlocks) =>
                prevBlocks.map((block, index) =>
                    selectedBlockIndexes.includes(index) || index === draggingBlockIndex
                        ? { ...block, x: block.x + deltaX, y: block.y + deltaY }
                        : block
                )
            );
        
            setStartDrag({ x: e.clientX, y: e.clientY });
            updateBlockTime(blocks[draggingBlockIndex], draggingBlockIndex);
        }

        if (draggingButton && currentBlock) {
            const mouseX = e.clientX + planeOffset.x;
            const mouseY = e.clientY + planeOffset.y;

            const offsetX = planeOffset?.x || 0;
            const offsetY = planeOffset?.y || 0;

            const adjustedX = (mouseX - offsetX + planeOffset.x) / scale;
            const adjustedY = (mouseY - offsetY + planeOffset.y) / scale;

            setCurrentBlock((prev) => ({
                ...prev,
                x: adjustedX - prev.width / 2,
                y: adjustedY - prev.height / 2,
            }));
        }

        if (selection && draggingBlockIndex === null && !draggingButton) {
            const { startX, startY } = selection;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
        
            const newX = Math.min(startX, mouseX);
            const newY = Math.min(startY, mouseY);
        
            const newWidth = Math.abs(mouseX - startX);
            const newHeight = Math.abs(mouseY - startY);
        
            setSelection({
                x: newX,
                y: newY,
                startX,
                startY,
                width: newWidth,
                height: newHeight,
            });
        
            // Сохраняем выделенные блоки для отображения стилей
            const selected = blocks.filter((block) => {
                const blockLeft = block.x * scale + planeOffset.x;
                const blockTop = block.y * scale + planeOffset.y;
                const blockRight = blockLeft + block.width * scale;
                const blockBottom = blockTop + block.height * scale;
        
                const selectionLeft = newX;
                const selectionTop = newY;
                const selectionRight = newX + newWidth;
                const selectionBottom = newY + newHeight;
        
                return (
                    blockRight > selectionLeft &&
                    blockLeft < selectionRight &&
                    blockBottom > selectionTop &&
                    blockTop < selectionBottom
                );
            });
        
            setSelectedBlocks(selected);
        
            // Вычисляем индексы выделенных блоков
            const selectedIndexes = blocks
                .map((block, index) => {
                    const blockLeft = block.x * scale + planeOffset.x;
                    const blockTop = block.y * scale + planeOffset.y;
                    const blockRight = blockLeft + block.width * scale;
                    const blockBottom = blockTop + block.height * scale;
        
                    const selectionLeft = newX;
                    const selectionTop = newY;
                    const selectionRight = newX + newWidth;
                    const selectionBottom = newY + newHeight;
        
                    if (
                        blockRight > selectionLeft &&
                        blockLeft < selectionRight &&
                        blockBottom > selectionTop &&
                        blockTop < selectionBottom
                    ) {
                        return index; // Возвращаем индекс
                    }
                    return null;
                })
                .filter((index) => index !== null); // Убираем `null` значения
        
            setSelectedBlockIndexes(selectedIndexes);
        }
        
        // Логика перемещения выделенных блоков
        if (draggingBlockIndex !== null) {
            const deltaX = (e.clientX - startDrag.x) / scale;
            const deltaY = (e.clientY - startDrag.y) / scale;
        
            setBlocks((prevBlocks) =>
                prevBlocks.map((block) =>
                    selectedBlocks.includes(block)
                        ? { ...block, x: block.x + deltaX, y: block.y + deltaY }
                        : block
                )
            );
        
            setStartDrag({ x: e.clientX, y: e.clientY });
        }
        updateCursorTime(e.clientX, e.clientY);
        if (draggingBlockIndex !== null && blocks[draggingBlockIndex]) {
            updateBlockTime(blocks[draggingBlockIndex], draggingBlockIndex);
        }
    };

    const handleBlockResize = (index, newSize) => {
        setBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[index] = { ...updatedBlocks[index], ...newSize };
            return updatedBlocks;
        });
    
        // Обновляем время блока после изменения размеров
        const updatedBlock = { ...blocks[index], ...newSize };
        updateBlockTime(updatedBlock, index);
    };
    
    
    

    const handleBlockMouseDown = (e, index) => {
        e.stopPropagation();
        setDraggingBlockIndex(index);
        setStartDrag({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        if (draggingButton && currentBlock) {
            setBlocks((prevBlocks) => [...prevBlocks, currentBlock]);
            setDraggingButton(false);
            setCurrentBlock(null);
        }

        setDraggingBlockIndex(null);
        setDraggingPlane(false);
        setSelection(null);
    };

    const handleWheel = (e) => {
        // e.preventDefault();
        const MIN_SCALE = 0.2; // Минимальный масштаб
        const MAX_SCALE = 5;   // Максимальный масштаб
        const SCALE_STEP = 0.1; // Шаг изменения масштаба
        setScale((prevScale) => {
            let newScale = prevScale;
    
            if (e.deltaY < 0) {
                // Скролл вверх: увеличение масштаба
                newScale = Math.min(prevScale + SCALE_STEP, MAX_SCALE);
            } else if (e.deltaY > 0) {
                // Скролл вниз: уменьшение масштаба
                newScale = Math.max(prevScale - SCALE_STEP, MIN_SCALE);
            }
    
            return newScale;
        });
    }

    const handlePlaneMouseDown = (e) => {
        if (e.button === 1 && !draggingButton && draggingBlockIndex === null) {
            setDraggingPlane(true);
            setStartPlaneDrag({ x: e.clientX, y: e.clientY });
        }

        if (e.button === 0 && draggingBlockIndex === null) {
            const startX = e.clientX;
            const startY = e.clientY;

            setSelection({ x: startX, y: startY, startX, startY, width: 0, height: 0 });
        }
        setSelectedBlockIndexes([]);
        setSelectedBlocks([]);
    };

    const handleCreateConnectedBlock = (sourceIndex) => {
        if (sourceIndex < 0 || sourceIndex >= blocks.length) {
            console.error("Invalid source index:", sourceIndex);
            return;
        }

        setBlocks((prev) => {
            const sourceBlock = prev[sourceIndex];
            const newBlock = {
                x: sourceBlock.x + 250,
                y: sourceBlock.y,
                width: 200 * scale,
                height: 200 * scale,
            };
            return [...prev, newBlock];
        });

        setConnections((prev) => [...prev, [sourceIndex, blocks.length]]);
    };

    const handleRenameBlock = (index, newName) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block, i) =>
                i === index ? { ...block, name: newName } : block
            )
        );
        setNameTask(newName);
    };

    const handleConnectBlocks = (sourceIndex, targetIndex) => {
        setConnections((prevConnections) => [
            ...prevConnections,
            [sourceIndex, targetIndex],
        ]);
    };

    const handleRemoveInvalidConnections = () => {
        setConnections((prev) =>
            prev.filter(([source, target]) => {
                const isValidSource = source >= 0 && source < blocks.length;
                const isValidTarget = target >= 0 && target < blocks.length;
                return isValidSource && isValidTarget;
            })
        );
    };

    const handleStartConnection = (sourceIndex) => {
        setCurrentSourceIndex(sourceIndex);
        setShowConnectionMenu(true);
    };

    const handleSelectTarget = (targetIndex) => {
        if (currentSourceIndex !== null) {
            setConnections((prevConnections) => [
                ...prevConnections,
                [currentSourceIndex, targetIndex],
            ]);
            setCurrentSourceIndex(null);
            setShowConnectionMenu(false);
        }
    };

    useEffect(() => {
        handleRemoveInvalidConnections();
    }, [blocks]);

    useEffect(() => {
        updateTimeline();
    }, [planeOffset]);
    
    useEffect(() => {
        forceUpdateLines();
    }, [scale, blocks, connections]);
    
    return (
        <div className="task-manager" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onWheel={handleWheel}>
            <button className="task-manager__button button--add-task" onMouseDown={handleAddTaskMouseDown}>Добавить задачу</button>
            <Timeline startDate={startDate.toLocaleString()} endDate={endDate.toLocaleString()} isDarkTheme={isDarkTheme} />
            <div className={`task-manager__plane ${isDarkTheme ? 'dark' : 'light'}`} onMouseDown={handlePlaneMouseDown}>
                {blocks.map((block, index) => (
                    <Block key={index} index={index} block={block} scale={scale}
                        onMouseDown={handleBlockMouseDown}
                        onCreateConnectedBlock={handleCreateConnectedBlock}
                        onDoubleClick={() => {setAsideVisible(true); updateBlockTime(block, index)}}
                        onConnectBlocks={handleConnectBlocks}
                        onCreateChoiceConnectedBlock={handleStartConnection}
                        onSelectTarget={handleSelectTarget}
                        allBlocks={blocks}
                        onRenameBlock={handleRenameBlock}
                        forceUpdateLines={forceUpdateLines}
                        selectedBlocks={selectedBlocks}
                        updateBlockTime={updateBlockTime}
                        isDarkTheme={isDarkTheme}
                        nameTask={block.name}
                        handleSetNameTask={(e) => handleSetNameTask(e, index)}
                        updateTimeBlock={updateBlockTime}
                        onResize={(newSize) => handleBlockResize(index, newSize)}
                        planeOffset={planeOffset}
                        // deadline={{BlockStartDate: block.startDate, BlockEndDate: block.endDate}}
                    />
                ))}
                {draggingButton && currentBlock && (
                    <div className="task-manager__block task-manager__block--temp"
                        style={{
                            left: `${currentBlock.x - planeOffset.x}px`,
                            top: `${currentBlock.y - planeOffset.y}px`,
                            width: `${currentBlock.width}px`,
                            height: `${currentBlock.height}px`,
                        }}
                    ></div>
                )}
                {selection && (
                    <div className="block--select" style={{left: `${selection.x}px`, top: `${selection.y}px`, width: `${selection.width}px`, height: `${selection.height}px`,}}/>
                )}
                <LeaderLines blocks={blocks} connections={connections} planeOffset={planeOffset} onUpdateLines={handleLeaderLinesUpdate} scale={scale} isDarkTheme={isDarkTheme} isAnimatedLine={isAnimatedLine}/>
            </div>
            <div className="task-manager__buttons-container">
                <button className="task-manager__button button--save-schema">Скачать схему</button>
                <button className="task-manager__button button--load-schema">Загрузить схему</button>
                <Settings toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} toggleTimelineUnderCursor={toggleTimelineUnderCursor} isTimelineUnderCursorHidden={isTimelineUnderCursorHidden} toggleTypeLeaderLine={toggleTypeLeaderLine} isAnimatedLine={isAnimatedLine}/>
                <button className="task-manager__button button--save">Сохранить</button>
            </div>
            {asideVisible && <AsideRight onClose={() => setAsideVisible(false)} deadline={deadlineBlock} blockIndex={blockIndex} isDarkTheme={isDarkTheme} nameTask={nameTask}/>}
            <div className={`time-under-cursor ${isTimelineUnderCursorHidden ? 'unvisible' : 'visible'}`} style={{left: `${(cursorPosition.x + planeOffset.x) * scale}px`, top: `${(cursorPosition.y + 10) * scale}px`, display: cursorPosition.x != -10 && cursorPosition.y != -10 ? '' : 'none'}}>
                    {cursorTime.toLocaleTimeString()}
            </div>
        </div>
    );
}

export default TaskManager;