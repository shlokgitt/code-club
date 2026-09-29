export const CATEGORIES = ["Workshop", "Hackathon", "Talk", "Social"] as const;

export type EventDTO = {
  id: number;
  name: string;
  category: string;
  date: string; // ISO string
  venue: string;
  description: string;
  capacity: number;
  featured: boolean;
  spotsLeft: number;
  
};
export type RegDTO = {
  id: number; name: string; email: string; college: string; phone: string;
  createdAt: string; eventId: number; eventName: string;
};