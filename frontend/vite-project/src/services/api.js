const BACKEND_URL =
    "http://localhost:1710";


// ==============================
// GENERIC REQUEST HELPER
// ==============================

const request =
    async (
        endpoint,
        options = {}
    ) => {

        const token =
            localStorage.getItem(
                "sih26002_token"
            );


        const headers = {

            ...(options.body
                ? {
                    "Content-Type":
                        "application/json"
                }
                : {}),

            ...(token
                ? {
                    Authorization:
                        `Bearer ${token}`
                }
                : {}),

            ...(options.headers || {})

        };


        const response =
            await fetch(

                `${BACKEND_URL}${endpoint}`,

                {
                    ...options,
                    headers
                }

            );


        const data =
            await response
                .json()
                .catch(() => null);


        if (!response.ok) {

            throw new Error(

                data?.message ||
                data?.detail ||
                `HTTP ${response.status}`

            );

        }


        return data;

    };


// ==============================
// NORMALIZERS
// ==============================

const normalizeVehicle =
    (vehicle) => {

        const coords =
            vehicle.currentLocation?.coordinates;


        return {

            id:
                vehicle.vehicleNumber,

            vehicleNumber:
                vehicle.vehicleNumber,

            type:
                vehicle.vehicleType,

            cargo:
                vehicle.cargoType,

            priority:
                vehicle.priority || "MEDIUM",

            status:
                vehicle.status,

            destination:
                vehicle.destination,

            eta:
                vehicle.estimatedArrival
                    ? new Date(
                        vehicle.estimatedArrival
                    ).toLocaleString()
                    : "—",

            position:
                coords?.length === 2
                    ? [
                        coords[1],
                        coords[0]
                    ]
                    : null,

            driver:
                vehicle.driverName ||
                "—",

            speed:
                vehicle.speed || 0,

            raw:
                vehicle

        };

    };


const normalizeRoad =
    (road) => {

        return {

            id:
                road.osmId ||
                road._id,

            name:
                road.name ||
                "Unnamed Road",

            status:
                road.status,

            riskScore:
                road.accessibilityScore ??
                0,

            lastUpdated:
                road.updatedAt
                    ? new Date(
                        road.updatedAt
                    ).toLocaleString()
                    : "—",

            incidents:
                0,

            reason:
                null,

            raw:
                road

        };

    };


const normalizeIncident =
    (incident) => {

        const coords =
            incident.location?.coordinates;


        return {

            id:
                incident._id,

            type:
                incident.type,

            cause:
                incident.type,

            location:
                coords
                    ? `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`
                    : "Unknown",

            severity:
                incident.severity,

            time:
                incident.createdAt
                    ? new Date(
                        incident.createdAt
                    ).toLocaleTimeString(
                        [],
                        {
                            hour:
                                "2-digit",
                            minute:
                                "2-digit"
                        }
                    )
                    : "—",

            status:
                incident.status,

            position:
                coords?.length === 2
                    ? [
                        coords[1],
                        coords[0]
                    ]
                    : null,

            raw:
                incident

        };

    };


const normalizeDelivery =
    (delivery) => {

        const vehicle =
            delivery.vehicleId;


        let progress =
            0;


        if (
            delivery.status ===
            "DELIVERED"
        ) {

            progress = 100;

        }

        else if (
            delivery.status ===
            "IN_TRANSIT"
        ) {

            progress = 50;

        }

        else if (
            delivery.status ===
            "DELAYED"
        ) {

            progress = 30;

        }


        return {

            id:
                delivery.deliveryId,

            vehicle:
                vehicle?.vehicleNumber ||
                "—",

            cargo:
                delivery.cargoType,

            priority:
                delivery.priority,

            source:
                delivery.origin,

            destination:
                delivery.destination,

            eta:
                delivery.estimatedArrival
                    ? new Date(
                        delivery.estimatedArrival
                    ).toLocaleString()
                    : "—",

            status:
                delivery.status,

            progress,

            raw:
                delivery

        };

    };


// ==============================
// API
// ==============================

