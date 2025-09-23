// Mock data for TecaiKids application
// This file contains all the sample data used throughout the application

export const mockCourses = [
  {
    id: 1,
    title: "Math Adventures",
    description: "Fun math games and puzzles that make numbers exciting for young learners.",
    category: "Math",
    age: "5-8 years",
    duration: "30 mins",
    students: 1250,
    rating: 4.9,
    price: "Free",
    image: "🔢",
    color: "from-blue-400 to-blue-600",
    lessons: 25,
    level: "Beginner",
    skills: ["Addition", "Subtraction", "Number Recognition", "Problem Solving"],
    instructor: "Ms. Sarah Johnson",
    lastUpdated: "2024-01-15",
    featured: true
  },
  {
    id: 2,
    title: "Science Explorers",
    description: "Discover the wonders of science through interactive experiments and activities.",
    category: "Science",
    age: "6-10 years",
    duration: "45 mins",
    students: 980,
    rating: 4.8,
    price: "Free",
    image: "🔬",
    color: "from-green-400 to-green-600",
    lessons: 30,
    level: "Intermediate",
    skills: ["Scientific Method", "Observation", "Experimentation", "Critical Thinking"],
    instructor: "Dr. Mike Chen",
    lastUpdated: "2024-01-10",
    featured: true
  },
  {
    id: 3,
    title: "Creative Writing Workshop",
    description: "Unleash imagination with storytelling, poetry, and creative writing exercises.",
    category: "English",
    age: "7-12 years",
    duration: "40 mins",
    students: 750,
    rating: 4.9,
    price: "Free",
    image: "✍️",
    color: "from-purple-400 to-purple-600",
    lessons: 20,
    level: "Intermediate",
    skills: ["Storytelling", "Grammar", "Vocabulary", "Creative Expression"],
    instructor: "Mrs. Emily Rodriguez",
    lastUpdated: "2024-01-12",
    featured: true
  }
];

export const mockActivities = [
  {
    id: 1,
    title: "Number Rocket Adventure",
    description: "Help the rocket reach space by solving addition and subtraction problems!",
    type: "Games",
    age: "5-8 years",
    duration: "10-15 mins",
    difficulty: "Easy",
    rating: 4.9,
    plays: 2850,
    image: "🚀",
    color: "from-blue-400 to-blue-600",
    skills: ["Addition", "Subtraction", "Problem Solving"],
    category: "Math"
  },
  {
    id: 2,
    title: "Animal Memory Match",
    description: "Improve memory skills by matching adorable animal pairs in this fun game.",
    type: "Puzzles",
    age: "4-7 years",
    duration: "5-10 mins",
    difficulty: "Easy",
    rating: 4.7,
    plays: 1920,
    image: "🐾",
    color: "from-green-400 to-green-600",
    skills: ["Memory", "Concentration", "Pattern Recognition"],
    category: "Cognitive"
  },
  {
    id: 3,
    title: "Science Lab Explorer",
    description: "Conduct virtual experiments and discover amazing scientific phenomena!",
    type: "Science",
    age: "7-11 years",
    duration: "15-20 mins",
    difficulty: "Medium",
    rating: 4.8,
    plays: 1650,
    image: "⚗️",
    color: "from-purple-400 to-purple-600",
    skills: ["Scientific Method", "Observation", "Critical Thinking"],
    category: "Science"
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Parent of 2 children",
    age: "Kids: 7 & 9 years",
    rating: 5,
    text: "TecaiKids has transformed how my children approach learning. They actually look forward to their daily lessons now! The interactive games make math and science so much fun.",
    avatar: "👩‍💼",
    highlight: "Improved Math Skills by 40%",
    location: "California, USA",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Elementary Teacher",
    age: "Teaching Grade 3",
    rating: 5,
    text: "As an educator, I'm impressed by the quality of content and the adaptive learning technology. My students' engagement levels have increased dramatically since we started using TecaiKids.",
    avatar: "👨‍🏫",
    highlight: "Used by 500+ Students",
    location: "New York, USA",
    date: "2024-01-10"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Homeschool Mom",
    age: "3 kids at home",
    rating: 5,
    text: "The progress tracking and personalized learning paths are incredible. Each of my children learns at their own pace, and I can monitor their development easily.",
    avatar: "👩‍🎓",
    highlight: "Homeschooling Success",
    location: "Texas, USA",
    date: "2024-01-08"
  }
];

export const mockStats = {
  students: 15000,
  courses: 500,
  activities: 200,
  countries: 45,
  teachers: 1200,
  completion_rate: 92,
  satisfaction: 4.8,
  awards: 15
};

