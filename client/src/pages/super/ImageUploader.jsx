import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AppContext";
import {toast,ToastContainer} from 'react-toastify';
const ImageUploader = () => {
  const [images, setImages] = useState([]); // Store selected images
  const [preview, setPreview] = useState([]); // Store image previews
  const [loading, setLoading] = useState(false);
  const { url } = useAuth();

  // 📌 Handle File Selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  // 📌 Upload Images to Backend
  const uploadImages = async () => {
    if (images.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    try {
      setLoading(true);
      const res = await axios.post(`${url}/api/v1/upload-image`, formData, {
        withCredentials: true,
      });

      toast.success(res.data.message);
      setImages([]); // Clear selection
      setPreview([]); // Clear preview
    } catch (error) {
      console.error("Upload failed", error);
      toast.error(error.response?.data?.message || "Failed to upload images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Upload Images</h2>

      {/* File Input */}
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />

      {/* Image Previews */}
      <div className="flex gap-2 mt-4">
        {preview.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="Preview"
            className="w-24 h-24 object-cover rounded border"
          />
        ))}
      </div>

      {/* Upload Button */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 cursor-pointer"
        onClick={uploadImages}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default ImageUploader;
