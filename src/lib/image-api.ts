import { fetchAuthSession } from "aws-amplify/auth";

const API = import.meta.env.VITE_IMAGE_API_URL;

async function authHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function listImages() {
  const metadataList = await fetch(`${API}/listImages`, {
    headers: await authHeader(),
  }).then((res) => res.json());

  return Promise.all(
    metadataList.map(async (item: any) => {
      const filename = item.photo_name;

      if (!filename) {
        console.warn("Missing photo_name for item:", item);
        return null;
      }

      const imageUrl = `${API}/list?filename=${encodeURIComponent(filename)}`;
      console.log("Fetching:", imageUrl);

      const res = await fetch(imageUrl, {
        headers: await authHeader(),
      });

      if (!res.ok) {
        console.error(`Failed to fetch image ${filename}:`, res.status);
        return null;
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      console.log(item);
      return {
        key: filename,
        url: objectUrl,
        visibility: item.type,
      };
    })
  ).then((results) => results.filter(Boolean));
}

export async function makePublic(key: string) {
  const res = await fetch(`${API}/make-public`, {
    method: "POST",
    body: JSON.stringify({ key }),
    headers: await authHeader(),
  });

  const data = await res.json();
  return { key, url: data.public_url };
}

export async function makePrivate(key: string) {
  return fetch(`${API}/make-private`, {
    method: "POST",
    body: JSON.stringify({ key }),
    headers: await authHeader(),
  }).then((res) => res.json());
}

export async function deleteImage(key: string) {
  return fetch(`${API}/delete`, {
    method: "POST",
    body: JSON.stringify({ key }),
    headers: await authHeader(),
  }).then((res) => res.json());
}

export async function uploadImage(file: File) {
  console.log("[uploadImage] Starting image upload...");

  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  if (!token) {
    console.error("[uploadImage] No access token found.");
    throw new Error("Authentication token is missing.");
  }

  console.log("[uploadImage] Retrieved access token.");

  const formData = new FormData();
  formData.append("file", file);

  console.log("[uploadImage] FormData prepared:");
  for (const [key, value] of formData.entries()) {
    console.log(`  - ${key}:`, value);
  }

  try {
    const response = await fetch(`${API}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log(`[uploadImage] Response status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      console.error("[uploadImage] Server responded with error:", text);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("[uploadImage] Upload successful:", data);
    return data;
  } catch (err) {
    console.error("[uploadImage] Upload failed:", err);
    throw err;
  }
}
