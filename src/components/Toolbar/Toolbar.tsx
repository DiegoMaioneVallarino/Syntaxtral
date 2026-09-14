import "./Toolbar.css";
import {
    Link,
    NavLink
} from "react-router-dom";


function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                cx="11"
                cy="11"
                r="7"
            />

            <path d="M16 16L21 21" />
        </svg>
    );
}


function BellIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="
                    M18 8
                    A6 6 0 0 0 6 8
                    V13
                    L4 17
                    H20
                    L18 13
                    Z
                "
            />

            <path d="M10 20H14" />
        </svg>
    );
}


function Toolbar() {
    return (
        <header className="toolbar">

            <div className="titleArea">

                    <Link
                        to="/"
                        className="logoLink"
                        aria-label="Ir al inicio"
                    >

                        <div
                            className="logo"
                            role="img"
                            aria-label="Syntaxtral"
                        />

                    </Link>

</div>


           <nav
    className="toolbarNavigation"
    aria-label="Navegación principal"
>

    <NavLink
        to="/explore"
        className={({ isActive }) =>
            isActive
                ? "navigationButton navigationButtonActive"
                : "navigationButton"
        }
    >
        Explora
    </NavLink>


    <NavLink
        to="/articles"
        className={({ isActive }) =>
            isActive
                ? "navigationButton navigationButtonActive"
                : "navigationButton"
        }
    >
        Artículos
    </NavLink>


    <NavLink
        to="/community"
        className={({ isActive }) =>
            isActive
                ? "navigationButton navigationButtonActive"
                : "navigationButton"
        }
    >
        Comunidad
    </NavLink>


    <NavLink
        to="/create"
        className={({ isActive }) =>
            isActive
                ? "navigationButton navigationButtonActive"
                : "navigationButton"
        }
    >
        Create
    </NavLink>

    <NavLink
    to="/calculator"
    className={({ isActive }) =>
        isActive
            ? "navigationButton navigationButtonActive"
            : "navigationButton"
    }
>
    Calculator
</NavLink>

</nav>


            <div className="toolbarActions">

                <label className="searchArea">

                    <span className="searchIcon">
                        <SearchIcon />
                    </span>

                    <input
                        type="search"
                        className="searchInput"
                        placeholder="Buscar modelos, usuarios, temas..."
                        aria-label="Buscar en Syntaxtral"
                    />

                </label>


                <button
                    type="button"
                    className="notificationButton"
                    aria-label="Notificaciones"
                >
                    <BellIcon />

                    <span className="notificationDot" />
                </button>


                <button
                    type="button"
                    className="profileButton"
                    aria-label="Abrir perfil"
                >
                    <span className="profileAvatar">
                        DM
                    </span>
                </button>

            </div>

        </header>
    );
}


export default Toolbar;