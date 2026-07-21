import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface User {
  id: string;
  google_id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
  last_login: string;
}

const DB_PATH = path.join(process.cwd(), "users.json");

export class Database {
  private static loadUsers(): User[] {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
      return [];
    }
    try {
      const data = fs.readFileSync(DB_PATH, "utf8");
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading database file, resetting:", e);
      return [];
    }
  }

  private static saveUsers(users: User[]) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
    } catch (e) {
      console.error("Error writing to database file:", e);
    }
  }

  public static findUserByGoogleId(googleId: string): User | undefined {
    const users = this.loadUsers();
    return users.find((u) => u.google_id === googleId);
  }

  public static upsertUser(profile: Omit<User, "id" | "created_at" | "last_login">): User {
    const users = this.loadUsers();
    const existingIndex = users.findIndex((u) => u.google_id === profile.google_id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = users[existingIndex];
      const updated: User = {
        ...existing,
        ...profile,
        last_login: now,
      };
      users[existingIndex] = updated;
      this.saveUsers(users);
      return updated;
    } else {
      const newUser: User = {
        id: crypto.randomUUID(),
        ...profile,
        created_at: now,
        last_login: now,
      };
      users.push(newUser);
      this.saveUsers(users);
      return newUser;
    }
  }
}
