
export interface CareerItem {
  period: string;
  title: string;
  company: string;
  details: string[];
}

export interface LectureItem {
  category: string;
  topics: string[];
}

export interface GoalItem {
  id: number;
  title: string;
  description: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
