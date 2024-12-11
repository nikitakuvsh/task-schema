import React, { useEffect, useRef } from "react";
import LeaderLine from "react-leader-line";

function LeaderLines({ blocks, connections = [], planeOffset}) {
    const leaderLinesRef = useRef([]);

    useEffect(() => {
        // Удаляем старые линии
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
    
        // Создаем новые линии
        if (connections && connections.length > 0) {
            connections.forEach(([sourceIndex, targetIndex]) => {
                const startBlock = document.getElementById(`block-${sourceIndex}`);
                const endBlock = document.getElementById(`block-${targetIndex}`);
                if (startBlock && endBlock) {
                    try {
                        const line = new LeaderLine(startBlock, endBlock, {
                            color: "#000",
                            size: 3,
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
    
        // Очистка при размонтировании
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
    
}

export default LeaderLines;
