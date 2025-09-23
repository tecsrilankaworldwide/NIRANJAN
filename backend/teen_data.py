from teen_models import *
from teen_database import TeenDatabaseManager
import asyncio

# Sample Teen Course Data
TEEN_SAMPLE_COURSES = {
    TeenAgeLevel.MIDDLE_TEEN: [
        {
            "title": "Python Programming Fundamentals",
            "description": "Master the basics of Python programming with hands-on projects and real-world applications. Build games, web scrapers, and automation tools.",
            "category": TeenCourseCategory.CODING,
            "age_level": TeenAgeLevel.MIDDLE_TEEN,
            "difficulty": TeenDifficultyLevel.INTERMEDIATE,
            "duration_weeks": 8,
            "hours_per_week": 3,
            "total_modules": 12,
            "instructor": "Dr. Kasun Rajapaksa",
            "instructor_bio": "Senior Software Engineer at Google with 10+ years experience in Python development",
            "prerequisites": ["Basic computer skills", "Problem-solving mindset"],
            "learning_outcomes": [
                "Write clean, efficient Python code",
                "Build desktop applications with GUI",
                "Create web scrapers and automation scripts",
                "Understand object-oriented programming",
                "Debug and test Python programs"
            ],
            "tools_required": ["Python 3.9+", "VS Code", "Git"],
            "color_gradient": "from-blue-600 to-cyan-600",
            "price_lkr": 12500.00,
            "certification_available": True,
            "portfolio_project": True
        },
        {
            "title": "Introduction to Robotics & Arduino",
            "description": "Build and program robots using Arduino microcontrollers. Learn electronics, sensors, and mechanical design principles.",
            "category": TeenCourseCategory.ROBOTICS,
            "age_level": TeenAgeLevel.MIDDLE_TEEN,
            "difficulty": TeenDifficultyLevel.INTERMEDIATE,
            "duration_weeks": 10,
            "hours_per_week": 4,
            "total_modules": 15,
            "instructor": "Eng. Priya Wijesinghe",
            "instructor_bio": "Robotics Engineer and former Tesla intern with expertise in autonomous systems",
            "prerequisites": ["Basic math skills", "Interest in engineering"],
            "learning_outcomes": [
                "Build functional robots from scratch",
                "Program Arduino microcontrollers",
                "Understand sensors and actuators",
                "Design mechanical systems",
                "Implement basic AI algorithms"
            ],
            "tools_required": ["Arduino Uno Kit", "Sensors Pack", "Building Materials"],
            "color_gradient": "from-green-600 to-teal-600",
            "price_lkr": 18500.00,
            "certification_available": True,
            "portfolio_project": True
        },
        {
            "title": "Mobile App Development with Flutter",
            "description": "Create stunning mobile apps for iOS and Android using Flutter framework. Build real apps and publish to app stores.",
            "category": TeenCourseCategory.APP_DEV,
            "age_level": TeenAgeLevel.MIDDLE_TEEN,
            "difficulty": TeenDifficultyLevel.ADVANCED,
            "duration_weeks": 12,
            "hours_per_week": 4,
            "total_modules": 18,
            "instructor": "Sarah Mohamed",
            "instructor_bio": "Lead Mobile Developer at Dialog Axiata with 50+ published apps",
            "prerequisites": ["Basic programming knowledge", "Understanding of UI/UX concepts"],
            "learning_outcomes": [
                "Build cross-platform mobile apps",
                "Implement user authentication",
                "Integrate APIs and databases",
                "Design responsive UI/UX",
                "Publish apps to stores"
            ],
            "tools_required": ["Flutter SDK", "Android Studio", "VS Code"],
            "color_gradient": "from-purple-600 to-pink-600",
            "price_lkr": 22000.00,
            "certification_available": True,
            "portfolio_project": True
        },
        {
            "title": "Web Development Bootcamp",
            "description": "Master modern web development with HTML5, CSS3, JavaScript, and React. Build responsive websites and web applications.",
            "category": TeenCourseCategory.WEB_DEV,
            "age_level": TeenAgeLevel.MIDDLE_TEEN,
            "difficulty": TeenDifficultyLevel.INTERMEDIATE,
            "duration_weeks": 14,
            "hours_per_week": 5,
            "total_modules": 20,
            "instructor": "Nuwan Karunaratne",
            "instructor_bio": "Full-Stack Developer at Sysco Labs and React.js community contributor",
            "prerequisites": ["Basic computer literacy", "Creative thinking"],
            "learning_outcomes": [
                "Build responsive websites",
                "Create interactive web applications", 
                "Master React.js framework",
                "Implement backend with Node.js",
                "Deploy applications to cloud"
            ],
            "tools_required": ["VS Code", "Node.js", "Git", "Figma"],
            "color_gradient": "from-orange-600 to-red-600",
            "price_lkr": 25000.00,
            "certification_available": True,
            "portfolio_project": True
        }
    ],
    TeenAgeLevel.HIGH_TEEN: [
        {
            "title": "Advanced AI & Machine Learning",
            "description": "Dive deep into artificial intelligence and machine learning. Build neural networks, computer vision systems, and intelligent applications.",
            "category": TeenCourseCategory.ROBOTICS,
            "age_level": TeenAgeLevel.HIGH_TEEN,
            "difficulty": TeenDifficultyLevel.EXPERT,
            "duration_weeks": 16,
            "hours_per_week": 6,
            "total_modules": 24,
            "instructor": "Prof. Chamith Fonseka",
            "instructor_bio": "AI Research Director at University of Colombo and former Microsoft Research scientist",
            "prerequisites": ["Python programming", "Mathematics (calculus, statistics)", "Linear algebra basics"],
            "learning_outcomes": [
                "Build neural networks from scratch",
                "Implement computer vision systems",
                "Create natural language processing models",
                "Deploy ML models to production",
                "Conduct AI research projects"
            ],
            "tools_required": ["Python", "TensorFlow", "PyTorch", "Jupyter Notebooks", "GPU access"],
            "color_gradient": "from-indigo-600 to-purple-700",
            "price_lkr": 35000.00,
            "certification_available": True,
            "portfolio_project": True
        },
        {
            "title": "Cybersecurity & Ethical Hacking",
            "description": "Learn to protect digital systems and conduct ethical security assessments. Master penetration testing and security analysis.",
            "category": TeenCourseCategory.CYBERSECURITY,
            "age_level": TeenAgeLevel.HIGH_TEEN,
            "difficulty": TeenDifficultyLevel.ADVANCED,
            "duration_weeks": 12,
            "hours_per_week": 5,
            "total_modules": 16,
            "instructor": "Lakmal Silva",
            "instructor_bio": "Certified Ethical Hacker (CEH) and Security Consultant for major banks in Sri Lanka",
            "prerequisites": ["Network fundamentals", "Linux basics", "Programming knowledge"],
            "learning_outcomes": [
                "Conduct security assessments",
                "Perform penetration testing",
                "Analyze malware and threats",
                "Implement security protocols",
                "Understand legal and ethical aspects"
            ],
            "tools_required": ["Kali Linux", "Virtual Machines", "Security Tools"],
            "color_gradient": "from-gray-700 to-red-700",
            "price_lkr": 28000.00,
            "certification_available": True,
            "portfolio_project": True
        },
        {
            "title": "Data Science & Analytics",
            "description": "Master data analysis, visualization, and predictive modeling. Work with real datasets to solve business problems.",
            "category": TeenCourseCategory.DATA_SCIENCE,
            "age_level": TeenAgeLevel.HIGH_TEEN,
            "difficulty": TeenDifficultyLevel.ADVANCED,
            "duration_weeks": 14,
            "hours_per_week": 5,
            "total_modules": 18,
            "instructor": "Dr. Amali Perera",
            "instructor_bio": "Data Scientist at WSO2 and PhD in Statistics from University of Peradeniya",
            "prerequisites": ["Python/R programming", "Statistics basics", "Mathematics"],
            "learning_outcomes": [
                "Analyze large datasets",
                "Create interactive visualizations",
                "Build predictive models",
                "Implement machine learning algorithms",
                "Present data-driven insights"
            ],
            "tools_required": ["Python", "R", "SQL", "Tableau", "Jupyter"],
            "color_gradient": "from-emerald-600 to-blue-600",
            "price_lkr": 30000.00,
            "certification_available": True,
            "portfolio_project": True
        },
        {
            "title": "Game Development with Unity",
            "description": "Create immersive 2D and 3D games using Unity engine. Learn game design, physics, animation, and monetization strategies.",
            "category": TeenCourseCategory.GAME_DEV,
            "age_level": TeenAgeLevel.HIGH_TEEN,
            "difficulty": TeenDifficultyLevel.ADVANCED,
            "duration_weeks": 16,
            "hours_per_week": 6,
            "total_modules": 22,
            "instructor": "Ravindu Wickramasinghe",
            "instructor_bio": "Independent game developer with 5+ published games and Unity certified instructor",
            "prerequisites": ["C# programming basics", "3D math understanding", "Creative design skills"],
            "learning_outcomes": [
                "Develop 2D and 3D games",
                "Master Unity engine features",
                "Implement game physics and AI",
                "Create game art and animations",
                "Publish games to platforms"
            ],
            "tools_required": ["Unity Hub", "Visual Studio", "Blender", "Graphics Tablet"],
            "color_gradient": "from-purple-700 to-indigo-700",
            "price_lkr": 32000.00,
            "certification_available": True,
            "portfolio_project": True
        },
        {
            "title": "Digital Entrepreneurship & Startup",
            "description": "Learn to build and launch tech startups. Master business planning, marketing, funding, and scaling strategies.",
            "category": TeenCourseCategory.ENTREPRENEURSHIP,
            "age_level": TeenAgeLevel.HIGH_TEEN,
            "difficulty": TeenDifficultyLevel.INTERMEDIATE,
            "duration_weeks": 10,
            "hours_per_week": 4,
            "total_modules": 14,
            "instructor": "Janith Bandara",
            "instructor_bio": "Serial entrepreneur, founded 3 successful startups, and startup mentor",
            "prerequisites": ["Business mindset", "Basic technology understanding", "Communication skills"],
            "learning_outcomes": [
                "Develop business plans",
                "Create MVP products",
                "Master digital marketing",
                "Understand startup funding",
                "Build and lead teams"
            ],
            "tools_required": ["Laptop", "Design Software", "Market Research Tools"],
            "color_gradient": "from-yellow-600 to-orange-600",
            "price_lkr": 20000.00,
            "certification_available": True,
            "portfolio_project": True
        },
        {
            "title": "University Preparation & Career Planning",
            "description": "Prepare for international university admissions and career planning. Master SAT prep, portfolio building, and interview skills.",
            "category": TeenCourseCategory.CAREER_PREP,
            "age_level": TeenAgeLevel.HIGH_TEEN,
            "difficulty": TeenDifficultyLevel.INTERMEDIATE,
            "duration_weeks": 8,
            "hours_per_week": 3,
            "total_modules": 12,
            "instructor": "Tharushi Fernando",
            "instructor_bio": "Education Consultant, Harvard alumna, and university admissions expert",
            "prerequisites": ["High school level academics", "Career curiosity", "Goal-oriented mindset"],
            "learning_outcomes": [
                "Prepare for standardized tests",
                "Build compelling portfolios",
                "Master interview techniques",
                "Understand university systems",
                "Plan career pathways"
            ],
            "tools_required": ["Study Materials", "Portfolio Platform", "Interview Setup"],
            "color_gradient": "from-teal-600 to-cyan-600",
            "price_lkr": 15000.00,
            "certification_available": True,
            "portfolio_project": False
        }
    ]
}

