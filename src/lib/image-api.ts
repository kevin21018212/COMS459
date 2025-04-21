const API = import.meta.env.VITE_IMAGE_API_URL;

export async function listImages() {
  return fetch(`${API}/list`).then((res) => res.json());
}

export async function makePublic(key: string) {
  return fetch(`${API}/make-public`, {
    method: "POST",
    body: JSON.stringify({ key }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

export async function makePrivate(key: string) {
  return fetch(`${API}/make-private`, {
    method: "POST",
    body: JSON.stringify({ key }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

export async function deleteImage(key: string) {
  return fetch(`${API}/delete`, {
    method: "POST",
    body: JSON.stringify({ key }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}
