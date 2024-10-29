import React, { useState } from "react";
import Paper from './Paper';
import Toolbar from './Toolbar';
import OffsetDisplay from './OffsetDisplay';
import './TaskManager.css';

function TaskManager() {
    const [blocks, setBlocks] = useState([]);
    const [connections, setConnections] = useState([]);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const createBlock = () => {
        const newBlock = { id: blocks.length, width: 100, height: 100, x: 20, y: 20 + blocks.length * 120 };
        setBlocks([...blocks, newBlock]);
    };

    const updateBlockPosition = (index, newPosition) => {
        setBlocks((prev) => prev.map((block, i) => i === index ? { ...block, ...newPosition } : block));
    };

    const updateBlockSize = (index, newSize) => {
        setBlocks((prev) => prev.map((block, i) => i === index ? { ...block, ...newSize } : block));
    };

    const addConnection = (fromIndex, toIndex) => {
        const fromBlock = blocks[fromIndex];
        const toBlock = blocks[toIndex];
        setConnections([...connections, { from: fromBlock.id, to: toBlock.id }]);
    };

    return (
        <div className="scheme-container">
            <Toolbar createBlock={createBlock} />
            <Paper
                blocks={blocks}
                connections={connections}
                offsetX={offsetX}
                offsetY={offsetY}
                setOffsetX={setOffsetX}
                setOffsetY={setOffsetY}
                onBlockPositionUpdate={updateBlockPosition}
                onBlockSizeUpdate={updateBlockSize}
                onConnectBlocks={addConnection}
            />
            <OffsetDisplay offsetX={offsetX} offsetY={offsetY} />
        </div>
    );
}

export default TaskManager;
