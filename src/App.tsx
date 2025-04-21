import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";
import { listImages, makePublic, makePrivate, deleteImage } from "./lib/image-api";
import "./App.css";

function App() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  if (loading) return <p>Loading...</p>;

  if (!loggedIn) {
    return (
      <div className="container">
        <h1>Not Logged In</h1>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Your Images</h1>
      <div className="image-grid">
        {images.map((img) => (
          <div key={img.key} className={`image-card ${img.visibility === "private" ? "gray" : ""}`}>
            <img src={img.url} alt={img.key} />
            <div className="actions">
              {img.visibility === "private" ? (
                <>
                  <button onClick={() => makePublic(img.key).then(loadImages)}>Make Public</button>
                  <button onClick={() => deleteImage(img.key).then(loadImages)}>Delete</button>
                </>
              ) : (
                <>
                  <button onClick={() => makePrivate(img.key).then(loadImages)}>Make Private</button>
                  <p className="link">🔗 {img.url}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
