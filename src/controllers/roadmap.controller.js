import Suggestions from "../models/suggestion.model.js"

export const getRoadmaps = async (req, res, next) => {
  try {
    const roadmapsData = await Suggestions.find({
      status: { $ne: "suggestion" }
    })
    const planned = roadmapsData.filter(
      (roadmap) => roadmap.status === "planned"
    )
    const inProgress = roadmapsData.filter(
      (roadmap) => roadmap.status === "in-progress"
    )
    const live = roadmapsData.filter((roadmap) => roadmap.status === "live")

    const modifiedData = [
      { status: "planned", data: planned },
      { status: "in-progress", data: inProgress },
      { status: "live", data: live }
    ]
    res.status(200).json(modifiedData)
  } catch (err) {
    next(err)
  }
}
