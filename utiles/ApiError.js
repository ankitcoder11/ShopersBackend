// class ApiError extends Error {
//     constructor(
//         statusCode,
//         message = "Something went wrong",
//         errors = [],
//         stack = ""
//     ) {
//         super(message)
//         this.statusCode = statusCode
//         this.data = null
//         this.message = message
//         this.success = false;
//         this.errors = errors
//         if (stack) {
//             this.stack = stack
//         } else {
//             Error.captureStackTrace(this, this.constructor)
//         }
//     }
// }

// export { ApiError }
const ApiError = async (res, statusCode, message) => {
    return res.status(statusCode).send({ message: message })
}

export { ApiError }