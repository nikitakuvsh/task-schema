import React from 'react';

function Toolbar({ createBlock }) {
    return (
        <>
            <select className="scheme__select" id="timeframe-selector">
                <option className="scheme__option" value="day">День</option>
                <option className="scheme__option" value="week">Неделя</option>
                <option className="scheme__option" value="month">Месяц</option>
                <option className="scheme__option" value="year">Год</option>
            </select>
            <button className="scheme__add-button" onClick={createBlock}>Создать блок</button>
        </>
    );
}

export default Toolbar;
