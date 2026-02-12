export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NON_BINARY = "NON_BINARY",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  previewUrl: string | null;
  thumbnail: string | null;
  duration: string | null;
  views: number;
  models: Model[];
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Model {
  id: string;
  name: string;
  ethnicity: string | null;
  gender: Gender | null;
  image: string | null;
  bio: string | null;
  dateOfBirth: Date | null;
  measurements: string | null;
  videos: Video[];
  createdAt: Date;
  updatedAt: Date;
}
