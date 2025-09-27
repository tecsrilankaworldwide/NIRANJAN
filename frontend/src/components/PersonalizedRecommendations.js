import React, { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  BookOpen,
  Award,
  RefreshCw,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const PersonalizedRecommendations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState('');
  const [learningStats, setLearningStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/ai-tutor/personalized-recommendations`);
      setRecommendations(response.data.recommendations);
      setLearningStats(response.data.learning_stats);
      setLastUpdated(new Date());
      
      toast({
        title: "Recommendations Updated! ✨",
        description: "Your personalized learning recommendations are ready.",
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Unable to get recommendations",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatRecommendations = (text) => {
    // Split by numbered points and format them nicely
    const points = text.split(/\d+\.\s/).filter(point => point.trim());
    return points;
  };

  if (user?.role !== 'student') {
    return (
      <Alert>
        <AlertDescription>
          Personalized recommendations are available for students only.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full" data-testid="personalized-recommendations">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle>Your Learning Journey</CardTitle>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchRecommendations}
            disabled={loading}
            data-testid="refresh-recommendations"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
        <CardDescription>
          AI-powered personalized recommendations based on your learning progress and interests.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Learning Stats */}
        {learningStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{learningStats.total_courses}</div>
              <div className="text-sm text-blue-800">Courses</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{learningStats.completed_lessons}</div>
              <div className="text-sm text-green-800">Lessons Done</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{learningStats.average_score}%</div>
              <div className="text-sm text-purple-800">Avg Score</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{learningStats.available_courses}</div>
              <div className="text-sm text-orange-800">Available</div>
            </div>
          </div>
        )}
        
        {/* Recommendations */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
              <p className="text-gray-600">Getting your personalized recommendations...</p>
            </div>
          </div>
        ) : recommendations ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Recommendations for {user.first_name}</h3>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {recommendations}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>Personalized for you</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <BookOpen className="h-3 w-3" />
                <span>Age {user.age_group}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Award className="h-3 w-3" />
                <span>AI-Powered</span>
              </Badge>
            </div>
            
            {lastUpdated && (
              <div className="text-xs text-gray-500 mt-2">
                Last updated: {lastUpdated.toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No recommendations yet. Click refresh to get your personalized learning advice!</p>
            <Button onClick={fetchRecommendations} data-testid="get-first-recommendations">
              <Sparkles className="h-4 w-4 mr-2" />
              Get My Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};