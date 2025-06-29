// Type definitions as JSDoc comments for better IDE support

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 * @property {string} [profilePicture]
 */

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} snippet
 * @property {string[]} tags
 * @property {boolean} isPinned
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Date} deadline
 * @property {number} progress
 * @property {Subtask[]} subtasks
 * @property {boolean} isCompleted
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Subtask
 * @property {string} id
 * @property {string} title
 * @property {boolean} isCompleted
 * @property {Date} [dueDate]
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {boolean} isCompleted
 * @property {boolean} isDaily
 * @property {boolean} isRecurring
 * @property {string} [goalId]
 * @property {Date} [dueDate]
 * @property {"low" | "medium" | "high"} priority
 * @property {Date} createdAt
 * @property {string} [projectId]
 * @property {string[]} labels
 * @property {Subtask[]} subtasks
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} color
 * @property {boolean} isArchived
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} TaskFilter
 * @property {string} [project]
 * @property {"low" | "medium" | "high"} [priority]
 * @property {"today" | "week" | "overdue"} [dueDate]
 * @property {boolean} [completed]
 * @property {string} [label]
 */

/**
 * @typedef {Object} StudyPlan
 * @property {string} id
 * @property {Date} date
 * @property {StudyTopic[]} topics
 * @property {number} totalDuration
 */

/**
 * @typedef {Object} StudyTopic
 * @property {string} id
 * @property {string} name
 * @property {number} duration
 * @property {boolean} isCompleted
 * @property {string} [notes]
 */

/**
 * @typedef {Object} PDFDocument
 * @property {string} id
 * @property {string} name
 * @property {File} file
 * @property {Date} uploadedAt
 * @property {ChatMessage[]} chatHistory
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {string} message
 * @property {string} response
 * @property {Date} timestamp
 * @property {boolean} [savedAsNote]
 */

/**
 * @typedef {Object} FocusSession
 * @property {string} id
 * @property {number} duration
 * @property {string} [taskId]
 * @property {Date} completedAt
 * @property {"pomodoro" | "custom"} type
 */

export {}
