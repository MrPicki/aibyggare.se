import { Timestamp } from "firebase/firestore";

// ─── Profiles ────────────────────────────────────────────────────────────────
export interface Profile {
  id: string; // = Firebase Auth UID
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  tools: string[];
  role: "user" | "admin";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Projects ────────────────────────────────────────────────────────────────
export type ProjectStatus =
  | "idea"
  | "mvp"
  | "live"
  | "feedback"
  | "testers"
  | "cofounder";

export interface Project {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  problem: string;
  stack: string[];
  status: ProjectStatus;
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  feedbackWanted: string;
  isFeatured: boolean;
  upvoteCount: number;
  commentCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Posts (hjälpfrågor, prompts, guider) ────────────────────────────────────
export type PostType = "help" | "prompt" | "guide" | "discussion";
export type PostStatus = "open" | "solved" | "archived";

export interface Post {
  id: string;
  userId: string;
  type: PostType;
  title: string;
  slug: string;
  body: string;
  tool: string;
  status: PostStatus;
  tags: string[];
  isFeatured: boolean;
  acceptedCommentId: string | null;
  upvoteCount: number;
  commentCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Comments ─────────────────────────────────────────────────────────────────
export interface Comment {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  projectId: string | null;
  postId: string | null;
  parentId: string | null;
  body: string;
  isAccepted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Votes ───────────────────────────────────────────────────────────────────
export interface Vote {
  id: string;
  userId: string;
  projectId: string | null;
  postId: string | null;
  commentId: string | null;
  value: 1 | -1;
  createdAt: Timestamp;
}

// ─── Bookmarks ───────────────────────────────────────────────────────────────
export interface Bookmark {
  id: string;
  userId: string;
  projectId: string | null;
  postId: string | null;
  createdAt: Timestamp;
}
