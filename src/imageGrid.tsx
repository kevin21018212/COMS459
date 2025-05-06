import "./image.css";

interface Image {
  key: string;
  base64_img: string; // changed from `url`
}

interface ImageGridProps {
  images: Image[];
  onMakePublic: (key: string) => void;
  onDelete: (key: string) => void;
}

export default function ImageGrid({ images, onMakePublic, onDelete }: ImageGridProps) {
  return (
    <div className="image-grid">
      {images.map((img) => (
        <div key={img.key} className="image-card gray">
          <img src={img.base64_img} alt={img.key} />
          <div className="actions">
            <button onClick={() => onMakePublic(img.key)}>Make Public</button>
            <button onClick={() => onDelete(img.key)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
