// import { AppError } from "../errors/AppError";

// export const ErrorHandler = (err, req, res) => {

//     if(err instanceof AppError) {
//         console.log(err.message);
//         return res.status(err.statusCode).json({
//             success: false,
//             message: err.message
//         });
//     } else {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// }