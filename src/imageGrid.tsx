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
  loading: boolean;
}

export default function ImageGrid({ images, onMakePublic, onMakePrivate, onDelete, loading }: ImageGridProps) {
  return (
    <div className="image-grid">
      {loading && <p className="grid-loading">Updating...</p>}
      {images.map((img) => (
        <div key={img.key} className={`image-card ${img.visibility === "private" ? "gray" : ""}`}>
          <img src={img.url} alt={img.key} />

          <div className="actions">
            {img.visibility === "private" ? (
              <>
                <button onClick={() => onMakePublic(img.key)} disabled={loading}>
                  Make Public
                </button>
                <button onClick={() => onDelete(img.key)} disabled={loading}>
                  Delete
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onMakePrivate(img.key)} disabled={loading}>
                  Make Private
                </button>
                <a className="link" href={img.url} target="_blank" rel="noopener noreferrer">
                  🔗 View Public Link
                </a>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
