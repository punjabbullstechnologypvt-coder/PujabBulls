import Video from "../models/Video.js";

// Add video
export const addVideo = async (req, res) => {
  try {
    const { title, youtubeUrl, pageSlug, description } = req.body;

    const video = await Video.create({
      title,
      youtubeUrl,
      pageSlug,
      description,
    });

    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get videos by page slug
export const getVideosByPage = async (req, res) => {
  try {
    const { slug } = req.params;

    const videos = await Video.find({ pageSlug: slug })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};