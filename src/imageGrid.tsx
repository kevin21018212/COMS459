import "./image.css";
interface Image {
  key: string;
  url: string;
  visibility: "private" | "public";
}

interface ImageGridProps {
  images: Image[];
  onMakePublic: (key: string) => void;
  onMakePrivate: (key: string) => void;
  onDelete: (key: string) => void;
}

export default function ImageGrid({ images, onMakePublic, onMakePrivate, onDelete }: ImageGridProps) {
  return (
    <div className="image-grid">
      {images.map((img) => (
        <div key={img.key} className={`image-card ${img.visibility === "private" ? "gray" : ""}`}>
          <img src={img.url} alt={img.key} />
          <div className="actions">
            {img.visibility === "private" ? (
              <>
                <button onClick={() => onMakePublic(img.key)}>Make Public</button>
                <button onClick={() => onDelete(img.key)}>Delete</button>
              </>
            ) : (
              <>
                <button onClick={() => onMakePrivate(img.key)}>Make Private</button>
                <p className="link">🔗 {img.url}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
