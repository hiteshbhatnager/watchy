class ApiError extends Error {
    constructor(
        statusCode,
        message = "somthing went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.errors = errors
        this.statusCode = statusCode
        this.data = null
        this.success = false
        this.message = message

        if (stack) {
            this.stack = this.stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }