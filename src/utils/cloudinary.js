import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: Process.env.CLOUDINARY_CLOUD_NAME,
    api_key: Process.env.CLOUDINARY_API_KEY,
    api_secret: Process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log("file is upload on cloudinary", response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the localy saved temporary file as the upload operation 
    }
}

export { uploadOnCloudinary }