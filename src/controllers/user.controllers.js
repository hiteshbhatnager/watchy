import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user detail from frontend
    // check validation for detail
    // check user already exist or not : username, email
    // check avtar image ,
    // upload them in cloudinary
    // create user object in db 
    // remove pass and refresh token feild from response 
    // check for user creation 
    // return res

    const { userName, email, password, fullname } = req.body
    console.log({
        "email": email,
    })


})

export { registerUser }