export const mockTeamMembers = [
  {
    id: 1,
    name: "Dr. Sarah Martinez",
    role: "Chief Education Officer",
    description: "Former Stanford educator with 15+ years in child development",
    avatar: "👩‍🎓",
    expertise: ["Child Psychology", "Curriculum Design", "Educational Technology"],
    education: "PhD in Educational Psychology, Stanford University"
  },
  {
    id: 2,
    name: "Alex Johnson",
    role: "Head of Product",
    description: "Ex-Google product manager specializing in educational technology",
    avatar: "👨‍💻",
    expertise: ["Product Strategy", "User Experience", "Technology Integration"],
    education: "MS Computer Science, MIT"
  },
  {
    id: 3,
    name: "Maria Chen",
    role: "Child Psychologist",
    description: "Specialist in cognitive development and learning assessment",
    avatar: "👩‍⚕️",
    expertise: ["Cognitive Development", "Learning Assessment", "Child Behavior"],
    education: "PhD in Child Psychology, UCLA"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Creative Director",
    description: "Award-winning designer creating engaging visual experiences",
    avatar: "👨‍🎨",
    expertise: ["Visual Design", "Animation", "User Interface"],
    education: "MFA in Design, Art Center College of Design"
  }
];

export const mockFAQ = [
  {
    id: 1,
    question: "Is TecaiKids safe for children?",
    answer: "Yes! We follow strict COPPA compliance guidelines and have comprehensive safety measures in place to protect children's privacy and ensure age-appropriate content.",
    category: "Safety"
  },
  {
    id: 2,
    question: "What ages is TecaiKids suitable for?",
    answer: "TecaiKids is designed for children ages 4-12, with content specifically tailored to different age groups and learning levels.",
    category: "General"
  },
  {
    id: 3,
    question: "Do you offer a free trial?",
    answer: "Yes! We offer a 14-day free trial with full access to our premium features. No credit card required to start.",
    category: "Billing"
  },
  {
    id: 4,
    question: "Can parents track their child's progress?",
    answer: "Absolutely! Our parent dashboard provides detailed progress reports, learning analytics, and personalized recommendations.",
    category: "Features"
  }
];

export const mockUserProgress = {
  totalLessonsCompleted: 45,
  totalTimeSpent: "12 hours 30 minutes",
  currentStreak: 7,
  achievementsUnlocked: 23,
  favoriteSubject: "Math",
  weeklyGoal: 5,
  weeklyProgress: 3,
  recentActivities: [
    {
      id: 1,
      title: "Number Rocket Adventure",
      completedAt: "2024-01-20T10:30:00Z",
      score: 95,
      timeSpent: "8 minutes"
    },
    {
      id: 2,
      title: "Animal Memory Match",
      completedAt: "2024-01-20T09:15:00Z",
      score: 87,
      timeSpent: "6 minutes"
    }
  ]
};

export const mockAchievements = [
  {
    id: 1,
    title: "Math Master",
    description: "Complete 10 math activities",
    icon: "🏆",
    unlocked: true,
    unlockedAt: "2024-01-15T14:30:00Z",
    rarity: "Common"
  },
  {
    id: 2,
    title: "Science Explorer",
    description: "Complete your first science experiment",
    icon: "🔬",
    unlocked: true,
    unlockedAt: "2024-01-12T11:20:00Z",
    rarity: "Common"
  },
  {
    id: 3,
    title: "Creative Writer",
    description: "Write and complete 5 creative stories",
    icon: "📝",
    unlocked: false,
    progress: 3,
    total: 5,
    rarity: "Rare"
  }
];

// Helper functions for mock data
export const getMockCourseById = (id) => {
  return mockCourses.find(course => course.id === id);
};

export const getMockCoursesByCategory = (category) => {
  if (category === 'All') return mockCourses;
  return mockCourses.filter(course => course.category === category);
};

export const getMockActivitiesByType = (type) => {
  if (type === 'All') return mockActivities;
  return mockActivities.filter(activity => activity.type === type);
};

export const getMockFeaturedCourses = () => {
  return mockCourses.filter(course => course.featured);
};

export default {
  mockCourses,
  mockActivities,
  mockTestimonials,
  mockStats,
  mockTeamMembers,
  mockFAQ,
  mockUserProgress,
  mockAchievements,
  getMockCourseById,
  getMockCoursesByCategory,
  getMockActivitiesByType,
  getMockFeaturedCourses
};