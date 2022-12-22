export default {
    invalid: { statusCode: 401, message: "Invalid token" },
    forbidden: { statusCode: 403, message: "Forbidden" },
    notFound: { statusCode: 404, message: "Room not found" },
    serverError: { statusCode: 500, message: "Internal server error" },
    parameters: { statusCode: 500, message: "query parameters are not valid" },
    notMatched: { statusCode: 500, message: "user id is not matched" },
}