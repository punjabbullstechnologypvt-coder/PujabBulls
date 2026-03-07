import { useEffect, useState } from "react";
import { getVideosByPage } from "../services/videoService";
import "./styles/videosection.css";

const extractVideoId = (url) => {
  const match = url.match(
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?]+)/
  );
  return match ? match[1] : null;
};

const VideoSection = ({ slug }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideosByPage(slug);
        setVideos(data);
      } catch (err) {
        console.error("Failed to load videos", err);
      }
    };

    loadVideos();
  }, [slug]);

  if (!videos.length) return null;

  return (
    <div className="video-section">
      {videos.map((video) => {
        const videoId = extractVideoId(video.youtubeUrl);

        if (!videoId) return null;

        return (
          <div key={video._id} className="video-card">
            <h3>{video.title}</h3>

            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* {video.description && <p>{video.description}</p>} */}
          </div>
        );
      })}
    </div>
  );
};

export default VideoSection;