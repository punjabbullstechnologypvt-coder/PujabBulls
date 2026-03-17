import AuditLog from "../models/AuditLog.js";

export const getImageAuditLogs = async (req, res) => {
  try {
    const {
      limit = 100,
      publicId,
      blogId,
      eventType,
      level,
    } = req.query;

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
    const filter = {
      domain: "blog-image",
    };

    if (publicId) {
      filter["asset.publicId"] = publicId;
    }

    if (blogId) {
      filter["blog.id"] = blogId;
    }

    if (eventType) {
      filter.eventType = eventType;
    }

    if (level) {
      filter.level = level;
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(parsedLimit)
      .lean();

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};
