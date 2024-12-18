import React, { useEffect, useRef } from "react";
import LeaderLine from "react-leader-line";

function LeaderLines({ blocks, connections = [], planeOffset, onUpdateLines, scale }) {
    const leaderLinesRef = useRef([]);

    const updateLines = () => {
        leaderLinesRef.current.forEach((line) => {
            if (line && typeof line.remove === "function") {
                try {
                    line.remove();
                } catch (error) {
                    console.error("Error removing LeaderLine:", error);
                }
            }
        });
        leaderLinesRef.current = [];

        if (connections && connections.length > 0) {
            connections.forEach(([sourceIndex, targetIndex]) => {
                const startBlock = document.getElementById(`block-${sourceIndex}`);
                const endBlock = document.getElementById(`block-${targetIndex}`);
                if (startBlock && endBlock) {
                    try {
                        const line = new LeaderLine(startBlock, endBlock, {
                            color: "#000",
                            size: 3 * scale,
                            dash: { animation: true },
                            startPlug: "disc",
                            endPlug: "arrow1",
                        });
                        leaderLinesRef.current.push(line);
                    } catch (error) {
                        console.error("Error creating LeaderLine:", error);
                    }
                } else {
                    console.warn(
                        `Elements not found for connection: sourceIndex=${sourceIndex}, targetIndex=${targetIndex}`
                    );
                }
            });
        }
    };

    useEffect(() => {
        updateLines();

        return () => {
            leaderLinesRef.current.forEach((line) => {
                if (line && typeof line.remove === "function") {
                    try {
                        line.remove();
                    } catch (error) {
                        console.error("Error removing LeaderLine on cleanup:", error);
                    }
                }
            });
        };
    }, [connections, blocks, planeOffset]);

    // Экспорт метода для внешнего обновления
    useEffect(() => {
        if (onUpdateLines) {
            onUpdateLines(updateLines);
        }
    }, [onUpdateLines]);

    return null;
}

export default LeaderLines;
