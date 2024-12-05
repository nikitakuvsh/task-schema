import React, { useEffect, useRef } from "react";
import LeaderLine from "react-leader-line";

function LeaderLines({ blocks, planeOffset }) {
    const leaderLinesRef = useRef([]);

    useEffect(() => {
        // Удаляем старые линии
        leaderLinesRef.current.forEach((line) => line.remove());
        leaderLinesRef.current = [];

        blocks.forEach((block, index) => {
            if (index < blocks.length - 1) {
                const startBlock = document.getElementById(`block-${index}`);
                const endBlock = document.getElementById(`block-${index + 1}`);
                if (startBlock && endBlock) {
                    const line = new LeaderLine(startBlock, endBlock, {
                        color: "#000",
                        size: 2,
                        dash: { animation: true },
                        startPlug: "disc",
                        endPlug: "arrow1",
                    });
                    leaderLinesRef.current.push(line);
                }
            }
        });
    }, [blocks, planeOffset]); // Обновляем линии при изменении блоков или смещения плоскости

    return null;
}

export default LeaderLines;