# Sample Coding Challenges
TEEN_CODING_CHALLENGES = [
    {
        "title": "Two Sum Problem",
        "description": "Find two numbers in an array that add up to a target sum",
        "category": TeenCourseCategory.CODING,
        "difficulty": TeenDifficultyLevel.INTERMEDIATE,
        "problem_statement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "input_format": "First line contains array size n, second line contains n integers, third line contains target",
        "output_format": "Two integers representing indices of the numbers",
        "sample_inputs": ["5\n2 7 11 15 9\n9", "4\n3 2 4 6\n6"],
        "expected_outputs": ["0 1", "1 2"],
        "test_cases": [
            {"input": "5\n2 7 11 15 9\n9", "output": "0 1"},
            {"input": "4\n3 2 4 6\n6", "output": "1 2"},
            {"input": "3\n1 2 3\n5", "output": "1 2"}
        ],
        "time_limit_minutes": 30,
        "programming_languages": ["Python", "Java", "C++", "JavaScript"],
        "points": 100
    },
    {
        "title": "Fibonacci Sequence Generator",
        "description": "Generate the nth number in the Fibonacci sequence efficiently",
        "category": TeenCourseCategory.CODING,
        "difficulty": TeenDifficultyLevel.INTERMEDIATE,
        "problem_statement": "Write a program to find the nth Fibonacci number. The Fibonacci sequence starts with 0, 1, and each subsequent number is the sum of the previous two.",
        "input_format": "A single integer n (1 <= n <= 50)",
        "output_format": "The nth Fibonacci number",
        "sample_inputs": ["10", "1", "15"],
        "expected_outputs": ["55", "1", "610"],
        "test_cases": [
            {"input": "10", "output": "55"},
            {"input": "1", "output": "1"},
            {"input": "15", "output": "610"}
        ],
        "time_limit_minutes": 25,
        "programming_languages": ["Python", "Java", "C++", "JavaScript"],
        "points": 80
    },
    {
        "title": "Binary Search Implementation",
        "description": "Implement binary search algorithm for a sorted array",
        "category": TeenCourseCategory.CODING,
        "difficulty": TeenDifficultyLevel.ADVANCED,
        "problem_statement": "Implement binary search to find the index of a target element in a sorted array. Return -1 if element is not found.",
        "input_format": "First line: array size n, Second line: n sorted integers, Third line: target element",
        "output_format": "Index of target element or -1 if not found",
        "sample_inputs": ["6\n1 3 5 7 9 11\n7", "5\n2 4 6 8 10\n5"],
        "expected_outputs": ["3", "-1"],
        "test_cases": [
            {"input": "6\n1 3 5 7 9 11\n7", "output": "3"},
            {"input": "5\n2 4 6 8 10\n5", "output": "-1"},
            {"input": "4\n1 2 3 4\n1", "output": "0"}
        ],
        "time_limit_minutes": 40,
        "programming_languages": ["Python", "Java", "C++", "JavaScript"],
        "points": 150
    }
]

