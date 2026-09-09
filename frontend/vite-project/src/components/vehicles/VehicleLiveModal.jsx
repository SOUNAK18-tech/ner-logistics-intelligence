/**
 * VehicleLiveModal.jsx
 *
 * Full-screen modal overlay showing a vehicle's live position on a map
 * + a detail panel: status, speed, driver, cargo, destination, ETA,
 * and the risk level of the most relevant road segment.
 *
 * Opens when "View Live" is clicked in Vehicles.jsx.
 * Closes on X button or clicking the dark backdrop.
 */

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
    X,
    Navigation,
    Thermometer,
    ShieldAlert,
    Truck,
    Clock,
    MapPin,
    Loader
} from "lucide-react";

import { Badge } from "../common/Badge";

import {
    api
} from "../../services/api";


// ==============================
// VEHICLE MARKER
// ==============================

const vehicleIcon =
    L.divIcon({

        className:
            "vehicle-marker",

        iconSize: [
            16,
            16
        ],

        iconAnchor: [
            8,
            8
        ]

    });


// ==============================
// ROAD BADGE COLORS
// ==============================

const ROAD_BADGE_COLOR = {

    BLOCKED:
        "var(--danger)",

    RESTRICTED:
        "var(--warning)",

    OPEN:
        "var(--success)"

};


// ==============================
// GET RELATED ROAD
// ==============================
//
// The backend does not currently store a
// vehicle -> road relationship.
//
// Therefore we choose the most operationally
// important road returned by the backend:
//
// BLOCKED > RESTRICTED > OPEN
//
// This avoids using mockData.
//

const getRelatedRoad =
    (roads) => {

        if (
            !roads ||
            roads.length === 0
        ) {

            return null;

        }


        const priority = {

            BLOCKED:
                3,

            RESTRICTED:
                2,

            OPEN:
                1

        };


        return [
            ...roads
        ]

        .sort(

            (a, b) =>

                (
                    priority[
                        b.status
                    ] ??
                    0
                )

                -

                (
                    priority[
                        a.status
                    ] ??
                    0
                )

        )[0];

    };


// ==============================
// DETAIL ROW
// ==============================

const DetailRow =
    ({
        label,
        value,
        highlight
    }) => (

        <div
            style={{
                display:
                    "flex",

                justifyContent:
                    "space-between",

                alignItems:
                    "center",

                padding:
                    "7px 0",

                borderBottom:
                    "1px solid var(--border)"
            }}
        >

            <span
                style={{
                    fontSize:
                        "0.82rem",

                    color:
                        "var(--text-secondary)"
                }}
            >
                {label}
            </span>


            <span
                style={{
                    fontSize:
                        "0.82rem",

                    fontWeight:
                        600,

                    color:
                        highlight ??
                        "var(--text-primary)",

                    textAlign:
                        "right",

                    marginLeft:
                        "12px"
                }}
            >
                {value}
            </span>

        </div>

    );


// ==============================
// COMPONENT
// ==============================

