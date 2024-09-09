import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { path } = req.query;

  if (!path) {
    return res
      .status(400)
      .json({ message: "Path query parameter is required" });
  }

  try {
    if (typeof path === "string") {
      await res.revalidate(path);
      return res.json({ revalidated: true });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error revalidating", error: err.message });
  }
}
