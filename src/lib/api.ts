import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Video {
  _id: string
  titleHindi: string
  descriptionHindi: string
  descriptionEnglish: string
  videoUrl: string
  cloudinaryId: string
  createdAt: string
  status: string
}

export const VideosApi = {

  // ======================
  // UPLOAD
  // ======================

  async upload(
    file: File,
    title?: string
  ) {

    const formData =
      new FormData();

    formData.append(
      "videos",
      file
    );

    // CUSTOM TITLE

    if (title) {

      formData.append(
        "title",
        title
      );

    }

    const res =
      await api.post(

        "/api/upload",

        formData,

        {

          headers: {

            "Content-Type":
              "multipart/form-data",

          },

        }

      );

    return res.data;

  },

  // ======================
  // LIST
  // ======================

  async list() {

    const res =
      await api.get(
        "/api/videos"
      );

    return res.data;

  },

  // ======================
  // DELETE
  // ======================

  async remove(id: string) {

    const res =
      await api.delete(
        `/api/videos/${id}`
      );

    return res.data;

  },

  // ======================
  // ANALYTICS
  // ======================

  async analytics() {

    const res =
      await api.get(
        "/api/videos/analytics"
      );

    return res.data;

  },

};