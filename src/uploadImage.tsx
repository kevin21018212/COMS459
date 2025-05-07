import "./image.css";
import { useState } from "react";
import { uploadImage } from "./lib/image-api";

interface UploadImageProps {
  onUploadComplete: () => void;
}

export default function UploadImage({ onUploadComplete }: UploadImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await uploadImage(selectedFile);
      setSelectedFile(null);
      onUploadComplete();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <label htmlFor="file-upload" className={`file-upload-label ${!selectedFile ? "highlight" : ""}`}>
        {selectedFile ? selectedFile.name : "Choose File"}
      </label>

      <input
        id="file-upload"
        type="file"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="hidden-file-input"
      />
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
