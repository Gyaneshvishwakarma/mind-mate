import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

const DB_NAME = "mindmate"

export async function getDatabase() {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Notes operations
export async function createNote(userId, noteData) {
  const db = await getDatabase()
  const note = {
    ...noteData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const result = await db.collection("notes").insertOne(note)
  return { ...note, id: result.insertedId.toString(), _id: result.insertedId }
}

export async function getNotes(userId) {
  const db = await getDatabase()
  const notes = await db.collection("notes").find({ userId }).sort({ updatedAt: -1 }).toArray()
  return notes.map((note) => ({ ...note, id: note._id.toString() }))
}

export async function getNote(userId, noteId) {
  const db = await getDatabase()
  const note = await db.collection("notes").findOne({ _id: new ObjectId(noteId), userId })
  return note ? { ...note, id: note._id.toString() } : null
}

export async function updateNote(userId, noteId, updates) {
  const db = await getDatabase()
  const result = await db
    .collection("notes")
    .updateOne({ _id: new ObjectId(noteId), userId }, { $set: { ...updates, updatedAt: new Date() } })
  return result.modifiedCount > 0
}

export async function deleteNote(userId, noteId) {
  const db = await getDatabase()
  const result = await db.collection("notes").deleteOne({ _id: new ObjectId(noteId), userId })
  return result.deletedCount > 0
}

// Tasks operations
export async function createTask(userId, taskData) {
  const db = await getDatabase()
  const task = {
    ...taskData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const result = await db.collection("tasks").insertOne(task)
  return { ...task, id: result.insertedId.toString(), _id: result.insertedId }
}

export async function getTasks(userId) {
  const db = await getDatabase()
  const tasks = await db.collection("tasks").find({ userId }).sort({ createdAt: -1 }).toArray()
  return tasks.map((task) => ({ ...task, id: task._id.toString() }))
}

export async function getTask(userId, taskId) {
  const db = await getDatabase()
  const task = await db.collection("tasks").findOne({ _id: new ObjectId(taskId), userId })
  return task ? { ...task, id: task._id.toString() } : null
}

export async function updateTask(userId, taskId, updates) {
  const db = await getDatabase()
  const result = await db.collection("tasks").updateOne(
    { _id: new ObjectId(taskId), userId }, 
    { $set: { ...updates, updatedAt: new Date() } }
  )
  return result.modifiedCount > 0
}

export async function deleteTask(userId, taskId) {
  const db = await getDatabase()
  const result = await db.collection("tasks").deleteOne({ _id: new ObjectId(taskId), userId })
  return result.deletedCount > 0
}

// Goals operations
export async function createGoal(userId, goalData) {
  const db = await getDatabase()
  const goal = {
    ...goalData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const result = await db.collection("goals").insertOne(goal)
  return { ...goal, id: result.insertedId.toString(), _id: result.insertedId }
}

export async function getGoals(userId) {
  const db = await getDatabase()
  const goals = await db.collection("goals").find({ userId }).sort({ createdAt: -1 }).toArray()
  return goals.map((goal) => ({ ...goal, id: goal._id.toString() }))
}

export async function getGoal(userId, goalId) {
  const db = await getDatabase()
  const goal = await db.collection("goals").findOne({ _id: new ObjectId(goalId), userId })
  return goal ? { ...goal, id: goal._id.toString() } : null
}

export async function updateGoal(userId, goalId, updates) {
  const db = await getDatabase()
  const result = await db.collection("goals").updateOne(
    { _id: new ObjectId(goalId), userId }, 
    { $set: { ...updates, updatedAt: new Date() } }
  )
  return result.modifiedCount > 0
}

export async function deleteGoal(userId, goalId) {
  const db = await getDatabase()
  const result = await db.collection("goals").deleteOne({ _id: new ObjectId(goalId), userId })
  return result.deletedCount > 0
}

// Projects operations
export async function createProject(userId, projectData) {
  const db = await getDatabase()
  const project = {
    ...projectData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const result = await db.collection("projects").insertOne(project)
  return { ...project, id: result.insertedId.toString(), _id: result.insertedId }
}

export async function getProjects(userId) {
  const db = await getDatabase()
  const projects = await db.collection("projects").find({ userId }).sort({ createdAt: -1 }).toArray()
  return projects.map((project) => ({ ...project, id: project._id.toString() }))
}

export async function getProject(userId, projectId) {
  const db = await getDatabase()
  const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId), userId })
  return project ? { ...project, id: project._id.toString() } : null
}

export async function updateProject(userId, projectId, updates) {
  const db = await getDatabase()
  const result = await db.collection("projects").updateOne(
    { _id: new ObjectId(projectId), userId }, 
    { $set: { ...updates, updatedAt: new Date() } }
  )
  return result.modifiedCount > 0
}

export async function deleteProject(userId, projectId) {
  const db = await getDatabase()
  const result = await db.collection("projects").deleteOne({ _id: new ObjectId(projectId), userId })
  return result.deletedCount > 0
}

// Focus Sessions operations
export async function createFocusSession(userId, sessionData) {
  const db = await getDatabase()
  const session = {
    ...sessionData,
    userId,
    completedAt: new Date(),
  }
  const result = await db.collection("focusSessions").insertOne(session)
  return { ...session, id: result.insertedId.toString(), _id: result.insertedId }
}

export async function getFocusSessions(userId) {
  const db = await getDatabase()
  const sessions = await db.collection("focusSessions").find({ userId }).sort({ completedAt: -1 }).toArray()
  return sessions.map((session) => ({ ...session, id: session._id.toString() }))
}

export async function getFocusSession(userId, sessionId) {
  const db = await getDatabase()
  const session = await db.collection("focusSessions").findOne({ _id: new ObjectId(sessionId), userId })
  return session ? { ...session, id: session._id.toString() } : null
}

export async function updateFocusSession(userId, sessionId, updates) {
  const db = await getDatabase()
  const result = await db.collection("focusSessions").updateOne(
    { _id: new ObjectId(sessionId), userId }, 
    { $set: { ...updates, updatedAt: new Date() } }
  )
  return result.modifiedCount > 0
}

export async function deleteFocusSession(userId, sessionId) {
  const db = await getDatabase()
  const result = await db.collection("focusSessions").deleteOne({ _id: new ObjectId(sessionId), userId })
  return result.deletedCount > 0
}

// User settings operations
export async function getUserSettings(userId) {
  const db = await getDatabase()
  const settings = await db.collection("userSettings").findOne({ userId })
  return (
    settings || {
      userId,
      pomodoroSettings: {
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        backgroundSound: false,
      },
      theme: "dark",
    }
  )
}

export async function updateUserSettings(userId, settings) {
  const db = await getDatabase()
  const result = await db
    .collection("userSettings")
    .updateOne({ userId }, { $set: { ...settings, updatedAt: new Date() } }, { upsert: true })
  return result.modifiedCount > 0 || result.upsertedCount > 0
}

// AI Responses operations
export async function createAIResponse(userId, responseData) {
  const db = await getDatabase()
  const aiResponse = {
    ...responseData,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const result = await db.collection("aiResponses").insertOne(aiResponse)
  return { ...aiResponse, id: result.insertedId.toString(), _id: result.insertedId }
}

export async function getAIResponses(userId) {
  const db = await getDatabase()
  const responses = await db.collection("aiResponses").find({ userId }).sort({ createdAt: -1 }).toArray()
  return responses.map((response) => ({ ...response, id: response._id.toString() }))
}

export async function getAIResponse(userId, responseId) {
  const db = await getDatabase()
  const response = await db.collection("aiResponses").findOne({ _id: new ObjectId(responseId), userId })
  return response ? { ...response, id: response._id.toString() } : null
}

export async function updateAIResponse(userId, responseId, updates) {
  const db = await getDatabase()
  const result = await db.collection("aiResponses").updateOne(
    { _id: new ObjectId(responseId), userId }, 
    { $set: { ...updates, updatedAt: new Date() } }
  )
  return result.modifiedCount > 0
}

export async function deleteAIResponse(userId, responseId) {
  const db = await getDatabase()
  const result = await db.collection("aiResponses").deleteOne({ _id: new ObjectId(responseId), userId })
  return result.deletedCount > 0
}

// Utility functions for advanced queries
export async function searchNotes(userId, searchTerm) {
  const db = await getDatabase()
  const notes = await db.collection("notes")
    .find({ 
      userId, 
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } }
      ]
    })
    .sort({ updatedAt: -1 })
    .toArray()
  return notes.map((note) => ({ ...note, id: note._id.toString() }))
}

export async function getTasksByStatus(userId, status) {
  const db = await getDatabase()
  const tasks = await db.collection("tasks")
    .find({ userId, status })
    .sort({ createdAt: -1 })
    .toArray()
  return tasks.map((task) => ({ ...task, id: task._id.toString() }))
}

export async function getTasksByProject(userId, projectId) {
  const db = await getDatabase()
  const tasks = await db.collection("tasks")
    .find({ userId, projectId })
    .sort({ createdAt: -1 })
    .toArray()
  return tasks.map((task) => ({ ...task, id: task._id.toString() }))
}

export async function getFocusSessionsStats(userId, startDate, endDate) {
  const db = await getDatabase()
  const sessions = await db.collection("focusSessions")
    .find({ 
      userId, 
      completedAt: { 
        $gte: startDate, 
        $lte: endDate 
      }
    })
    .toArray()
  
  return {
    totalSessions: sessions.length,
    totalMinutes: sessions.reduce((sum, session) => sum + (session.duration || 0), 0),
    averageMinutes: sessions.length > 0 ? 
      sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / sessions.length : 0,
    sessions: sessions.map((session) => ({ ...session, id: session._id.toString() }))
  }
}

// Bulk operations
export async function deleteMultipleNotes(userId, noteIds) {
  const db = await getDatabase()
  const objectIds = noteIds.map(id => new ObjectId(id))
  const result = await db.collection("notes").deleteMany({ 
    _id: { $in: objectIds }, 
    userId 
  })
  return result.deletedCount
}

export async function deleteMultipleTasks(userId, taskIds) {
  const db = await getDatabase()
  const objectIds = taskIds.map(id => new ObjectId(id))
  const result = await db.collection("tasks").deleteMany({ 
    _id: { $in: objectIds }, 
    userId 
  })
  return result.deletedCount
}

export async function updateMultipleTasks(userId, taskIds, updates) {
  const db = await getDatabase()
  const objectIds = taskIds.map(id => new ObjectId(id))
  const result = await db.collection("tasks").updateMany(
    { _id: { $in: objectIds }, userId },
    { $set: { ...updates, updatedAt: new Date() } }
  )
  return result.modifiedCount
}