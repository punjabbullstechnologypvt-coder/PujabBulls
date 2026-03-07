import { useState } from "react";
import { uploadVideo } from "../../services/videoService";
import "../../Styles/adminvideo.css";

const UploadVideo = () => {
  const [form, setForm] = useState({
    title: "",
    youtubeUrl: "",
    pageSlug: "",
    description: "",
  });

  const [previewId, setPreviewId] = useState(null);
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/|youtube\.com\/shorts\/)([^&]+)/,
    );
    return match ? match[1] : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target.value
      ? e.target
      : { name: e.target.name, value: e.target.value };

    setForm({ ...form, [name]: value });

    if (name === "youtubeUrl") {
      const id = extractVideoId(value);
      setPreviewId(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await uploadVideo(form);
      alert("Video uploaded successfully");

      setForm({
        title: "",
        youtubeUrl: "",
        pageSlug: "",
        description: "",
      });

      setPreviewId(null);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-video-page">
      <h2>Upload YouTube Video</h2>

      <form onSubmit={handleSubmit} className="video-form">

        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="youtubeUrl"
          placeholder="Paste YouTube URL"
          value={form.youtubeUrl}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="pageSlug"
          placeholder="Page Slug (example: what-is-business-central)"
          value={form.pageSlug}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Video Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>

      {previewId && (
        <div className="video-preview">
          <h3>Preview</h3>

          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${previewId}`}
            title="Video preview"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default UploadVideo;