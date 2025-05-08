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
  if (loading) {
    return <div className="grid-spinner"></div>;
  }

  return (
    <div className="image-grid">
      {images.map((img) => (
        <div key={img.key} className={`image-card ${img.visibility === "private" ? "gray" : ""}`}>
          <img src={img.url} alt={img.key} />

          <div className="actions">
            {img.visibility === "private" ? (
              <>
                <div className="btn-tray">
                  <button onClick={() => onMakePublic(img.key)} disabled={loading}>
                    Make Public
                  </button>
                  <button onClick={() => onDelete(img.key)} disabled={loading}>
                    Delete
                  </button>
                </div>
                <a className="link" href={img.url} target="_blank" rel="noopener noreferrer">
                  🔗 {img.url}
                </a>
              </>
            ) : (
              <>
                <button onClick={() => onMakePrivate(img.key)} disabled={loading}>
                  Make Private
                </button>
                <a className="link" href={img.url} target="_blank" rel="noopener noreferrer" title={img.url}>
                  {img.url.length > 50 ? `${img.url.slice(0, 50)}...` : img.url}
                </a>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
