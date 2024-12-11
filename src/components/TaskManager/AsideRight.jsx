function AsideRight({onClose}){
    return (
        <div className="task-manager__aside-right">
             <button className="aside__close-btn" onClick={onClose}>✖</button>
            <div className="task-manager__aside-content">
                <div className="aside__block">
                    <h2 className="aside__block-title">Дедлайн</h2>
                    <p className="aside__block-props">10:05 00 20024</p>
                </div>
                <div className="aside__block">
                    <h2 className="aside__block-title">Описание</h2>
                    <p className="aside__block-props">Здеся будет какое-то жёсткое описание</p>
                </div>
                <div className="aside__block">
                    <h2 className="aside__block-title">Файлы</h2>
                    <p className="aside__block-props">Здеся будут загруженные файлы</p>
                </div>
            </div>
        </div>
    );
}

export default AsideRight;