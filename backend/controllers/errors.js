// ==============================
// PAGE NOT FOUND
// ==============================

exports.pageNotFound =
    (req, res, next) => {

        res.status(404).json({
            message:
                "Page not found"
        });
    };


// ==============================
// ERROR HANDLER
// ==============================

exports.handleError =
    (error, req, res, next) => {

        console.error(
            "Server Error:",
            error
        );


        res.status(
            error.status || 500
        ).json({

            message:
                error.message ||
                "Internal server error"
        });
    };