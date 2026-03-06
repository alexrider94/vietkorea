import {
  Comment,
  CommunityPost,
  MajorFilter,
  NotificationItem,
  PostDetailResponse,
  RegionFilter,
  UniversityDetail,
  UniversityFilters,
  UniversityListResponse,
  UniversitySummary,
  UserProfile,
} from '@/types/domain';
import { logInfo } from '@/services/logger';

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const regionOptions: Exclude<RegionFilter, 'All'>[] = ['Seoul', 'Daejeon', 'Busan', 'Daegu', 'Incheon'];
const majorOptions: Exclude<MajorFilter, 'All'>[] = [
  'Engineering',
  'Business',
  'Computer Science',
  'Language',
  'Design',
  'Medicine',
];

const universitySeed: UniversityDetail[] = [
  {
    id: 'snu',
    name: 'Seoul National University',
    location: 'Gwanak-gu, Seoul',
    region: 'Seoul',
    major: 'Engineering',
    ranking: 1,
    type: 'Public',
    heroImage: 'https://images.unsplash.com/photo-1476453747097-5c5f4f8e8b25?w=1400',
    featuredTag: 'Top Rank',
    summary: 'Strong national research university with global graduate pathways.',
    programs: ['Mechanical Engineering', 'Economics', 'Korean Language Program'],
    scholarships: ['Global Korea Scholarship', 'SNU Merit Scholarship'],
    tuitionRange: '$4,300 - $6,100 / semester',
    mapLabel: 'Line 2 access and direct campus bus routes',
  },
  {
    id: 'yonsei',
    name: 'Yonsei University',
    location: 'Seodaemun-gu, Seoul',
    region: 'Seoul',
    major: 'Business',
    ranking: 2,
    type: 'Private',
    heroImage: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=1400',
    featuredTag: 'Popular',
    summary: 'Top private university with strong exchange and startup ecosystem.',
    programs: ['Business Administration', 'International Studies', 'Media Design'],
    scholarships: ['Underwood International Scholarship', 'Need-based Grant'],
    tuitionRange: '$5,100 - $7,300 / semester',
    mapLabel: 'Near Sinchon transit hub and student housing',
  },
  {
    id: 'ku',
    name: 'Korea University',
    location: 'Seongbuk-gu, Seoul',
    region: 'Seoul',
    major: 'Computer Science',
    ranking: 3,
    type: 'Private',
    heroImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1400',
    featuredTag: 'High Demand',
    summary: 'Research-intensive school with strong engineering and AI programs.',
    programs: ['Computer Science', 'Electrical Engineering', 'Data Science'],
    scholarships: ['KU Global Leader', 'Academic Excellence Scholarship'],
    tuitionRange: '$4,900 - $7,000 / semester',
    mapLabel: 'Metro lines 6 and 4 with dense student district nearby',
  },
  {
    id: 'kaist',
    name: 'KAIST',
    location: 'Yuseong-gu, Daejeon',
    region: 'Daejeon',
    major: 'Engineering',
    ranking: 4,
    type: 'Public',
    heroImage: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=1400',
    featuredTag: 'Innovation',
    summary: 'Specialized STEM university with strong research funding and labs.',
    programs: ['Aerospace Engineering', 'Nuclear Science', 'Bioengineering'],
    scholarships: ['KAIST Tuition Waiver', 'Research Assistantship'],
    tuitionRange: '$3,800 - $5,400 / semester',
    mapLabel: 'Connected to Daejeon rail and research park',
  },
  {
    id: 'pusan',
    name: 'Pusan National University',
    location: 'Geumjeong-gu, Busan',
    region: 'Busan',
    major: 'Language',
    ranking: 5,
    type: 'Public',
    heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400',
    featuredTag: 'Coastal Campus',
    summary: 'Balanced public university with affordable language and humanities tracks.',
    programs: ['Korean Language', 'International Trade', 'Urban Planning'],
    scholarships: ['PNU Global Grant', 'Language Excellence Award'],
    tuitionRange: '$3,500 - $5,000 / semester',
    mapLabel: 'Busan Metro line access with lower housing cost zones',
  },
  {
    id: 'inha',
    name: 'Inha University',
    location: 'Michuhol-gu, Incheon',
    region: 'Incheon',
    major: 'Engineering',
    ranking: 6,
    type: 'Private',
    heroImage: 'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?w=1400',
    featuredTag: 'Industry Link',
    summary: 'Known for aerospace and logistics with strong industry partnerships.',
    programs: ['Aerospace Engineering', 'Logistics', 'Marine Engineering'],
    scholarships: ['Inha Global Merit', 'Industry Partner Grant'],
    tuitionRange: '$4,400 - $6,700 / semester',
    mapLabel: 'Direct airport rail access and logistics hubs',
  },
  {
    id: 'dgist',
    name: 'DGIST',
    location: 'Dalseong-gun, Daegu',
    region: 'Daegu',
    major: 'Computer Science',
    ranking: 7,
    type: 'Public',
    heroImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400',
    featuredTag: 'Research First',
    summary: 'Interdisciplinary graduate-focused institute with small cohorts.',
    programs: ['Robotics', 'Brain Science', 'Information Science'],
    scholarships: ['DGIST Fellowship', 'Lab Scholarship'],
    tuitionRange: '$3,900 - $5,600 / semester',
    mapLabel: 'Tech district with shuttle connections',
  },
  {
    id: 'hanyang',
    name: 'Hanyang University',
    location: 'Seongdong-gu, Seoul',
    region: 'Seoul',
    major: 'Design',
    ranking: 8,
    type: 'Private',
    heroImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400',
    featuredTag: 'Creative Tech',
    summary: 'Strong blend of engineering and design with startup acceleration.',
    programs: ['Industrial Design', 'Architecture', 'Software'],
    scholarships: ['Hanyang Vision Scholarship', 'Start-up Incentive'],
    tuitionRange: '$4,800 - $7,100 / semester',
    mapLabel: 'Central Seoul, walkable from key transit stations',
  },
];

let posts: CommunityPost[] = [
  {
    id: 'p1',
    category: 'TOPIK',
    author: 'Minh Hoang',
    title: 'TOPIK level 3 plan that actually worked',
    body: 'Week-by-week structure with listening + grammar drills and 3 mock tests.',
    likes: 34,
    commentsCount: 2,
    createdAt: '2026-02-24T09:00:00.000Z',
  },
  {
    id: 'p2',
    category: 'Visa',
    author: 'Linh Nguyen',
    title: 'Student visa extension checklist in Seoul',
    body: 'I listed the required docs and where delays happened in my renewal process.',
    mediaUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900',
    likes: 27,
    commentsCount: 1,
    createdAt: '2026-02-25T12:20:00.000Z',
  },
  {
    id: 'p3',
    category: 'University Life',
    author: 'Anh Tu',
    title: 'Affordable lunch map near campus stations',
    body: 'Shared low-cost places under 7,000 KRW in student-heavy neighborhoods.',
    likes: 45,
    commentsCount: 3,
    createdAt: '2026-02-26T08:30:00.000Z',
  },
  {
    id: 'p4',
    category: 'Housing',
    author: 'Hana Pham',
    title: 'Goshiwon vs shared house tradeoffs',
    body: 'How I compared commute cost, deposit, and contract flexibility.',
    likes: 12,
    commentsCount: 0,
    createdAt: '2026-02-27T16:40:00.000Z',
  },
  {
    id: 'p5',
    category: 'Jobs',
    author: 'Duy Tran',
    title: 'Part-time permit timeline for D-2',
    body: 'End-to-end timeline from school approval to immigration confirmation.',
    likes: 19,
    commentsCount: 2,
    createdAt: '2026-02-28T11:10:00.000Z',
  },
  {
    id: 'p6',
    category: 'TOPIK',
    author: 'Yen Le',
    title: 'Free listening resources with difficulty tags',
    body: 'Categorized by level and topic so you can build quick daily practice.',
    likes: 22,
    commentsCount: 1,
    createdAt: '2026-03-01T07:40:00.000Z',
  },
];

const commentsByPostId: Record<string, Comment[]> = {
  p1: [
    {
      id: 'c1',
      postId: 'p1',
      author: 'Hai',
      body: 'This schedule is clear. Thanks for sharing.',
      createdAt: '2026-02-24T13:30:00.000Z',
    },
    {
      id: 'c2',
      postId: 'p1',
      author: 'Jisoo',
      body: 'Can you share the mock test links?',
      createdAt: '2026-02-24T14:10:00.000Z',
    },
  ],
  p2: [
    {
      id: 'c3',
      postId: 'p2',
      author: 'Trung',
      body: 'Very helpful checklist.',
      createdAt: '2026-02-25T14:21:00.000Z',
    },
  ],
  p3: [
    {
      id: 'c4',
      postId: 'p3',
      author: 'Nari',
      body: 'Saved this for next semester.',
      createdAt: '2026-02-26T11:12:00.000Z',
    },
    {
      id: 'c5',
      postId: 'p3',
      author: 'Quan',
      body: 'Can you add halal options too?',
      createdAt: '2026-02-26T12:05:00.000Z',
    },
    {
      id: 'c6',
      postId: 'p3',
      author: 'Mina',
      body: 'This is gold.',
      createdAt: '2026-02-26T13:44:00.000Z',
    },
  ],
  p4: [],
  p5: [
    {
      id: 'c7',
      postId: 'p5',
      author: 'Binh',
      body: 'How long did school paperwork take?',
      createdAt: '2026-02-28T16:55:00.000Z',
    },
    {
      id: 'c8',
      postId: 'p5',
      author: 'Lena',
      body: 'This matches what my office told me.',
      createdAt: '2026-02-28T17:20:00.000Z',
    },
  ],
  p6: [
    {
      id: 'c9',
      postId: 'p6',
      author: 'Somi',
      body: 'Perfect resource list.',
      createdAt: '2026-03-01T10:15:00.000Z',
    },
  ],
};

let userProfile: UserProfile = {
  id: 'user-vk-001',
  name: 'Nguyen Van A',
  city: 'Seoul',
  verified: true,
  bio: 'Student building a plan for study and life in Korea.',
  language: 'mixed',
  stats: {
    posts: 109,
    comments: 456,
    saved: 24,
  },
};

const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Scholarship update',
    body: 'KAIST merit scholarship criteria updated this week.',
    createdAt: '2026-03-04T06:00:00.000Z',
    read: false,
  },
  {
    id: 'n2',
    title: 'New comment on your post',
    body: 'Hai replied to your TOPIK strategy post.',
    createdAt: '2026-03-03T08:14:00.000Z',
    read: true,
  },
  {
    id: 'n3',
    title: 'Application deadline reminder',
    body: 'Yonsei spring intake closes in 10 days.',
    createdAt: '2026-03-01T09:30:00.000Z',
    read: true,
  },
];

function delay(ms = 220) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function shouldSimulateError(query: string) {
  return query.trim().toLowerCase() === 'error';
}

export function getRegionOptions() {
  return ['All', ...regionOptions] as RegionFilter[];
}

export function getMajorOptions() {
  return ['All', ...majorOptions] as MajorFilter[];
}

export async function getUniversities(
  filters: UniversityFilters,
  page = 1,
  pageSize = 6,
): Promise<UniversityListResponse> {
  await delay();

  if (shouldSimulateError(filters.query)) {
    throw new ApiError('Unable to load universities. Please retry.');
  }

  const query = filters.query.trim().toLowerCase();

  const filtered = universitySeed.filter((university) => {
    const queryMatch =
      query.length === 0 ||
      university.name.toLowerCase().includes(query) ||
      university.location.toLowerCase().includes(query) ||
      university.major.toLowerCase().includes(query);

    const regionMatch = filters.region === 'All' || university.region === filters.region;
    const majorMatch = filters.major === 'All' || university.major === filters.major;

    return queryMatch && regionMatch && majorMatch;
  });

  const sorted = [...filtered].sort((a, b) => a.ranking - b.ranking);
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize).map(toSummary);

  logInfo('api_get_universities', {
    endpoint: 'GET /universities',
    query: filters.query,
    region: filters.region,
    major: filters.major,
    page,
    pageSize,
  });

  return {
    items,
    featured: sorted.slice(0, 3).map(toSummary),
    page,
    pageSize,
    total: sorted.length,
    hasNext: start + pageSize < sorted.length,
  };
}

export async function getUniversityById(id: string): Promise<UniversityDetail> {
  await delay();

  const university = universitySeed.find((item) => item.id === id);
  if (!university) {
    throw new ApiError('University not found.');
  }

  logInfo('api_get_university', {
    endpoint: 'GET /universities/:id',
    id,
  });

  return university;
}

export async function getPosts(
  category: CommunityPost['category'] | 'All Posts',
  page = 1,
  pageSize = 5,
) {
  await delay();

  const filtered =
    category === 'All Posts' ? posts : posts.filter((post) => post.category === category);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  logInfo('api_get_posts', {
    endpoint: 'GET /posts',
    category,
    page,
    pageSize,
  });

  return {
    items,
    page,
    pageSize,
    total: sorted.length,
    hasNext: start + pageSize < sorted.length,
  };
}

export async function getPostById(postId: string): Promise<PostDetailResponse> {
  await delay();

  const post = posts.find((item) => item.id === postId);
  if (!post) {
    throw new ApiError('Post not found.');
  }

  return {
    post,
    comments: commentsByPostId[postId] ?? [],
  };
}

export async function submitComment(postId: string, body: string): Promise<Comment> {
  await delay(180);

  const post = posts.find((item) => item.id === postId);
  if (!post) {
    throw new ApiError('Unable to submit comment. Post missing.');
  }

  const comment: Comment = {
    id: `c-${Date.now()}`,
    postId,
    author: 'You',
    body,
    createdAt: new Date().toISOString(),
  };

  const existing = commentsByPostId[postId] ?? [];
  commentsByPostId[postId] = [...existing, comment];

  posts = posts.map((item) =>
    item.id === postId ? { ...item, commentsCount: item.commentsCount + 1 } : item,
  );

  logInfo('api_submit_comment', {
    endpoint: 'POST /posts/:id/comments',
    postId,
  });

  return comment;
}

export async function createPost(input: {
  title: string;
  body: string;
  category: CommunityPost['category'];
}) {
  await delay(180);

  const newPost: CommunityPost = {
    id: `p-${Date.now()}`,
    title: input.title,
    body: input.body,
    category: input.category,
    author: 'You',
    commentsCount: 0,
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  posts = [newPost, ...posts];
  commentsByPostId[newPost.id] = [];

  return newPost;
}

export async function getMe(): Promise<UserProfile> {
  await delay(140);
  logInfo('api_get_me', {
    endpoint: 'GET /me',
  });
  return userProfile;
}

export async function patchMe(update: Partial<UserProfile>): Promise<UserProfile> {
  await delay(180);
  userProfile = {
    ...userProfile,
    ...update,
    stats: {
      ...userProfile.stats,
      ...(update.stats ?? {}),
    },
  };

  logInfo('api_patch_me', {
    endpoint: 'PATCH /me',
    keys: Object.keys(update),
  });

  return userProfile;
}

export async function getNotifications(): Promise<NotificationItem[]> {
  await delay(120);
  return notifications;
}

function toSummary(detail: UniversityDetail): UniversitySummary {
  const { summary, programs, scholarships, tuitionRange, mapLabel, ...summaryFields } = detail;
  void summary;
  void programs;
  void scholarships;
  void tuitionRange;
  void mapLabel;
  return summaryFields;
}
