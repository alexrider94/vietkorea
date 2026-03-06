export type RegionFilter = 'All' | 'Seoul' | 'Daejeon' | 'Busan' | 'Daegu' | 'Incheon';

export type MajorFilter =
  | 'All'
  | 'Engineering'
  | 'Business'
  | 'Computer Science'
  | 'Language'
  | 'Design'
  | 'Medicine';

export interface UniversityFilters {
  query: string;
  region: RegionFilter;
  major: MajorFilter;
}

export interface UniversitySummary {
  id: string;
  name: string;
  location: string;
  region: Exclude<RegionFilter, 'All'>;
  major: Exclude<MajorFilter, 'All'>;
  ranking: number;
  type: 'Public' | 'Private';
  heroImage: string;
  featuredTag: string;
}

export interface UniversityDetail extends UniversitySummary {
  summary: string;
  programs: string[];
  scholarships: string[];
  tuitionRange: string;
  mapLabel: string;
}

export interface CommunityPost {
  id: string;
  category: 'All Posts' | 'TOPIK' | 'Visa' | 'University Life' | 'Housing' | 'Jobs';
  author: string;
  title: string;
  body: string;
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  city: string;
  verified: boolean;
  bio: string;
  language: 'vi' | 'ko' | 'mixed';
  stats: {
    posts: number;
    comments: number;
    saved: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
}

export interface UniversityListResponse extends PaginatedResponse<UniversitySummary> {
  featured: UniversitySummary[];
}

export interface PostDetailResponse {
  post: CommunityPost;
  comments: Comment[];
}
