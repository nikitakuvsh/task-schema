import React, { useEffect, useRef } from "react";
import LeaderLine from "react-leader-line";

function LeaderLines({ blocks, connections = [], planeOffset, onUpdateLines, scale, isDarkTheme, isAnimatedLine }) {
    const leaderLinesRef = useRef([]);

    const updateLines = () => {
        // Удаление старых линий, если они существуют
        leaderLinesRef.current.forEach((line, index) => {
            // Проверка на существование и правильный тип
            if (line && line.remove && typeof line.remove === "function") {
                try {
                    line.remove();
                    leaderLinesRef.current[index] = null; // Обнуляем ссылку после удаления
                } catch (error) {
                    console.error("Error removing LeaderLine:", error);
                }
            }
        });

        // Очищаем массив от пустых или удалённых ссылок
        leaderLinesRef.current = leaderLinesRef.current.filter((line) => line !== null);

        if (connections && connections.length > 0) {
            connections.forEach(([sourceIndex, targetIndex]) => {
                const startBlock = document.getElementById(`block-${sourceIndex}`);
                const endBlock = document.getElementById(`block-${targetIndex}`);
                
                // Проверка наличия элементов для соединения
                if (startBlock && endBlock) {
                    try {
                        const line = new LeaderLine(startBlock, endBlock, {
                            color: isDarkTheme ? "#ffffff" : "#000000",
                            size: 3 * scale,
                            dash: isAnimatedLine ? { animation: true } : false,
                            startPlug: "disc",
                            endPlug: "arrow1",
                        });
                        leaderLinesRef.current.push(line); // Сохраняем ссылку на линию
                    } catch (error) {
                        console.error("Error creating LeaderLine:", error);
                    }
                } else {
                    console.warn(`Elements not found for connection: sourceIndex=${sourceIndex}, targetIndex=${targetIndex}`);
                }
            });
        }
    };

    useEffect(() => {
        updateLines(); // Обновление линий при изменении зависимостей

        return () => {
            // Удаление всех линий при размонтировании компонента
            leaderLinesRef.current.forEach((line, index) => {
                if (line && typeof line.remove === "function") {
                    try {
                        line.remove();
                        leaderLinesRef.current[index] = null; // Обнуляем ссылку
                    } catch (error) {
                        console.error("Error removing LeaderLine on cleanup:", error);
                    }
                }
            });
            // Очищаем массив от пустых ссылок
            leaderLinesRef.current = leaderLinesRef.current.filter((line) => line !== null);
        };
    }, [connections, blocks, planeOffset, isDarkTheme, isAnimatedLine]);

    // Экспорт метода для внешнего обновления
    useEffect(() => {
        if (onUpdateLines) {
            onUpdateLines(updateLines);
        }
    }, [onUpdateLines]);

    return null;
}

export default LeaderLines;
