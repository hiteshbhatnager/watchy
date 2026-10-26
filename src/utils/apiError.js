class ApiError extends Error {
    constructor(
        statusCode,
        message = "somthing went wrong",
        success = false,
        errors = [],
        stack = ""
    ) {
        super(message)
        this.errors = errors
        this.statusCode = statusCode
        this.data = null
        this.success = success
        this.message = message

        if (stack) {
            this.stack = this.stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }