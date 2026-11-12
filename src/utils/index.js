const successResponse =(data, message) => {
    return {
        success: true,
        data,
        message
    }
}

const errorResponse =(data, message) => {
    return {
        success: false,
        data,
        message
    }
}

export {successResponse, errorResponse}