class apiResponse {
    constructor(statusCode, data, message = "success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.Sucess = statusCode < 400
    }
}

export { apiResponse }