export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "user"
  profileName?: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  id: string
  userId: string
  theme: string
  language: string
  notifications: boolean
  eventColors?: string
}

export interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  color: string
  notes: string
  imageUrl: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  imageUrl?: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

// In-memory storage
const users = new Map<string, User>()
const userSettings = new Map<string, UserSettings>()
const events = new Map<string, Event>()
const posts = new Map<string, Post>()

// Hash SHA-256 correcto para "admin123"
const ADMIN_PASSWORD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"

const adminUser: User = {
  id: "1",
  email: "admin@makyforce.com",
  password: ADMIN_PASSWORD_HASH,
  name: "Administrador",
  role: "admin",
  profileName: "Administrador",
  profileImage: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
}
users.set(adminUser.email, adminUser)
console.log("[v0] Admin user initialized:", adminUser.email)

// User operations
export const userDb = {
  async findByEmail(email: string): Promise<User | null> {
    console.log("[v0] userDb.findByEmail called for:", email)
    const user = users.get(email) || null
    console.log("[v0] User found:", !!user)
    return user
  },

  async findById(id: string): Promise<User | null> {
    console.log("[v0] userDb.findById called for:", id)
    for (const user of users.values()) {
      if (user.id === id) {
        console.log("[v0] User found by id")
        return user
      }
    }
    console.log("[v0] User not found by id")
    return null
  },

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    console.log("[v0] userDb.create called for email:", data.email)
    const id = Date.now().toString()
    const user: User = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.set(user.email, user)
    console.log("[v0] User created successfully:", user.email)
    return user
  },

  async update(id: string, data: Partial<User>): Promise<User | null> {
    console.log("[v0] userDb.update called for id:", id)
    const user = await this.findById(id)
    if (!user) {
      console.log("[v0] User not found for update")
      return null
    }

    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date(),
    }
    users.set(updatedUser.email, updatedUser)
    console.log("[v0] User updated successfully")
    return updatedUser
  },

  async delete(id: string): Promise<boolean> {
    console.log("[v0] userDb.delete called for id:", id)
    const user = await this.findById(id)
    if (!user) {
      console.log("[v0] User not found for deletion")
      return false
    }
    users.delete(user.email)
    console.log("[v0] User deleted successfully")
    return true
  },

  async findMany(): Promise<User[]> {
    console.log("[v0] userDb.findMany called")
    return Array.from(users.values())
  },
}

// Event operations
export const eventDb = {
  async findMany(userId?: string): Promise<Event[]> {
    const allEvents = Array.from(events.values())
    const filtered = userId ? allEvents.filter((e) => e.userId === userId) : allEvents
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  async findById(id: string): Promise<Event | null> {
    return events.get(id) || null
  },

  async create(data: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    console.log("[v0] eventDb.create called with data:", data)
    const id = Date.now().toString()
    const event: Event = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    events.set(id, event)
    console.log("[v0] Event created successfully:", event.id)
    return event
  },

  async update(id: string, data: Partial<Event>): Promise<Event | null> {
    console.log("[v0] eventDb.update called for id:", id)
    const event = events.get(id)
    if (!event) {
      console.log("[v0] Event not found for update")
      return null
    }

    const updatedEvent = {
      ...event,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    events.set(id, updatedEvent)
    console.log("[v0] Event updated successfully")
    return updatedEvent
  },

  async delete(id: string): Promise<boolean> {
    console.log("[v0] eventDb.delete called for id:", id)
    const deleted = events.delete(id)
    console.log("[v0] Event deleted:", deleted)
    return deleted
  },
}

// Post operations
export const postDb = {
  async findMany(published?: boolean): Promise<Post[]> {
    const allPosts = Array.from(posts.values())
    const filtered = published !== undefined ? allPosts.filter((p) => p.published === published) : allPosts
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  async findById(id: string): Promise<Post | null> {
    return posts.get(id) || null
  },

  async create(data: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
    const id = Date.now().toString()
    const post: Post = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    posts.set(id, post)
    return post
  },

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    const post = posts.get(id)
    if (!post) return null

    const updatedPost = {
      ...post,
      ...data,
      updatedAt: new Date(),
    }
    posts.set(id, updatedPost)
    return updatedPost
  },

  async delete(id: string): Promise<boolean> {
    return posts.delete(id)
  },
}

// User settings operations
export const userSettingsDb = {
  async findByUserId(userId: string): Promise<UserSettings | null> {
    for (const settings of userSettings.values()) {
      if (settings.userId === userId) return settings
    }
    return null
  },

  async create(data: Omit<UserSettings, "id">): Promise<UserSettings> {
    const id = Date.now().toString()
    const settings: UserSettings = {
      ...data,
      id,
    }
    userSettings.set(id, settings)
    return settings
  },

  async update(userId: string, data: Partial<UserSettings>): Promise<UserSettings | null> {
    const settings = await this.findByUserId(userId)
    if (!settings) return null

    const updatedSettings = {
      ...settings,
      ...data,
    }
    userSettings.set(settings.id, updatedSettings)
    return updatedSettings
  },
}
