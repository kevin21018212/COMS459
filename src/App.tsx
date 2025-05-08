import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { listImages, makePublic, makePrivate, deleteImage } from "./lib/image-api";
import "./App.css";
import ImageGrid from "./imageGrid";
import UploadImage from "./uploadImage";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

function App() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  Amplify.configure({ ...awsExports });

  useEffect(() => {
    getCurrentUser()
      .then(() => {
        setLoggedIn(true);
        loadImages();
      })
      .catch(() => {
        setLoggedIn(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const loadImages = async () => {
    const data = await listImages();
    setImages(data);
  };

  const handleMakePublic = async (key: string) => {
    setGridLoading(true);
    try {
      const { url: publicUrl } = await makePublic(key);
      setImages((prevImages) =>
        prevImages.map((img) => (img.key === key ? { ...img, url: publicUrl, visibility: "public" } : img))
      );
    } catch (err) {
      console.error("Failed to make public:", err);
    } finally {
      setGridLoading(false);
    }
  };

  const handleMakePrivate = async (key: string) => {
    setGridLoading(true);
    await makePrivate(key);
    await loadImages();
    setGridLoading(false);
  };

  const handleDelete = async (key: string) => {
    setGridLoading(true);
    await deleteImage(key);
    await loadImages();
    setGridLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  if (!loggedIn) {
    return (
      <div className="container">
        <div className="login-box">
          <h1>Not Logged In</h1>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <button className="sign-out" onClick={() => signOut().then(() => navigate("/login"))}>
          Sign Out
        </button>
      </div>
      <div className="grid-title">
        <h1>Your Images</h1>
      </div>
      <ImageGrid
        images={images}
        onMakePublic={handleMakePublic}
        onMakePrivate={handleMakePrivate}
        onDelete={handleDelete}
        loading={gridLoading}
      />

      <UploadImage onUploadComplete={loadImages} />
    </div>
  );
}

export default App;