export const api = {

    // --------------------------
    // DASHBOARD
    // --------------------------

    getDashboardData:
        async () => {

            const [

                vehicles,

                roads,

                incidents,

                deliveries,

                alerts

            ] =
                await Promise.all([

                    api.getVehicles(),

                    api.getRoads(),

                    api.getIncidents(),

                    api.getDeliveries(),

                    api.getAlerts()

                ]);


            return {

                kpis: [

                    {

                        label:
                            "Active Vehicles",

                        value:
                            String(

                                vehicles.filter(
                                    v =>
                                        v.status ===
                                        "IN_TRANSIT"
                                ).length

                            ),

                        icon:
                            "truck",

                        status:
                            "accent"

                    },

                    {

                        label:
                            "Vehicles Delayed",

                        value:
                            String(

                                vehicles.filter(
                                    v =>
                                        v.status ===
                                        "DELAYED"
                                ).length

                            ),

                        icon:
                            "clock",

                        status:
                            "warning"

                    },

                    {

                        label:
                            "Blocked Roads",

                        value:
                            String(

                                roads.filter(
                                    r =>
                                        r.status ===
                                        "BLOCKED"
                                ).length

                            ),

                        icon:
                            "alert-triangle",

                        status:
                            "danger"

                    },

                    {

                        label:
                            "Active Incidents",

                        value:
                            String(

                                incidents.filter(
                                    i =>
                                        i.status ===
                                        "ACTIVE"
                                ).length

                            ),

                        icon:
                            "activity",

                        status:
                            "danger"

                    },

                    {

                        label:
                            "Critical Alerts",

                        value:
                            String(

                                alerts.filter(
                                    a =>
                                        a.riskCategory ===
                                        "Very High"
                                ).length

                            ),

                        icon:
                            "bell",

                        status:
                            "warning"

                    }

                ],

                vehicles,

                roads,

                incidents,

                deliveries,

                alerts

            };

        },


    // --------------------------
    // VEHICLES
    // --------------------------

    getVehicles:
        async () => {

            const data =
                await request(
                    "/api/vehicles"
                );


            return (
                data.data ||
                data ||
                []
            ).map(
                normalizeVehicle
            );

        },


    createVehicle:
        async (
            vehicle
        ) => {

            const data =
                await request(
                    "/api/vehicles",
                    {

                        method:
                            "POST",

                        body:
                            JSON.stringify(
                                vehicle
                            )

                    }
                );


            return data.data ||
                data;

        },


    updateVehicle:
        async (
            id,
            vehicle
        ) => {

            const data =
                await request(
                    `/api/vehicles/${id}`,
                    {

                        method:
                            "PUT",

                        body:
                            JSON.stringify(
                                vehicle
                            )

                    }
                );


            return data.data ||
                data;

        },


    deleteVehicle:
        async (
            id
        ) => {

            return request(
                `/api/vehicles/${id}`,
                {

                    method:
                        "DELETE"

                }
            );

        },


    // --------------------------
    // ROADS
    // --------------------------

    getRoads:
        async () => {

            const data =
                await request(
                    "/api/roads"
                );


            return (
                data.data ||
                data ||
                []
            ).map(
                normalizeRoad
            );

        },


    // --------------------------
    // INCIDENTS
    // --------------------------

    getIncidents:
        async () => {

            const data =
                await request(
                    "/api/incidents"
                );


            return (
                data.data ||
                data ||
                []
            ).map(
                normalizeIncident
            );

        },


    createIncident:
        async (
            incident
        ) => {

            return request(

                "/api/incidents",

                {

                    method:
                        "POST",

                    body:
                        JSON.stringify(
                            incident
                        )

                }

            );

        },


    // --------------------------
    // DELIVERIES
    // --------------------------

    getDeliveries:
        async () => {

            const data =
                await request(
                    "/api/deliveries"
                );


            return (
                data.data ||
                data ||
                []
            ).map(
                normalizeDelivery
            );

        },


    // --------------------------
    // ALERTS
    // --------------------------

    getAlerts:
        async () => {

            const data =
                await request(
                    "/api/alerts"
                );


            return Array.isArray(data)
                ? data
                : data.data ||
                  [];

        },


    // --------------------------
    // SETTINGS
    // --------------------------

    getSettings:
        async () => {

            const data =
                await request(
                    "/api/settings"
                );


            return data.data ||
                data;

        },


    updateSettings:
        async (
            settings
        ) => {

            const data =
                await request(
                    "/api/settings",
                    {

                        method:
                            "PUT",

                        body:
                            JSON.stringify(
                                settings
                            )

                    }
                );


            return data.data ||
                data;

        },


    // --------------------------
    // AUTH
    // --------------------------

    login:
        async (
            userId,
            password,
            role
        ) => {

            const data =
                await request(
                    "/api/auth/login",
                    {

                        method:
                            "POST",

                        body:
                            JSON.stringify({

                                userId,

                                password,

                                role

                            })

                    }
                );


            localStorage.setItem(

                "sih26002_token",

                data.token

            );


            localStorage.setItem(

                "sih26002_user",

                JSON.stringify(
                    data.user
                )

            );


            return data;

        },


    logout:
        () => {

            localStorage.removeItem(
                "sih26002_token"
            );

            localStorage.removeItem(
                "sih26002_user"
            );

        },


    getMe:
        async () => {

            const data =
                await request(
                    "/api/auth/me"
                );


            return data.data ||
                data;

        },


    register:
        async (
            form
        ) => {

            const data =
                await request(
                    "/api/auth/register",
                    {

                        method:
                            "POST",

                        body:
                            JSON.stringify(
                                form
                            )

                    }
                );


            return data;

        },


    getPendingUsers:
        async () => {

            const data =
                await request(
                    "/api/auth/pending"
                );


            return data.data ||
                [];

        },


    approveUser:
        async (
            id
        ) => {

            const data =
                await request(
                    `/api/auth/approve/${id}`,
                    {

                        method:
                            "PUT"

                    }
                );


            return data.data ||
                data;

        },


    rejectUser:
        async (
            id
        ) => {

            const data =
                await request(
                    `/api/auth/reject/${id}`,
                    {

                        method:
                            "PUT"

                    }
                );


            return data.data ||
                data;

        }

};


// ==============================
// RISK ENGINE
// ==============================

export const getLandslideRisk =
    async (
        lat,
        lon
    ) => {

        return request(

            `/api/landslide?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`

        );

    };


export const getRouteRisk =
    async (
        points
    ) => {

        return request(

            "/api/route-risk",

            {

                method:
                    "POST",

                body:
                    JSON.stringify({

                        points

                    })

            }

        );

    };


// ==============================
// GEOCODING
// ==============================

export const geocodePlace =
    async (
        q
    ) => {

        return request(

            `/api/geocode?q=${encodeURIComponent(q)}`

        );

    };