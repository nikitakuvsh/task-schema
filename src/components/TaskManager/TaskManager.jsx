import React, { useState, useEffect, useRef } from "react";
import Block from "./Block";
import LeaderLines from "./LeaderLines";
import Timeline from "./TimeLine";
import AsideRight from "./AsideRight";
import "./TaskManager.css";

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

        console.log(offsetX, offsetY);

        if (scale === 0) {
            console.error("Scale is zero, cannot divide by zero.");
            return;
        }

        const adjustedX = (mouseX - offsetX) / scale;
        const adjustedY = (mouseY - offsetY) / scale;

        console.log(adjustedX, adjustedY);

        setCurrentBlock({
            x: adjustedX,
            y: adjustedY,
            width: 200,
            height: 200,
        });
    };

    const handleMouseMove = (e) => {
        if (draggingPlane) {
            const deltaX = e.clientX - startPlaneDrag.x;
            const deltaY = e.clientY - startPlaneDrag.y;

            setBlocks((prevBlocks) =>
                prevBlocks.map((block) => ({
                    ...block,
                    x: block.x + deltaX,
                    y: block.y + deltaY,
                }))
            );

            setPlaneOffset((prev) => ({
                x: prev.x,
                y: prev.y,
                xTimeline: prev.x + deltaX,
            }));

            setStartPlaneDrag({ x: e.clientX, y: e.clientY });
        }

        if (draggingBlockIndex !== null) {
            const deltaX = (e.clientX - startDrag.x) / scale;
            const deltaY = (e.clientY - startDrag.y) / scale;

            setBlocks((prevBlocks) =>
                prevBlocks.map((block, index) =>
                    index === draggingBlockIndex
                        ? { ...block, x: block.x + deltaX, y: block.y + deltaY }
                        : block
                )
            );

            setStartDrag({ x: e.clientX, y: e.clientY });
        }

        if (draggingButton && currentBlock) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const offsetX = planeOffset?.x || 0;
            const offsetY = planeOffset?.y || 0;

            const adjustedX = (mouseX - offsetX) / scale;
            const adjustedY = (mouseY - offsetY) / scale;

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
        }
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
                width: 200,
                height: 200,
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
    }, [planeOffset, scale]);

    const updateTimeline = () => {
        const offsetDifference = planeOffset.xTimeline - prevplaneOffset;
        const timeOffset = offsetDifference * 10000 / scale;

        const newStartDate = new Date(startDate.getTime() - timeOffset);
        const newEndDate = new Date(newStartDate.getTime() + timeInterval / scale);

        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setPrevPlaneOffset(planeOffset.x);
    };


    return (
        <div className="task-manager" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <button className="task-manager__button button--add-task" onMouseDown={handleAddTaskMouseDown}>Добавить задачу</button>
            <Timeline startDate={startDate.toLocaleString()} endDate={endDate.toLocaleString()} />
            <div className="task-manager__plane" onMouseDown={handlePlaneMouseDown}>
                {blocks.map((block, index) => (
                    <Block key={index} index={index} block={block}
                        onMouseDown={handleBlockMouseDown}
                        onCreateConnectedBlock={handleCreateConnectedBlock}
                        onDoubleClick={() => setAsideVisible(true)}
                        onConnectBlocks={handleConnectBlocks}
                        onCreateChoiceConnectedBlock={handleStartConnection}
                        onSelectTarget={handleSelectTarget}
                        allBlocks={blocks}
                        onRenameBlock={handleRenameBlock}
                        forceUpdateLines={forceUpdateLines}
                        selectedBlocks={selectedBlocks}
                    />
                ))}
                {draggingButton && currentBlock && (
                    <div className="task-manager__block task-manager__block--temp"
                        style={{
                            left: `${currentBlock.x}px`,
                            top: `${currentBlock.y}px`,
                            width: `${currentBlock.width}px`,
                            height: `${currentBlock.height}px`,
                        }}
                    ></div>
                )}
                {selection && (
                    <div className="block--select" style={{left: `${selection.x}px`, top: `${selection.y}px`, width: `${selection.width}px`, height: `${selection.height}px`,}}/>
                )}
                <LeaderLines blocks={blocks} connections={connections} planeOffset={planeOffset} onUpdateLines={handleLeaderLinesUpdate} />
            </div>
            <div className="task-manager__buttons-container">
                <button className="task-manager__button button--save-schema">Скачать схему</button>
                <button className="task-manager__button button--load-schema">Загрузить схему</button>
                <button className="task-manager__button button--save">Сохранить</button>
            </div>
            {asideVisible && <AsideRight onClose={() => setAsideVisible(false)} />}
        </div>
    );
}

export default TaskManager;
