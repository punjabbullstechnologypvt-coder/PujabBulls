import { useEffect, useState } from "react";
import { getAllVideos, deleteVideo } from "../../services/videoService";
import "../../Styles/managevideo.css";

const extractVideoId = (url) => {
  const match = url.match(
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?]+)/
  );
  return match ? match[1] : null;
};

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);

  const loadVideos = async () => {
    try {
      const data = await getAllVideos();
      setVideos(data);
    } catch (err) {
      console.error("Failed to load videos", err);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;

    try {
      await deleteVideo(id);
      setVideos(videos.filter((v) => v._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="manage-videos-page">
      <h2>Manage Videos</h2>

      <div className="videos-grid">
        {videos.map((video) => {
          const videoId = extractVideoId(video.youtubeUrl);

          return (
            <div key={video._id} className="video-card-admin">

              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={video.title}
                allowFullScreen
              />

              <h3>{video.title}</h3>

              <p className="slug">{video.pageSlug}</p>

              <button
                className="delete-btn"
                onClick={() => handleDelete(video._id)}
              >
                Delete
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageVideos;