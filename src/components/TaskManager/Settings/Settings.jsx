import React, { useState } from "react";
import "./Settings.css";

function Settings({ toggleTheme, isDarkTheme, toggleTimelineUnderCursor, isTimelineUnderCursorHidden }) {
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

    return (
        <>
            <>
                <button className="task-manager__button" onClick={() => setIsSettingsMenuOpen((prev) => !prev)}>Настройки</button>
            </>
            <div className="settings-container">
                {isSettingsMenuOpen && (
                    <div className="settings-menu__wrapper">
                        <div className="settings-menu">
                            <h2 className="settings-menu__title">Настройки</h2>

                            <label className="settings-menu__label">
                                <span>Тема:</span>
                                <select className="settings-menu__select" onChange={toggleTheme} value={isDarkTheme ? "dark" : "light"}>
                                    <option value="light">Светлая</option>
                                    <option value="dark">Тёмная</option>
                                </select>
                            </label>
                            
                            <label className="settings-menu__label">
                                <span>Время под курсором</span>
                                <select className="settings-menu__select" onChange={toggleTimelineUnderCursor} value={isTimelineUnderCursorHidden ? 'hidden' : 'visible'}>
                                    <option value='hidden'>Скрыть</option>
                                    <option value='visible'>Показать</option>
                                </select>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Settings;
