import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Brain, Code, Gamepad2 } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const features = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Interactive Coding Lessons",
      description: "Learn programming through fun, hands-on activities designed for kids",
      ageGroups: ["5-8", "9-12", "13-16"]
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI & Technology Games",
      description: "Explore artificial intelligence concepts through engaging educational games",
      ageGroups: ["9-12", "13-16"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Parent Dashboard",
      description: "Track your child's progress and achievements in real-time",
      ageGroups: ["Parent"]
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Teacher Tools",
      description: "Create and manage educational content with our comprehensive admin panel",
      ageGroups: ["Teacher"]
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Certificates & Achievements",
      description: "Earn certificates as you complete learning stages and milestones",
      ageGroups: ["All Ages"]
    },
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Gamified Learning",
      description: "Make learning fun with our game-based educational approach",
      ageGroups: ["5-8", "9-12"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6" data-testid="hero-title">
            Welcome to TecAI Kids
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" data-testid="hero-description">
            The ultimate platform for kids to explore technology, coding, and AI through 
            interactive lessons and games. Perfect for ages 5-16!
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate('/register')}
              data-testid="get-started-btn"
            >
              Get Started Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate('/login')}
              data-testid="login-btn"
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="features-title">
              Everything Your Child Needs to Learn Tech
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform offers age-appropriate content, progress tracking, 
              and certification to ensure effective learning.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`feature-card-${index}`}>
                <CardHeader>
                  <div className="text-blue-600 mb-2">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feature.ageGroups.map((group, i) => (
                      <Badge key={i} variant="secondary">{group}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="age-groups-title">
              Learning Paths for Every Age
            </h2>
            <p className="text-xl text-gray-600">
              Carefully designed curricula that grow with your child
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center" data-testid="age-group-early">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">Ages 5-8</CardTitle>
                <CardDescription>Early Elementary</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  <li>• Visual programming basics</li>
                  <li>• Simple logic games</li>
                  <li>• Creative digital art</li>
                  <li>• Story-based learning</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="age-group-late">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Ages 9-12</CardTitle>
                <CardDescription>Late Elementary</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  <li>• Block-based coding</li>
                  <li>• Basic AI concepts</li>
                  <li>• Game development</li>
                  <li>• Problem-solving challenges</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="age-group-teen">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-600">Ages 13-16</CardTitle>
                <CardDescription>Middle & High School</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  <li>• Text-based programming</li>
                  <li>• Advanced AI & ML</li>
                  <li>• Web development</li>
                  <li>• Real-world projects</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6" data-testid="cta-title">
            Ready to Start Your Child's Tech Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of families already using TecAI Kids to prepare their children 
            for the future of technology.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100"
            onClick={() => navigate('/register')}
            data-testid="cta-register-btn"
          >
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
};