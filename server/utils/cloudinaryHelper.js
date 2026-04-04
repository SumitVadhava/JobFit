const cloudinary = require("../config/cloudinary");

/**
 * Uploads a base64 string to Cloudinary if it matches the data:image pattern
 * Otherwise returns the original string (presumably already a URL)
 * 
 * @param {string} imageStr - The image string (base64 or URL)
 * @param {string} folder - The Cloudinary folder to upload to
 * @returns {Promise<string>} - The Cloudinary URL or original string
 */
const uploadBase64Image = async (imageStr, folder = "profile_images") => {
  if (!imageStr || typeof imageStr !== "string") return imageStr;

  // Check if it's a base64 data URI
  if (imageStr.startsWith("data:")) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(imageStr, {
        folder: folder,
      });
      return uploadResponse.secure_url;
    } catch (error) {
      console.error("Cloudinary Backend Upload Error:", error);
      throw new Error("Failed to upload image to cloud storage");
    }
  }

  // If it doesn't look like base64, return as is (could be an existing URL)
  return imageStr;
};

module.exports = { uploadBase64Image };
