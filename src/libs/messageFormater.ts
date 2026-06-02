export const messageFormater = (
    success: boolean,
    message?: string,
    data?: any,
    statusCode?: number,
    schema?: any
) =>{
    return {
        success,
        data,
        message,
        statusCode,
        schema
    }
}