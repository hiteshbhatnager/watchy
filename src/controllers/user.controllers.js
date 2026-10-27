import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

// get user detail from frontend
// check validation for detail
// check user already exist or not : username, email
// check avtar image ,
// upload them in cloudinary
// create user object in db 
// remove pass and refresh token feild from response 
// check for user creation 
// return res

const registerUser = asyncHandler(async (req, res) => {

    const { fullname, email, userName, password } = req.body
    console.log({
        "email": email,
    })

    if (
        [fullname, email, userName, password].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "all feild are required")
    }

    const existedUser = await User.findOne(
        { $or: [{ email }, { userName }] }
    )

    if (existedUser) {
        throw new ApiError(409, "user already existed with this email or username")
    }

    const avatarLocalPath = req?.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage[0]) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image is require for profile")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar image is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        userName: userName.toLowerCase(),
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refresToken"
    )

    if (!createdUser) {
        throw new ApiError("something went wrong while register user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "user register sucessfully", true)
    )
})

//get email/username , password from frontend
//check field are not empty
//check is user exist in db
//check active sessions
//remove pass and refresh token from feild
//return res 
const loginUser = asyncHandler(async (req, res) => {

})

export { registerUser }