# Sample Mentors
TEEN_SAMPLE_MENTORS = [
    {
        "name": "Supun Dissanayake",
        "title": "Senior Software Engineer",
        "company": "Google",
        "expertise_areas": ["Python", "Machine Learning", "System Design", "Career Guidance"],
        "bio": "Senior SWE at Google with 8 years experience. Passionate about mentoring young developers and AI enthusiasts.",
        "years_experience": 8,
        "rating": 4.9,
        "total_sessions": 156,
        "available_slots": ["Saturday 10:00 AM", "Sunday 2:00 PM", "Wednesday 7:00 PM"]
    },
    {
        "name": "Malsha Rathnayake",
        "title": "Product Manager",
        "company": "Meta",
        "expertise_areas": ["Product Strategy", "User Experience", "Leadership", "Entrepreneurship"],
        "bio": "PM at Meta leading AR/VR products. Former startup founder with successful exit. Love helping teens build products.",
        "years_experience": 6,
        "rating": 4.8,
        "total_sessions": 89,
        "available_slots": ["Friday 6:00 PM", "Saturday 11:00 AM", "Sunday 4:00 PM"]
    },
    {
        "name": "Dinesh Chandimal",
        "title": "Cybersecurity Architect",
        "company": "Deloitte",
        "expertise_areas": ["Cybersecurity", "Ethical Hacking", "Risk Management", "Technology Leadership"],
        "bio": "Cybersecurity expert with 12 years experience protecting enterprise systems. CEH certified trainer.",
        "years_experience": 12,
        "rating": 4.9,
        "total_sessions": 203,
        "available_slots": ["Thursday 8:00 PM", "Saturday 9:00 AM", "Sunday 1:00 PM"]
    }
]

