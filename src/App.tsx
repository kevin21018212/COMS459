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

  const handleMakePublic = (key: string) => {
    makePublic(key).then(loadImages);
  };

  const handleMakePrivate = (key: string) => {
    makePrivate(key).then(loadImages);
  };

  const handleDelete = (key: string) => {
    deleteImage(key).then(loadImages);
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
      <h1>Your Images</h1>
      <button onClick={() => signOut().then(() => navigate("/login"))}>Sign Out</button>
      <ImageGrid
        images={images}
        onMakePublic={handleMakePublic}
        onMakePrivate={handleMakePrivate}
        onDelete={handleDelete}
      />

      <UploadImage onUploadComplete={loadImages} />
    </div>
  );
}

export default App;
