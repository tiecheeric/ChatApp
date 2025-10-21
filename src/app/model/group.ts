export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[]; // user ids
  avatar?: string;
  createdAt: string; // ISO
}