# Career Paths
TEEN_CAREER_PATHS = [
    {
        "title": "Full-Stack Developer",
        "description": "Master both frontend and backend development to build complete web applications",
        "categories": [TeenCourseCategory.WEB_DEV, TeenCourseCategory.CODING],
        "required_courses": ["Python Programming Fundamentals", "Web Development Bootcamp"],
        "optional_courses": ["Mobile App Development with Flutter", "Data Science & Analytics"],
        "estimated_duration_months": 8,
        "career_outcomes": [
            "Web Developer at tech companies",
            "Freelance developer",
            "Startup co-founder",
            "Software consultant"
        ],
        "salary_range_lkr": {"entry": 80000, "mid": 200000, "senior": 400000},
        "job_opportunities": [
            "Junior Web Developer",
            "Frontend Developer", 
            "Backend Developer",
            "Full-Stack Engineer"
        ],
        "success_stories": [
            {"name": "Kamal Silva", "age": 17, "achievement": "Hired as Junior Developer at Sysco Labs"},
            {"name": "Nimal Perera", "age": 16, "achievement": "Built freelance business earning LKR 100k/month"}
        ]
    },
    {
        "title": "AI/ML Engineer",
        "description": "Specialize in artificial intelligence and machine learning to build intelligent systems",
        "categories": [TeenCourseCategory.ROBOTICS, TeenCourseCategory.DATA_SCIENCE],
        "required_courses": ["Python Programming Fundamentals", "Advanced AI & Machine Learning", "Data Science & Analytics"],
        "optional_courses": ["Cybersecurity & Ethical Hacking"],
        "estimated_duration_months": 12,
        "career_outcomes": [
            "ML Engineer at tech giants",
            "AI Research Scientist",
            "Data Scientist",
            "AI Startup founder"
        ],
        "salary_range_lkr": {"entry": 120000, "mid": 300000, "senior": 600000},
        "job_opportunities": [
            "Junior ML Engineer",
            "Data Analyst",
            "AI Researcher",
            "Computer Vision Engineer"
        ],
        "success_stories": [
            {"name": "Anura Fernando", "age": 17, "achievement": "Accepted to Stanford AI program"},
            {"name": "Priya Jayawardena", "age": 16, "achievement": "Won National AI Innovation Award"}
        ]
    }
]

async def populate_teen_sample_data():
    """Populate the database with sample teen courses, challenges, and mentors."""
    
    # Create teen courses
    for age_level, courses in TEEN_SAMPLE_COURSES.items():
        for course_data in courses:
            course_create = TeenCourseCreate(**course_data)
            course = await TeenDatabaseManager.create_teen_course(course_create)
            print(f"Created teen course: {course.title} for {age_level}")
    
    # Create coding challenges
    for challenge_data in TEEN_CODING_CHALLENGES:
        challenge = await TeenDatabaseManager.create_coding_challenge(challenge_data)
        print(f"Created coding challenge: {challenge.title}")
    
    # Create mentors
    for mentor_data in TEEN_SAMPLE_MENTORS:
        mentor = await TeenDatabaseManager.create_mentor(mentor_data)
        print(f"Created mentor: {mentor.name}")
    
    print("Teen sample data populated successfully!")

if __name__ == "__main__":
    asyncio.run(populate_teen_sample_data())