export const VehicleLiveModal = ({
    vehicle,
    onClose
}) => {

    const backdropRef =
        useRef(null);


    const [
        roads,
        setRoads
    ] =
        useState([]);


    const [
        loadingRoads,
        setLoadingRoads
    ] =
        useState(true);


    const [
        roadError,
        setRoadError
    ] =
        useState("");


    // ==============================
    // LOAD REAL ROADS
    // ==============================

    useEffect(() => {

        if (!vehicle) {

            return;

        }


        const loadRoads =
            async () => {

                try {

                    setLoadingRoads(
                        true
                    );

                    setRoadError(
                        ""
                    );


                    const data =
                        await api.getRoads();


                    setRoads(
                        Array.isArray(
                            data
                        )
                            ? data
                            : []
                    );

                } catch (error) {

                    console.error(
                        "Failed to load roads:",
                        error
                    );

                    setRoadError(
                        error.message ||
                        "Unable to load road information"
                    );

                } finally {

                    setLoadingRoads(
                        false
                    );

                }

            };


        loadRoads();

    }, [
        vehicle
    ]);


    // ==============================
    // CLOSE ON ESCAPE
    // ==============================

    useEffect(() => {

        const handler =
            (e) => {

                if (
                    e.key ===
                    "Escape"
                ) {

                    onClose();

                }

            };


        window.addEventListener(
            "keydown",
            handler
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handler
            );

        };

    }, [
        onClose
    ]);


    // ==============================
    // PREVENT BODY SCROLL
    // ==============================

    useEffect(() => {

        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                "";

        };

    }, []);


    if (!vehicle) {

        return null;

    }


    // ==============================
    // RELATED ROAD
    // ==============================

    const relatedRoad =
        getRelatedRoad(
            roads
        );


    // ==============================
    // STATUS COLOR
    // ==============================

    const normalizedStatus =
        String(
            vehicle.status ||
            ""
        )
        .trim()
        .toUpperCase()
        .replace(
            / /g,
            "_"
        );


    let statusColor =
        "var(--danger)";


    if (
        normalizedStatus ===
        "IN_TRANSIT"
    ) {

        statusColor =
            "var(--success)";

    }

    else if (
        normalizedStatus ===
            "DELAYED" ||

        normalizedStatus ===
            "RE_ROUTING"
    ) {

        statusColor =
            "var(--warning)";

    }

    else if (
        normalizedStatus ===
        "IDLE"
    ) {

        statusColor =
            "var(--info)";

    }


    // ==============================
    // BACKDROP
    // ==============================

    const handleBackdropClick =
        (e) => {

            if (
                e.target ===
                backdropRef.current
            ) {

                onClose();

            }

        };


    return (

        <div

            ref={
                backdropRef
            }

            onClick={
                handleBackdropClick
            }

            style={{
                position:
                    "fixed",

                inset:
                    0,

                zIndex:
                    9000,

                background:
                    "rgba(2, 6, 23, 0.80)",

                backdropFilter:
                    "blur(4px)",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                padding:
                    "20px",

                animation:
                    "popoverFadeIn 0.18s ease"

            }}

        >

            <div

                style={{

                    background:
                        "var(--bg-secondary)",

                    border:
                        "1px solid var(--border)",

                    borderRadius:
                        "14px",

                    boxShadow:
                        "0 24px 80px rgba(0,0,0,0.7)",

                    width:
                        "100%",

                    maxWidth:
                        860,

                    maxHeight:
                        "90vh",

                    display:
                        "flex",

                    flexDirection:
                        "column",

                    overflow:
                        "hidden"

                }}

            >

                {/* =========================
                    MODAL HEADER
                ========================= */}

                <div

                    style={{

                        display:
                            "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",

                        padding:
                            "16px 20px",

                        borderBottom:
                            "1px solid var(--border)",

                        background:
                            "var(--surface-elevated)"

                    }}

                >

                    <div

                        style={{

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "10px"

                        }}

                    >

                        <Truck
                            size={18}
                            color="var(--accent)"
                        />


                        <div>

                            <div

                                style={{

                                    fontWeight:
                                        700,

                                    fontSize:
                                        "1rem"

                                }}

                            >
                                {
                                    vehicle.id
                                }
                            </div>


                            <div

                                style={{

                                    fontSize:
                                        "0.75rem",

                                    color:
                                        "var(--text-secondary)"

                                }}

                            >

                                {
                                    vehicle.type
                                }

                                {" · "}

                                {
                                    vehicle.cargo
                                }

                            </div>

                        </div>


                        <Badge>

                            {
                                vehicle.priority ||
                                "MEDIUM"
                            }

                        </Badge>

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
                                "var(--text-secondary)",

                            padding:
                                4,

                            borderRadius:
                                "50%",

                            display:
                                "flex",

                            alignItems:
                                "center"

                        }}

                        aria-label="Close"

                    >

                        <X
                            size={20}
                        />

                    </button>

                </div>


                {/* =========================
                    BODY
                ========================= */}

                <div

                    style={{

                        display:
                            "grid",

                        gridTemplateColumns:
                            "1fr 280px",

                        flex:
                            1,

                        minHeight:
                            0,

                        overflow:
                            "hidden"

                    }}

                >

                    {/* =====================
                        MAP
                    ===================== */}

                    <div

                        style={{

                            position:
                                "relative",

                            minHeight:
                                360

                        }}

                    >

                        {vehicle.position ? (

                            <MapContainer

                                center={
                                    vehicle.position
                                }

                                zoom={10}

                                zoomControl={
                                    true
                                }

                                style={{

                                    height:
                                        "100%",

                                    width:
                                        "100%"

                                }}

                            >

                                <TileLayer

                                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"

                                    attribution="&copy; Stadia Maps &copy; OpenStreetMap contributors"

                                />


                                {/* VEHICLE ROUTE */}

                                {vehicle.route &&
                                    vehicle.route.length >
                                        1 && (

                                    <Polyline

                                        positions={
                                            vehicle.route
                                        }

                                        color="var(--accent)"

                                        weight={
                                            3
                                        }

                                        opacity={
                                            0.7
                                        }

                                        dashArray="6 8"

                                    />

                                )}


                                {/* CURRENT POSITION */}

                                <Marker

                                    position={
                                        vehicle.position
                                    }

                                    icon={
                                        vehicleIcon
                                    }

                                >

                                    <Popup>

                                        <div
                                            style={{
                                                padding:
                                                    "4px"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    fontWeight:
                                                        700
                                                }}
                                            >
                                                {
                                                    vehicle.id
                                                }
                                            </div>


                                            <div
                                                style={{
                                                    fontSize:
                                                        "0.78rem",

                                                    color:
                                                        "#555",

                                                    marginTop:
                                                        2
                                                }}
                                            >

                                                {
                                                    vehicle.status
                                                }

                                                {" · "}

                                                {
                                                    vehicle.cargo
                                                }

                                            </div>


                                            {vehicle.speed !==
                                                undefined && (

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "0.75rem",

                                                        marginTop:
                                                            3
                                                    }}
                                                >

                                                    🏎{" "}

                                                    {
                                                        vehicle.speed
                                                    }

                                                    {" km/h"}

                                                </div>

                                            )}

                                        </div>

                                    </Popup>

                                </Marker>

                            </MapContainer>

                        ) : (

                            <div

                                style={{

                                    height:
                                        "100%",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    color:
                                        "var(--text-secondary)"

                                }}

                            >

                                Vehicle GPS location unavailable.

                            </div>

                        )}


                        {/* ==================
                            SPEED HUD
                        ================== */}

                        {vehicle.speed !==
                            undefined && (

                            <div

                                style={{

                                    position:
                                        "absolute",

                                    bottom:
                                        12,

                                    left:
                                        12,

                                    zIndex:
                                        1000,

                                    background:
                                        "rgba(15,23,42,0.88)",

                                    backdropFilter:
                                        "blur(8px)",

                                    border:
                                        "1px solid rgba(255,255,255,0.1)",

                                    borderRadius:
                                        "8px",

                                    padding:
                                        "8px 14px",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "8px"

                                }}

                            >

                                <Navigation
                                    size={14}
                                    color="var(--accent)"
                                />


                                <span

                                    style={{

                                        fontWeight:
                                            700,

                                        fontSize:
                                            "1rem"

                                    }}

                                >

                                    {
                                        vehicle.speed
                                    }

                                    {" km/h"}

                                </span>


                                <span

                                    style={{

                                        fontSize:
                                            "0.72rem",

                                        color:
                                            "var(--text-secondary)"

                                    }}

                                >
                                    current speed
                                </span>

                            </div>

                        )}

                    </div>


                    {/* =====================
                        DETAIL PANEL
                    ===================== */}

                    <div

                        style={{

                            overflowY:
                                "auto",

                            padding:
                                "18px 16px",

                            borderLeft:
                                "1px solid var(--border)",

                            display:
                                "flex",

                            flexDirection:
                                "column",

                            gap:
                                "16px"

                        }}

                    >

                        {/* STATUS */}

                        <div

                            style={{

                                padding:
                                    "10px 12px",

                                borderRadius:
                                    "8px",

                                background:
                                    `${statusColor}15`,

                                border:
                                    `1px solid ${statusColor}40`,

                                textAlign:
                                    "center"

                            }}

                        >

                            <div

                                style={{

                                    fontSize:
                                        "0.72rem",

                                    color:
                                        "var(--text-secondary)",

                                    marginBottom:
                                        3

                                }}

                            >
                                Current Status
                            </div>


                            <div

                                style={{

                                    fontWeight:
                                        700,

                                    fontSize:
                                        "1rem",

                                    color:
                                        statusColor

                                }}

                            >

                                {
                                    vehicle.status
                                }

                            </div>

                        </div>


                        {/* ===================
                            VEHICLE DETAILS
                        =================== */}

                        <div>

                            <div

                                style={{

                                    fontWeight:
                                        700,

                                    fontSize:
                                        "0.78rem",

                                    color:
                                        "var(--text-secondary)",

                                    textTransform:
                                        "uppercase",

                                    letterSpacing:
                                        "0.06em",

                                    marginBottom:
                                        "6px"

                                }}

                            >
                                Manifest
                            </div>


                            <DetailRow

                                label="Driver"

                                value={
                                    vehicle.driver ??
                                    "N/A"
                                }

                            />


                            <DetailRow

                                label="Cargo"

                                value={
                                    vehicle.cargo ??
                                    "N/A"
                                }

                            />


                            <DetailRow

                                label="Destination"

                                value={
                                    vehicle.destination ??
                                    "N/A"
                                }

                            />


                            <DetailRow

                                label="ETA"

                                value={
                                    vehicle.eta ??
                                    "N/A"
                                }

                                highlight={

                                    normalizedStatus ===
                                    "DELAYED"

                                        ? "var(--warning)"

                                        : undefined

                                }

                            />


                            {vehicle.speed !==
                                undefined && (

                                <DetailRow

                                    label="Speed"

                                    value={
                                        `${vehicle.speed} km/h`
                                    }

                                    highlight={

                                        Number(
                                            vehicle.speed
                                        ) ===
                                        0

                                            ? "var(--warning)"

                                            : undefined

                                    }

                                />

                            )}

                        </div>


                        {/* ===================
                            RELATED ROAD RISK
                        =================== */}

                        <div>

                            <div

                                style={{

                                    fontWeight:
                                        700,

                                    fontSize:
                                        "0.78rem",

                                    color:
                                        "var(--text-secondary)",

                                    textTransform:
                                        "uppercase",

                                    letterSpacing:
                                        "0.06em",

                                    marginBottom:
                                        "6px"

                                }}

                            >
                                Route Segment Risk
                            </div>


                            {loadingRoads ? (

                                <div

                                    style={{

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        gap:
                                            8,

                                        padding:
                                            "20px 10px",

                                        color:
                                            "var(--text-secondary)"

                                    }}

                                >

                                    <Loader
                                        size={16}
                                        className="spin"
                                    />

                                    Loading road data...

                                </div>

                            ) : roadError ? (

                                <div

                                    style={{

                                        padding:
                                            "10px 12px",

                                        borderRadius:
                                            "7px",

                                        background:
                                            "var(--surface-elevated)",

                                        border:
                                            "1px solid var(--border)",

                                        color:
                                            "var(--text-secondary)",

                                        fontSize:
                                            "0.75rem"

                                    }}

                                >

                                    {roadError}

                                </div>

                            ) : !relatedRoad ? (

                                <div

                                    style={{

                                        padding:
                                            "10px 12px",

                                        borderRadius:
                                            "7px",

                                        background:
                                            "var(--surface-elevated)",

                                        border:
                                            "1px solid var(--border)",

                                        color:
                                            "var(--text-secondary)",

                                        fontSize:
                                            "0.75rem"

                                    }}

                                >

                                    No road data available.

                                </div>

                            ) : (

                                <div

                                    style={{

                                        padding:
                                            "10px 12px",

                                        borderRadius:
                                            "7px",

                                        background:
                                            "var(--surface-elevated)",

                                        border:
                                            "1px solid var(--border)"

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
                                                6

                                        }}

                                    >

                                        <span

                                            style={{

                                                fontWeight:
                                                    600,

                                                fontSize:
                                                    "0.82rem"

                                            }}

                                        >

                                            {
                                                relatedRoad.id
                                            }

                                        </span>


                                        <span

                                            style={{

                                                fontSize:
                                                    "0.68rem",

                                                fontWeight:
                                                    700,

                                                padding:
                                                    "2px 7px",

                                                borderRadius:
                                                    8,

                                                color:
                                                    ROAD_BADGE_COLOR[
                                                        relatedRoad.status
                                                    ] ??
                                                    "var(--text-secondary)",

                                                background:

                                                    `${
                                                        ROAD_BADGE_COLOR[
                                                            relatedRoad.status
                                                        ] ??
                                                        "#888"
                                                    }20`,

                                                border:

                                                    `1px solid ${
                                                        ROAD_BADGE_COLOR[
                                                            relatedRoad.status
                                                        ] ??
                                                        "#888"
                                                    }`

                                            }}

                                        >

                                            {
                                                relatedRoad.status
                                            }

                                        </span>

                                    </div>


                                    <div

                                        style={{

                                            fontSize:
                                                "0.75rem",

                                            color:
                                                "var(--text-secondary)",

                                            marginBottom:
                                                6

                                        }}

                                    >

                                        {
                                            relatedRoad.name
                                        }

                                    </div>


                                    {/* RISK SCORE */}

                                    <div
                                        style={{
                                            marginTop:
                                                8
                                        }}
                                    >

                                        <div

                                            style={{

                                                height:
                                                    4,

                                                background:
                                                    "var(--border)",

                                                borderRadius:
                                                    2,

                                                overflow:
                                                    "hidden"

                                            }}

                                        >

                                            <div

                                                style={{

                                                    height:
                                                        "100%",

                                                    width:
                                                        `${Math.max(
                                                            0,
                                                            Math.min(
                                                                100,
                                                                Number(
                                                                    relatedRoad.riskScore
                                                                ) || 0
                                                            )
                                                        )}%`,

                                                    background:

                                                        ROAD_BADGE_COLOR[
                                                            relatedRoad.status
                                                        ] ??
                                                        "var(--accent)",

                                                    borderRadius:
                                                        2

                                                }}

                                            />

                                        </div>


                                        <div

                                            style={{

                                                fontSize:
                                                    "0.7rem",

                                                color:
                                                    "var(--text-secondary)",

                                                marginTop:
                                                    3

                                            }}

                                        >

                                            Accessibility score:{" "}

                                            {
                                                Number(
                                                    relatedRoad.riskScore
                                                ) || 0
                                            }

                                            /100

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* ===================
                            LIVE SENSORS
                        =================== */}

                        <div>

                            <div

                                style={{

                                    fontWeight:
                                        700,

                                    fontSize:
                                        "0.78rem",

                                    color:
                                        "var(--text-secondary)",

                                    textTransform:
                                        "uppercase",

                                    letterSpacing:
                                        "0.06em",

                                    marginBottom:
                                        "6px"

                                }}

                            >
                                Live Sensors
                            </div>


                            <div

                                style={{

                                    display:
                                        "grid",

                                    gridTemplateColumns:
                                        "1fr 1fr",

                                    gap:
                                        8

                                }}

                            >

                                {[
                                    {
                                        icon:
                                            <Thermometer
                                                size={14}
                                                color="var(--info)"
                                            />,
                                        label:
                                            "Cargo Temp",
                                        value:
                                            "-4.2 °C"
                                    },

                                    {
                                        icon:
                                            <ShieldAlert
                                                size={14}
                                                color="var(--warning)"
                                            />,
                                        label:
                                            "Door Seal",
                                        value:
                                            "Intact"
                                    },

                                    {
                                        icon:
                                            <Clock
                                                size={14}
                                                color="var(--text-secondary)"
                                            />,
                                        label:
                                            "Last Ping",
                                        value:
                                            vehicle.raw?.lastUpdated
                                                ? new Date(
                                                    vehicle.raw.lastUpdated
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour:
                                                            "2-digit",
                                                        minute:
                                                            "2-digit"
                                                    }
                                                )
                                                : "N/A"
                                    },

                                    {
                                        icon:
                                            <MapPin
                                                size={14}
                                                color="var(--accent)"
                                            />,
                                        label:
                                            "GPS Position",
                                        value:
                                            vehicle.position
                                                ? `${vehicle.position[0].toFixed(4)}, ${vehicle.position[1].toFixed(4)}`
                                                : "Unavailable"
                                    }

                                ].map(

                                    ({
                                        icon,
                                        label,
                                        value
                                    }) => (

                                        <div

                                            key={
                                                label
                                            }

                                            style={{

                                                padding:
                                                    "8px 10px",

                                                background:
                                                    "var(--surface-elevated)",

                                                borderRadius:
                                                    7,

                                                border:
                                                    "1px solid var(--border)"

                                            }}

                                        >

                                            <div

                                                style={{

                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    gap:
                                                        5,

                                                    marginBottom:
                                                        3

                                                }}

                                            >

                                                {icon}


                                                <span

                                                    style={{

                                                        fontSize:
                                                            "0.68rem",

                                                        color:
                                                            "var(--text-secondary)"

                                                    }}

                                                >

                                                    {
                                                        label
                                                    }

                                                </span>

                                            </div>


                                            <div

                                                style={{

                                                    fontWeight:
                                                        600,

                                                    fontSize:
                                                        "0.75rem"

                                                }}

                                            >

                                                {
                                                    value
                                                }

                                            </div>

                                        </div>

                                    )

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};