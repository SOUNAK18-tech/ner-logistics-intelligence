require("dotenv").config();

const dns =
    require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const express =
    require("express");

const {
    default: mongoose
} =
    require("mongoose");

const cors =
    require("cors");




// ==============================
// LOCAL MODULES
// ==============================

const roadsRouter =
    require(
        "./routes/roadRoutes"
    );


const vehiclesRouter =
    require(
        "./routes/vehicleRoutes"
    );


const deliveriesRouter =
    require(
        "./routes/deliveryRoutes"
    );


const incidentsRouter =
    require(
        "./routes/incidentRoutes"
    );


const alertsRouter =
    require(
        "./routes/alertRoutes"
    );



const settingsRouter =
    require(
        "./routes/settingRoutes"
    );


const errorsController =
    require(
        "./controllers/errors"
    );

const riskRoutes =
    require(
        "./routes/riskRoutes"
    );


// ==============================
// APP
// ==============================

const app =
    express();


// ==============================
// MIDDLEWARE
// ==============================

app.use(
    express.urlencoded({
        extended: true
    })
);


app.use(
    express.json()
);





app.use(
    cors({

        origin:
            process.env.FRONTEND_URL,

        credentials:
            true
    })
);


// ==============================
// ROUTES
// ==============================

app.use(
    "/api/roads",
    roadsRouter
);


app.use(
    "/api/vehicles",
    vehiclesRouter
);


app.use(
    "/api/deliveries",
    deliveriesRouter
);


app.use(
    "/api/incidents",
    incidentsRouter
);


app.use(
    "/api/alerts",
    alertsRouter
);


app.use(
    "/api/settings",
    settingsRouter
);

app.use(
    "/api/risk",
    riskRoutes
);


// ==============================
// 404
// ==============================

app.use(
    errorsController.pageNotFound
);

app.use(
    errorsController.handleError
);


// ==============================
// DATABASE + SERVER
// ==============================

const PORT =
    process.env.PORT ||
    3001;


const DB_PATH =
    process.env.MONGO_URL;


mongoose
    .connect(DB_PATH)

    .then(() => {

        console.log(
            "Connected to Mongo"
        );


        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on address http://localhost:${PORT}`
                );
            }
        );

    })

    .catch((error) => {

        console.log(
            "Error while connecting to Mongo:",
            error
        );
    });