import React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';

function Block({ index, block, offsetX, offsetY, onPositionUpdate, onSizeUpdate, onConnect }) {
    const handleDragStop = (e, data) => {
        onPositionUpdate(index, { x: data.x - offsetX, y: data.y - offsetY });
    };

    const handleResizeStop = (e, data) => {
        onSizeUpdate(index, { width: data.size.width, height: data.size.height });
    };

    return (
        <Draggable position={{ x: block.x + offsetX, y: block.y + offsetY }} onStop={handleDragStop}>
            <ResizableBox
                className="paper__block"
                width={block.width}
                height={block.height}
                minConstraints={[50, 50]}
                // maxConstraints={[300, 300]}
                resizeHandles={["se"]}
                onResizeStop={handleResizeStop}
            >
                <div className="resizable-content">
                    Блок {index + 1}
                    {index > 0 && (
                        <button onClick={() => onConnect(index - 1, index)}>Соединить с предыдущим</button>
                    )}
                </div>
            </ResizableBox>
        </Draggable>
    );
}

export default Block;
