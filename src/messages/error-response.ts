export default {
    invalid: { statusCode: 401, message: "Invalid token" }, //verify token
    forbidden: { statusCode: 403, message: "Forbidden" }, //not matched
    notFound: { statusCode: 404, message: "token not found" },
    serverError: { statusCode: 500, message: "Internal server error" },
    parameters: { statusCode: 500, message: "query parameters are not valid" },
    notMatched: { statusCode: 500, message: "user id is not matched" },
    notCreate: { statusCode: 500, message: "not created" },
}