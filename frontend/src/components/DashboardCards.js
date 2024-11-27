import './DashboardCards.css';

function DashboardCard({ title, extraClasses, children }) {
    return (
        <div className={`card ${extraClasses}`}>
            <h1>{title}</h1>
            {children}
        </div>
    );
}

function DashboardCardTitleless({ extraClasses, children }) {
    return (
        <div className={`card2 ${extraClasses}`}>
            {children}
        </div>
    );
}

export { DashboardCard, DashboardCardTitleless };