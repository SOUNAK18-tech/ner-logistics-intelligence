import {
    Bell,
    User,
    Activity,
    LogIn,
    LogOut,
    AlertTriangle,
    BellRing,
    X,
    MapPin,
    Route
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useState,
    useEffect,
    useRef
} from "react";

import {
    api
} from "../../services/api";


// ---------------------------------------------------------------------------
// Notification dropdown
// ---------------------------------------------------------------------------

const NotificationPanel = ({
    onClose
}) => {

    const [
        alerts,
        setAlerts
    ] =
        useState([]);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    useEffect(() => {

        api.getAlerts()

            .then(
                data => {

                    setAlerts(
                        data.slice(
                            0,
                            8
                        )
                    );

                    setLoading(
                        false
                    );

                }
            )

            .catch(() => {

                setAlerts([]);

                setLoading(
                    false
                );

            });

    }, []);


    const RISK_COLOR = {

        "Very High":
            "var(--danger)",

        "High":
            "var(--danger)",

        "Moderate":
            "var(--warning)",

        "Low":
            "var(--success)",

        "Very Low":
            "var(--success)"

    };


    return (

        <div

            style={{

                position:
                    "absolute",

                top:
                    "calc(100% + 10px)",

                right:
                    0,

                width:
                    340,

                maxHeight:
                    440,

                background:
                    "var(--white)",

                border:
                    "1px solid var(--line)",

                borderRadius:
                    12,

                boxShadow:
                    "0 8px 32px rgba(20,38,59,0.14)",

                zIndex:
                    9999,

                display:
                    "flex",

                flexDirection:
                    "column",

                overflow:
                    "hidden",

                animation:
                    "popoverFadeIn 0.15s ease"

            }}

        >

            {/* HEADER */}

            <div

                style={{

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    padding:
                        "12px 16px",

                    borderBottom:
                        "1px solid var(--line)",

                    background:
                        "var(--sky-tint)"

                }}

            >

                <div

                    style={{

                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            7

                    }}

                >

                    <Bell
                        size={15}
                        color="var(--sky-dark)"
                    />


                    <span

                        style={{

                            fontWeight:
                                700,

                            fontSize:
                                "0.88rem",

                            color:
                                "var(--ink)"

                        }}

                    >
                        Risk Alerts
                    </span>


                    {alerts.length > 0 && (

                        <span

                            style={{

                                fontSize:
                                    "0.68rem",

                                fontWeight:
                                    700,

                                background:
                                    "var(--danger)",

                                color:
                                    "#fff",

                                borderRadius:
                                    10,

                                padding:
                                    "1px 7px"

                            }}

                        >
                            {alerts.length}
                        </span>

                    )}

                </div>


                <button

                    onClick={
                        onClose
                    }

                    style={{

                        background:
                            "none",

                        border:
                            "none",

                        cursor:
                            "pointer",

                        color:
                            "var(--slate)",

                        padding:
                            2,

                        display:
                            "flex"

                    }}

                >

                    <X
                        size={15}
                    />

                </button>

            </div>


            {/* BODY */}

            <div

                style={{

                    overflowY:
                        "auto",

                    flex:
                        1

                }}

            >

                {loading ? (

                    <div

                        style={{

                            padding:
                                "24px",

                            textAlign:
                                "center",

                            color:
                                "var(--slate)",

                            fontSize:
                                "0.85rem"

                        }}

                    >

                        Loading…

                    </div>

                ) : alerts.length === 0 ? (

                    <div

                        style={{

                            padding:
                                "28px 16px",

                            textAlign:
                                "center",

                            color:
                                "var(--slate)"

                        }}

                    >

                        <BellRing
                            size={28}
                            style={{
                                marginBottom:
                                    8,
                                opacity:
                                    0.4
                            }}
                        />


                        <div

                            style={{

                                fontSize:
                                    "0.85rem",

                                fontWeight:
                                    600,

                                marginBottom:
                                    4

                            }}

                        >
                            No alerts yet
                        </div>


                        <div

                            style={{

                                fontSize:
                                    "0.78rem"

                            }}

                        >
                            Click the map or run a
                            route to generate risk alerts.

                        </div>

                    </div>

                ) : (

                    alerts.map(
                        (
                            alert,
                            index
                        ) => {

                            const color =
                                RISK_COLOR[
                                    alert.riskCategory
                                ] ??
                                "var(--slate)";


                            const time =
                                alert.createdAt

                                    ? new Date(
                                        alert.createdAt
                                    ).toLocaleTimeString(
                                        [],
                                        {
                                            hour:
                                                "2-digit",

                                            minute:
                                                "2-digit"
                                        }
                                    )

                                    : "—";


                            const SourceIcon =
                                alert.source ===
                                "map-click"

                                    ? MapPin

                                    : Route;


                            return (

                                <div

                                    key={
                                        alert._id ??
                                        index
                                    }

                                    style={{

                                        display:
                                            "flex",

                                        gap:
                                            12,

                                        padding:
                                            "11px 16px",

                                        borderBottom:
                                            "1px solid var(--line)",

                                        borderLeft:
                                            `3px solid ${color}`,

                                        background:
                                            index === 0
                                                ? "var(--sky-tint)"
                                                : "var(--white)",

                                        transition:
                                            "background 0.12s"

                                    }}

                                    onMouseEnter={
                                        e => {

                                            e.currentTarget.style.background =
                                                "var(--sky-tint)";

                                        }
                                    }

                                    onMouseLeave={
                                        e => {

                                            e.currentTarget.style.background =
                                                index === 0
                                                    ? "var(--sky-tint)"
                                                    : "var(--white)";

                                        }
                                    }

                                >

                                    <div

                                        style={{

                                            width:
                                                32,

                                            height:
                                                32,

                                            borderRadius:
                                                "50%",

                                            flexShrink:
                                                0,

                                            background:
                                                `${color}1a`,

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",

                                            color

                                        }}

                                    >

                                        <AlertTriangle
                                            size={14}
                                        />

                                    </div>


                                    <div

                                        style={{

                                            flex:
                                                1,

                                            minWidth:
                                                0

                                        }}

                                    >

                                        <div

                                            style={{

                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "space-between",

                                                alignItems:
                                                    "center",

                                                marginBottom:
                                                    2

                                            }}

                                        >

                                            <span

                                                style={{

                                                    fontSize:
                                                        "0.72rem",

                                                    fontWeight:
                                                        700,

                                                    color,

                                                    textTransform:
                                                        "uppercase"

                                                }}

                                            >

                                                {
                                                    alert.riskCategory
                                                }

                                                {" "}
                                                Risk

                                            </span>


                                            <span

                                                style={{

                                                    fontSize:
                                                        "0.68rem",

                                                    color:
                                                        "var(--slate-soft)",

                                                    flexShrink:
                                                        0

                                                }}

                                            >

                                                {time}

                                            </span>

                                        </div>


                                        <div

                                            style={{

                                                fontSize:
                                                    "0.8rem",

                                                color:
                                                    "var(--ink)",

                                                lineHeight:
                                                    1.4,

                                                overflow:
                                                    "hidden",

                                                display:
                                                    "-webkit-box",

                                                WebkitLineClamp:
                                                    2,

                                                WebkitBoxOrient:
                                                    "vertical"

                                            }}

                                        >

                                            {
                                                alert.message
                                            }

                                        </div>


                                        <div

                                            style={{

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                gap:
                                                    4,

                                                marginTop:
                                                    3,

                                                fontSize:
                                                    "0.7rem",

                                                color:
                                                    "var(--slate)"

                                            }}

                                        >

                                            <SourceIcon
                                                size={10}
                                            />

                                            {
                                                alert.source ===
                                                "map-click"
                                                    ? "Map click"
                                                    : "Route check"
                                            }

                                            {" · "}

                                            {
                                                alert.latitude?.toFixed(
                                                    4
                                                )
                                            }

                                            ,{" "}

                                            {
                                                alert.longitude?.toFixed(
                                                    4
                                                )
                                            }

                                        </div>

                                    </div>

                                </div>

                            );

                        }
                    )

                )}

            </div>


            {/* FOOTER */}

            <Link

                to="/alerts"

                onClick={
                    onClose
                }

                style={{

                    display:
                        "block",

                    textAlign:
                        "center",

                    padding:
                        "10px",

                    fontSize:
                        "0.8rem",

                    fontWeight:
                        700,

                    color:
                        "var(--sky-dark)",

                    borderTop:
                        "1px solid var(--line)",

                    textDecoration:
                        "none",

                    background:
                        "var(--white)"

                }}

            >

                View all alerts →

            </Link>

        </div>

    );

};


// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export const Navbar = () => {

    const [
        bellOpen,
        setBellOpen
    ] =
        useState(false);


    const [
        alertCount,
        setAlertCount
    ] =
        useState(0);


    const [
        user,
        setUser
    ] =
        useState(null);


    const bellRef =
        useRef(null);


    const navigate =
        useNavigate();


    // ==============================
    // LOAD LOGGED-IN USER
    // ==============================

    useEffect(() => {

        const storedUser =
            localStorage.getItem(
                "sih26002_user"
            );


        if (storedUser) {

            try {

                setUser(
                    JSON.parse(
                        storedUser
                    )
                );

            } catch {

                setUser(
                    null
                );

            }

        }

    }, []);


    // ==============================
    // ALERT COUNT
    // ==============================

    useEffect(() => {

        const load =
            () => {

                api.getAlerts()

                    .then(
                        data =>
                            setAlertCount(
                                data.length
                            )
                    )

                    .catch(
                        () => {}
                    );

            };


        load();


        const id =
            setInterval(
                load,
                30000
            );


        return () => {

            clearInterval(
                id
            );

        };

    }, []);


    // ==============================
    // CLOSE OUTSIDE CLICK
    // ==============================

    useEffect(() => {

        if (!bellOpen) {

            return;

        }


        const handler =
            (e) => {

                if (

                    bellRef.current &&

                    !bellRef.current
                        .contains(
                            e.target
                        )

                ) {

                    setBellOpen(
                        false
                    );

                }

            };


        document.addEventListener(
            "mousedown",
            handler
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handler
            );

        };

    }, [
        bellOpen
    ]);


    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout =
        () => {

            api.logout();


            setUser(
                null
            );


            setBellOpen(
                false
            );


            navigate(
                "/login"
            );

        };


    // ==============================
    // DISPLAY NAME
    // ==============================

    const displayName =

        user?.firstName ||

        user?.userId ||

        "User";


    // ==============================
    // DISPLAY ROLE
    // ==============================

    const displayRole =

        user?.role ===
        "FIELD_OFFICER"

            ? "Field Officer"

            : user?.role ===
              "VEHICLE_OPERATOR"

                ? "Vehicle Operator"

                : user?.role ===
                  "ADMIN"

                    ? "Admin"

                    : "User";


    // ==============================
    // RENDER
    // ==============================

    return (

        <header
            className="top-navbar"
        >

            <div

                style={{

                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        "8px"

                }}

            >

                <h2

                    style={{

                        fontSize:
                            "1rem",

                        fontWeight:
                            700,

                        color:
                            "var(--ink)"

                    }}

                >

                    Command Center

                </h2>

            </div>


            <div

                style={{

                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        "20px"

                }}

            >

                {/* SYSTEM */}

                <div

                    style={{

                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "6px",

                        color:
                            "var(--success)",

                        fontSize:
                            "0.78rem",

                        fontWeight:
                            700

                    }}

                >

                    <Activity
                        size={13}
                    />

                    <span className="hide-sm">

                        SYSTEM OPERATIONAL

                    </span>

                </div>


                {/* NOTIFICATIONS */}

                {user && (

                    <div

                        ref={
                            bellRef
                        }

                        style={{
                            position:
                                "relative"
                        }}

                    >

                        <button

                            onClick={() =>
                                setBellOpen(
                                    o =>
                                        !o
                                )
                            }

                            style={{

                                background:
                                    bellOpen
                                        ? "var(--sky-tint)"
                                        : "none",

                                border:
                                    bellOpen
                                        ? "1px solid var(--sky-tint-2)"
                                        : "1px solid transparent",

                                borderRadius:
                                    8,

                                cursor:
                                    "pointer",

                                padding:
                                    "5px 6px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                transition:
                                    "background 0.15s, border-color 0.15s",

                                position:
                                    "relative"

                            }}

                            title="Notifications"

                        >

                            <Bell

                                size={18}

                                color={
                                    bellOpen
                                        ? "var(--sky-dark)"
                                        : "var(--slate)"
                                }

                            />


                            {alertCount >
                                0 && (

                                <span

                                    style={{

                                        position:
                                            "absolute",

                                        top:
                                            2,

                                        right:
                                            2,

                                        minWidth:
                                            alertCount >
                                            9
                                                ? 16
                                                : 14,

                                        height:
                                            alertCount >
                                            9
                                                ? 16
                                                : 14,

                                        background:
                                            "var(--danger)",

                                        color:
                                            "#fff",

                                        borderRadius:
                                            10,

                                        fontSize:
                                            "0.58rem",

                                        fontWeight:
                                            800,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        border:
                                            "1.5px solid var(--white)",

                                        lineHeight:
                                            1

                                    }}

                                >

                                    {
                                        alertCount >
                                        99
                                            ? "99+"
                                            : alertCount
                                    }

                                </span>

                            )}

                        </button>


                        {bellOpen && (

                            <NotificationPanel

                                onClose={() =>
                                    setBellOpen(
                                        false
                                    )
                                }

                            />

                        )}

                    </div>

                )}


                {/* USER */}

                {user ? (

                    <div

                        style={{

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "8px"

                        }}

                    >

                        <div

                            style={{

                                width:
                                    30,

                                height:
                                    30,

                                borderRadius:
                                    "50%",

                                backgroundColor:
                                    "var(--sky-tint-2)",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                border:
                                    "1px solid var(--sky-tint-2)"

                            }}

                        >

                            <User

                                size={14}

                                color="var(--sky-dark)"

                            />

                        </div>


                        <div
                            className="hide-sm"
                            style={{
                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                lineHeight:
                                    1.15
                            }}
                        >

                            <span

                                style={{

                                    fontSize:
                                        "0.82rem",

                                    color:
                                        "var(--ink)",

                                    fontWeight:
                                        600

                                }}

                            >

                                {
                                    displayName
                                }

                            </span>


                            <span

                                style={{

                                    fontSize:
                                        "0.65rem",

                                    color:
                                        "var(--slate)"

                                }}

                            >

                                {
                                    displayRole
                                }

                            </span>

                        </div>

                    </div>

                ) : null}


                {/* LOGIN / LOGOUT */}

                {user ? (

                    <button

                        type="button"

                        onClick={
                            handleLogout
                        }

                        style={{

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "5px",

                            padding:
                                "5px 12px",

                            background:
                                "var(--sky)",

                            color:
                                "#fff",

                            border:
                                "none",

                            borderRadius:
                                "7px",

                            fontSize:
                                "0.78rem",

                            fontWeight:
                                700,

                            cursor:
                                "pointer",

                            flexShrink:
                                0

                        }}

                    >

                        <LogOut
                            size={13}
                        />

                        Logout

                    </button>

                ) : (

                    <Link

                        to="/login"

                        style={{

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "5px",

                            padding:
                                "5px 12px",

                            background:
                                "var(--sky)",

                            color:
                                "#fff",

                            borderRadius:
                                "7px",

                            fontSize:
                                "0.78rem",

                            fontWeight:
                                700,

                            textDecoration:
                                "none",

                            flexShrink:
                                0

                        }}

                    >

                        <LogIn
                            size={13}
                        />

                        Login

                    </Link>

                )}

            </div>

        </header>

    );

};