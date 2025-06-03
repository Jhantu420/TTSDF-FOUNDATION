import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { X } from 'lucide-react'; // Importing the 'X' icon from lucide-react
import { useAuth } from "../../context/AppContext";

const ImageUploader = () => {
  const [images, setImages] = useState([]); // Stores selected File objects
  const [preview, setPreview] = useState([]); // Stores URLs for image previews
  const [loading, setLoading] = useState(false);
  const {url} = useAuth();
  // Assuming 'url' comes from a context or is defined elsewhere.

  // Effect to clean up object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      preview.forEach(fileUrl => URL.revokeObjectURL(fileUrl));
    };
  }, [preview]);

  // Handle File Selection: Updates images and generates previews
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...files]); // Add new files to existing ones

    // Generate previews for new files and append to existing previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreview(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  // Remove an image from the selection and its preview
  const removeImage = (indexToRemove) => {
    // Filter out the image at the specified index
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));

    // Revoke the object URL for the removed image to free up memory
    URL.revokeObjectURL(preview[indexToRemove]);
    // Filter out the preview URL at the specified index
    setPreview(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  // Upload Images to Backend
  const uploadImages = async () => {
    if (images.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image)); // 'images' should match your backend's expected field name

    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const res = await axios.post(`${url}/api/v1/upload-image`, formData, {
        withCredentials: true, // If your API requires cookies/credentials
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      toast.success(res.data.message || "Images uploaded successfully!");
      setImages([]); // Clear selection after successful upload
      setPreview([]); // Clear previews after successful upload
    } catch (error) {
      console.error("Upload failed", error);
      // Display a more user-friendly error message
      toast.error(error.response?.data?.message || "Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen flex flex-col items-center justify-center font-inter">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="w-full max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Upload Your Images</h2>
        <p className="text-sm text-red-500 mb-6 text-center">NOTE - 5 picture's' at a time</p>

        {/* File Input Section */}
        <div className="mb-6">
          <label htmlFor="file-upload" className="block text-lg font-medium text-gray-700 mb-2">
            Select Images:
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Image Previews Section */}
        {preview.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Image Previews:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {preview.map((src, index) => (
                <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md border border-gray-200 group">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Close Icon */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X size={16} /> {/* Lucide-react X icon */}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          onClick={uploadImages}
          disabled={loading || images.length === 0}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            "Upload Images"
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;