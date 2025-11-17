import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Trophy,
  Calendar,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  Target,
  Zap,
  Star
} from 'lucide-react';
import { useNotifications } from '../../lib/notification-context';

interface NutriWellCommunityProps {
  onNavigate: (path: string) => void;
}

export const NutriWellCommunity: React.FC<NutriWellCommunityProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });

  const communityStats = {
    members: 15420,
    activeToday: 2340,
    challenges: 45,
    posts: 12890
  };

  const categories = [
    { id: 'all', name: 'All Posts', icon: MessageCircle },
    { id: 'success', name: 'Success Stories', icon: Trophy },
    { id: 'challenges', name: 'Challenges', icon: Target },
    { id: 'recipes', name: 'Recipes', icon: Heart },
    { id: 'tips', name: 'Tips & Advice', icon: Zap },
    { id: 'questions', name: 'Questions', icon: MessageCircle }
  ];

  const posts = [
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        badge: 'Weight Loss Champion'
      },
      title: 'Lost 15kg in 3 months with NutriWell!',
      content: 'Just wanted to share my journey. Started with the premium plan and the personalized meal suggestions really made the difference. The community support here is amazing!',
      category: 'success',
      likes: 234,
      comments: 45,
      timeAgo: '2 hours ago',
      tags: ['weight-loss', 'success-story', 'premium-plan'],
      images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop']
    },
    {
      id: 2,
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        badge: 'Fitness Enthusiast'
      },
      title: 'Weekly Meal Prep Challenge - Day 3',
      content: 'Today\'s prep: Grilled chicken salad bowls with quinoa and roasted vegetables. Anyone else joining the meal prep challenge?',
      category: 'challenges',
      likes: 89,
      comments: 23,
      timeAgo: '4 hours ago',
      tags: ['meal-prep', 'challenge', 'healthy-eating'],
      images: []
    },
    {
      id: 3,
      author: {
        name: 'Dr. Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
        badge: 'Nutrition Expert'
      },
      title: 'Quick Tip: Boost Your Metabolism',
      content: 'Did you know that drinking cold water can actually boost your metabolism? Try drinking 2-3 glasses of cold water throughout the day. Combined with regular exercise and balanced meals, this can help accelerate your weight loss journey.',
      category: 'tips',
      likes: 156,
      comments: 34,
      timeAgo: '6 hours ago',
      tags: ['metabolism', 'weight-loss', 'tips'],
      images: []
    }
  ];

  const challenges = [
    {
      id: 1,
      title: '30-Day Hydration Challenge',
      description: 'Drink at least 8 glasses of water daily',
      participants: 1240,
      daysLeft: 12,
      difficulty: 'Easy',
      icon: '💧'
    },
    {
      id: 2,
      title: 'Meal Prep Mastery',
      description: 'Prepare healthy meals for the entire week',
      participants: 856,
      daysLeft: 5,
      difficulty: 'Medium',
      icon: '🥗'
    },
    {
      id: 3,
      title: 'Sugar-Free Month',
      description: 'Eliminate added sugars from your diet',
      participants: 642,
      daysLeft: 18,
      difficulty: 'Hard',
      icon: '🚫🍬'
    }
  ];

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      // Here you would typically send the post to your backend
      console.log('Creating post:', newPost);
      addNotification({
        type: 'success',
        title: 'Post Created',
        message: 'Your post has been shared with the community!',
        unread: true
      });
      setShowCreatePost(false);
      setNewPost({ title: '', content: '', category: 'general' });
    }
  };

  const handleJoinChallenge = (challengeId: number) => {
    addNotification({
      type: 'success',
