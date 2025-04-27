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
  return fetch(`${API}/list`, {
    headers: await authHeader(),
  }).then((res) => res.json());
}

export async function makePublic(key: string) {
  return fetch(`${API}/make-public`, {
    method: "POST",
    body: JSON.stringify({ key }),
    headers: await authHeader(),
  }).then((res) => res.json());
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
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${API}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((res) => res.json());
}
