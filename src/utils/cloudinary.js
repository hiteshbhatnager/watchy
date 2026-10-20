import { v2 as cloudinary } from 'cloudinary';

const uploadOnCloudinary = async (localFilePath) => {
    try {

    } catch (error) {
        console.log(error)
    }
}

cloudinary.config({
    cloud_name: Process.env.CLOUDINARY_CLOUD_NAME,
    api_key: Process.env.CLOUDINARY_API_KEY,
    api_secret: Process.env.CLOUDINARY_API_SECRET
});