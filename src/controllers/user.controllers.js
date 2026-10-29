import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const genrateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "somthing went in genrating refresh and access token")
    }
}

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
        throw new ApiError(400, "fullname email userName password are required")
    }

    const existedUser = await User.findOne(
        { $or: [{ email }, { userName }] }
    )

    const avatarLocalPath = req?.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar image is require for profile")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(500, "avatar is not upload on cloudinary")
    }

    if (existedUser) {
        throw new ApiError(409, "user already existed with this email or username")
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

//get email/username , password from frontend (req.body => data)
//check user
//check is user exist in db
//check password
//genrate access and refresh token 
//send cookies
const loginUser = asyncHandler(async (req, res) => {

    const { email, userName, password } = req.body;

    if (!(email || userName)) {
        throw new ApiError(400, "enter user name or email to login user")
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (!user) {
        throw new ApiError(402, "user not exist with this username or email")
    }

    const isPassValid = await user.isPasswordCorrect(password);

    if (!isPassValid) {
        throw new ApiError(401, "user credential are invalid")
    }

    const { accessToken, refreshToken } = await genrateRefreshAndAccessToken(user._id)

    const logedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: logedInUser, accessToken, refreshToken
                },
                "user logged in successfuly"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(201, {}, "user logout successfully"))
})

export { registerUser, loginUser, logoutUser }