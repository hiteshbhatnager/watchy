const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch
            ((error) => next(error))
    }
}









// const asyncHandler =  (fn) => { }
// const asyncHandler =  (fn) => { async () => { } }


// const asyncHandler = (fn) => async (res, req, Next) => {
//     try {
//         await fn(req, res, Next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }