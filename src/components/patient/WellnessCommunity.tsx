import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Users, Award, Video, Heart, MessageCircle, Calendar, CheckCircle, Search, Users2, Clock, MapPin, Star } from 'lucide-react';
import { useNotifications } from '../../lib/notification-context';

interface WellnessCommunityProps {
  onNavigate: (path: string) => void;
}

export const WellnessCommunity: React.FC<WellnessCommunityProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinForm, setJoinForm] = useState({
    name: '',
    email: '',
    interests: ''
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [joined, setJoined] = useState(false);

  const interestOptions = [
    'Yoga',
    'Nutrition',
    'Fitness',
    'Mental Health',
    'Weight Loss',
    'Meditation',
    'Healthy Cooking',
    'Sports',
    'Wellness Coaching',
    'Holistic Health'
  ];
  const [activeTab, setActiveTab] = useState('feed');

  // States for feature dialogs
  const [showMemberDirectory, setShowMemberDirectory] = useState(false);
  const [showDiscussionForums, setShowDiscussionForums] = useState(false);
  const [showWellnessChallenges, setShowWellnessChallenges] = useState(false);
  const [showLiveEvents, setShowLiveEvents] = useState(false);
  const [showSupportGroups, setShowSupportGroups] = useState(false);
  const [showCommunityCalendar, setShowCommunityCalendar] = useState(false);
  const [connectedMembers, setConnectedMembers] = useState<Set<number>>(new Set());
  const [joinedForums, setJoinedForums] = useState<Set<number>>(new Set());
  const [joinedChallenges, setJoinedChallenges] = useState<Set<number>>(new Set());
  const [joinedEvents, setJoinedEvents] = useState<Set<number>>(new Set());
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<Map<number, Array<{user: string, text: string}>>>(new Map());
  const [showComments, setShowComments] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState<Map<number, string>>(new Map());

  const members = [
    { id: 1, name: 'Priya Sharma', description: 'Nutrition Expert | Delhi', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    { id: 2, name: 'Raj Kumar', description: 'Fitness Trainer | Bangalore', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    { id: 3, name: 'Amit Singh', description: 'Dietitian | Mumbai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { id: 4, name: 'Kavita Rao', description: 'Meal Planner | Chennai', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
    { id: 5, name: 'Vikram Patel', description: 'Nutrition Coach | Pune', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' },
    { id: 6, name: 'Sneha Gupta', description: 'Healthy Eating Specialist | Hyderabad', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { id: 7, name: 'Arjun Mehta', description: 'Weight Management Expert | Ahmedabad', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    { id: 8, name: 'Meera Joshi', description: 'Diet Consultant | Jaipur', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    { id: 9, name: 'Rohan Desai', description: 'Sports Nutritionist | Surat', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { id: 10, name: 'Poonam Agarwal', description: 'Holistic Nutritionist | Lucknow', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' },
    { id: 11, name: 'Suresh Nair', description: 'Nutritional Therapist | Kochi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    { id: 12, name: 'Anjali Verma', description: 'Food Scientist | Indore', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const forums = [
    { id: 1, title: 'Nutrition Tips for Beginners', description: 'Started by: Priya S. | 15 replies | Last post: 2 hours ago' },
    { id: 2, title: 'Mental Health and Exercise', description: 'Started by: Raj K. | 28 replies | Last post: 1 day ago' }
  ];

  const challenges = [
    { id: 1, title: 'Hydration Challenge', description: 'Track your daily water consumption for better hydration.' },
    { id: 2, title: 'Meal Prep Challenge', description: 'Prepare healthy meals in advance for the week.' },
    { id: 3, title: 'Veggie Intake Challenge', description: 'Increase your daily vegetable consumption.' },
    { id: 4, title: 'Sugar-Free Challenge', description: 'Avoid added sugars for 30 days.' }
  ];

  const feedPosts = [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      content: 'Just completed my 30-day yoga challenge! Feeling amazing! 🧘‍♀️ #WellnessJourney',
      likes: 12,
      comments: []
    },
    {
      id: 2,
      user: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      content: 'Looking for a running buddy in Mumbai. Anyone interested? #FitnessCommunity',
      likes: 8,
      comments: []
    },
    {
      id: 3,
      user: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      content: 'Amazing nutrition webinar today! Learned so much about meal planning. Thanks to everyone who joined! 📚🥗',
      likes: 15,
      comments: []
    },
    {
      id: 4,
      user: 'Raj Kumar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      content: 'Day 5 of the hydration challenge! Already feeling more energized. Who else is participating? 💧',
      likes: 22,
      comments: []
    },
    {
      id: 5,
      user: 'Sneha Gupta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      content: 'Just tried a new smoothie recipe with kale, banana, and almond milk. So refreshing! Recipe in comments 👇',
      likes: 18,
      comments: []
    },
    {
      id: 6,
      user: 'Arjun Mehta',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      content: 'Mental health is just as important as physical health. Taking time for meditation today. 🧘‍♂️ #SelfCare',
      likes: 27,
      comments: []
    }
  ];

  const handleConnect = (memberId: number) => {
    setConnectedMembers(prev => new Set(prev).add(memberId));
  };

  const handleCancel = (memberId: number) => {
    setConnectedMembers(prev => {
      const newSet = new Set(prev);
      newSet.delete(memberId);
      return newSet;
    });
  };

  const handleJoinForum = (forumId: number) => {
    setJoinedForums(prev => new Set(prev).add(forumId));
  };

  const handleCancelForum = (forumId: number) => {
    setJoinedForums(prev => {
      const newSet = new Set(prev);
      newSet.delete(forumId);
      return newSet;
    });
  };

  const handleJoinChallenge = (challengeId: number) => {
    setJoinedChallenges(prev => new Set(prev).add(challengeId));
  };

  const handleCancelChallenge = (challengeId: number) => {
    setJoinedChallenges(prev => {
      const newSet = new Set(prev);
      newSet.delete(challengeId);
      return newSet;
    });
  };

  const handleJoinEvent = (eventId: number) => {
    setJoinedEvents(prev => new Set(prev).add(eventId));
  };

  const handleCancelEvent = (eventId: number) => {
    setJoinedEvents(prev => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
  };

  const handleJoinGroup = (groupId: number) => {
    setJoinedGroups(prev => new Set(prev).add(groupId));
  };

  const handleCancelGroup = (groupId: number) => {
    setJoinedGroups(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
      return newSet;
    });
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate joining community
    console.log('Joining community:', { ...joinForm, interests: selectedInterests });
    setJoined(true);
    addNotification({
      type: 'system',
      title: 'Welcome to the Community!',
      message: 'You have successfully joined our Wellness Community. Start connecting with others!',
      unread: true
    });
    setTimeout(() => {
      setShowJoinForm(false);
      setJoined(false);
      setJoinForm({ name: '', email: '', interests: '' });
      setSelectedInterests([]);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setJoinForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLikePost = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleToggleComments = (postId: number) => {
    setShowComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleAddComment = (postId: number) => {
    const commentText = newComment.get(postId)?.trim();
    if (commentText) {
      setComments(prev => {
        const newComments = new Map(prev);
        const postComments = newComments.get(postId) || [];
        newComments.set(postId, [...postComments, { user: 'You', text: commentText }]);
        return newComments;
      });
      setNewComment(prev => {
        const newMap = new Map(prev);
        newMap.delete(postId);
        return newMap;
      });
    }
  };

  const communityFeatures = [
    {
      icon: Users,
      title: 'Member Directory',
      description: 'Connect with other members and find wellness buddies',
      action: () => setShowMemberDirectory(true)
    },
    {
      icon: MessageCircle,
      title: 'Discussion Forums',
      description: 'Join conversations on various health and wellness topics',
      action: () => setShowDiscussionForums(true)
    },
    {
      icon: Award,
      title: 'Wellness Challenges',
      description: 'Participate in group challenges to stay motivated',
      action: () => setShowWellnessChallenges(true)
    },
    {
      icon: Video,
      title: 'Live Events',
      description: 'Attend webinars, workshops, and live Q&A sessions',
      action: () => setShowLiveEvents(true)
    },
    {
      icon: Heart,
      title: 'Support Groups',
      description: 'Find groups for specific health conditions and goals',
      action: () => setShowSupportGroups(true)
    },
    {
      icon: Calendar,
      title: 'Community Calendar',
      description: 'Stay updated with upcoming events and meetups',
      action: () => setShowCommunityCalendar(true)
    }
  ];

  const tabs = [
    { id: 'feed', label: 'Community Feed', icon: MessageCircle },
    { id: 'challenges', label: 'Challenges', icon: Award },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'groups', label: 'Groups', icon: Users }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <div className="space-y-4">
            {feedPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <img src={post.avatar} alt="User" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{post.user}</p>
                      <p className="text-sm text-gray-700">{post.content}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-gray-600 hover:text-gray-800 ${likedPosts.has(post.id) ? 'text-red-500' : ''}`}
                          onClick={() => handleLikePost(post.id)}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          {likedPosts.has(post.id) ? post.likes + 1 : post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                          onClick={() => handleToggleComments(post.id)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {(comments.get(post.id)?.length || 0)}
                        </Button>
                      </div>
                      {showComments.has(post.id) && (
                        <div className="mt-3 space-y-2">
                          {(comments.get(post.id) || []).map((comment, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded">
                              <p className="text-sm font-medium">{comment.user}</p>
                              <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Add a comment..."
                              value={newComment.get(post.id) || ''}
                              onChange={(e) => setNewComment(prev => new Map(prev).set(post.id, e.target.value))}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(post.id);
                                }
                              }}
                              className="flex-1"
                            />
                            <Button size="sm" onClick={() => handleAddComment(post.id)}>Post</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 'challenges':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-gray-800">30-Day Mindfulness Challenge</h3>
                <p className="text-sm text-gray-700 mb-3">Join us for daily meditation and mindfulness exercises.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">125 members joined</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Join Challenge</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-gray-800">Hydration Challenge</h3>
                <p className="text-sm text-gray-700 mb-3">Track your water intake and stay hydrated!</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">89 members joined</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Join Challenge</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-gray-800">Live Cooking Demo: Healthy Recipes</h3>
                <p className="text-sm text-gray-700 mb-2">Date: October 15, 2023 | Time: 7:00 PM</p>
                <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">RSVP</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-gray-800">Wellness Workshop: Stress Management</h3>
                <p className="text-sm text-gray-700 mb-2">Date: October 20, 2023 | Time: 6:00 PM</p>
                <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">RSVP</Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'groups':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-gray-800">Diabetes Support Group</h3>
                <p className="text-sm text-gray-700 mb-3">Share experiences and tips for managing diabetes.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">342 members</span>
                  {joinedGroups.has(1) ? (
                    <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => handleCancelGroup(1)}>Cancel</Button>
                  ) : (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleJoinGroup(1)}>Join Group</Button>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-gray-800">Weight Loss Warriors</h3>
                <p className="text-sm text-gray-700 mb-3">Motivation and accountability for your weight loss journey.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">567 members</span>
                  {joinedGroups.has(2) ? (
                    <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => handleCancelGroup(2)}>Cancel</Button>
                  ) : (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleJoinGroup(2)}>Join Group</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16 px-8 bg-blue-50 rounded-2xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-6 font-bold text-gray-800">
            Welcome to Our Wellness Community
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Connect, share, and grow together on your journey to better health and wellness.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => setShowJoinForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
            >
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Explore Community Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityFeatures.map((feature, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow border-0" onClick={feature.action}>
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-700 text-sm">{feature.description}</p>
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 mt-2" onClick={(e) => {
                  e.stopPropagation();
                  feature.action();
                }}>
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tabs Navigation */}
      <section>
        <div className="flex justify-center space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 rounded-md ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          {renderTabContent()}
        </div>
      </section>

      {/* Join Form Dialog */}
      <Dialog open={showJoinForm} onOpenChange={setShowJoinForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Join Wellness Community
            </DialogTitle>
          </DialogHeader>
          {joined ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600 mb-2">Welcome Aboard!</h3>
              <p className="text-gray-600">You're now part of our amazing community. Start exploring!</p>
            </div>
          ) : (
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  type="text"
                  value={joinForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={joinForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                <Textarea
                  value={joinForm.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                  placeholder="Tell us about your wellness interests (e.g., yoga, nutrition, fitness)"
                  rows={3}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowJoinForm(false)} className="border-gray-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md px-6 py-2">
                  Join Now
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Member Directory Dialog */}
      <Dialog open={showMemberDirectory} onOpenChange={setShowMemberDirectory}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Member Directory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  if (!e.target.value) {
                    setSelectedMember(null);
                  }
                }}
                className="max-w-md mx-auto"
              />
              {searchQuery && showDropdown && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-w-md w-full z-10 max-h-48 overflow-y-auto">
                  {members
                    .filter(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((member) => (
                      <div
                        key={member.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedMember(member);
                          setSearchQuery('');
                          setShowDropdown(false);
                        }}
                      >
                        {member.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
            {selectedMember && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <img src={selectedMember.avatar} alt={selectedMember.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-medium">{selectedMember.name}</p>
                  <p className="text-sm text-gray-600">{selectedMember.description}</p>
                </div>
                {connectedMembers.has(selectedMember.id) ? (
                  <Button size="sm" variant="outline" onClick={() => handleCancel(selectedMember.id)}>Cancel</Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleConnect(selectedMember.id)}>Connect</Button>
                )}
              </div>
            )}
            <div className="max-h-96 overflow-y-auto space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.description}</p>
                  </div>
                  {connectedMembers.has(member.id) ? (
                    <Button size="sm" variant="outline" onClick={() => handleCancel(member.id)}>Cancel</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleConnect(member.id)}>Connect</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showDiscussionForums} onOpenChange={setShowDiscussionForums}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Discussion Forums</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {forums.map((forum) => (
              <Card key={forum.id}>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{forum.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{forum.description}</p>
                  {joinedForums.has(forum.id) ? (
                    <Button size="sm" variant="outline" onClick={() => handleCancelForum(forum.id)}>Cancel</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleJoinForum(forum.id)}>Join Discussion</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Wellness Challenges Dialog */}
      <Dialog open={showWellnessChallenges} onOpenChange={setShowWellnessChallenges}>
        <DialogContent className="max-w-md max-h-[60vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Wellness Challenges</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{challenge.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                {joinedChallenges.has(challenge.id) ? (
                  <Button size="sm" variant="outline" onClick={() => handleCancelChallenge(challenge.id)}>Cancel</Button>
                ) : (
                  <Button size="sm" onClick={() => handleJoinChallenge(challenge.id)}>Join Challenge</Button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Live Events Dialog */}
      <Dialog open={showLiveEvents} onOpenChange={setShowLiveEvents}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Live Events</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Nutrition Webinar</h4>
                  <span className="text-sm text-green-600">Live Now</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Join Dr. Sharma for tips on balanced diets.</p>
                {joinedEvents.has(1) ? (
                  <Button size="sm" variant="outline" onClick={() => handleCancelEvent(1)}>Cancel</Button>
                ) : (
                  <Button size="sm" onClick={() => handleJoinEvent(1)}>Join Event</Button>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Fitness Workshop</h4>
                  <span className="text-sm text-blue-600">Tomorrow 7 PM</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Interactive session on home workouts.</p>
                <Button size="sm" variant="outline">RSVP</Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Groups Dialog */}
      <Dialog open={showSupportGroups} onOpenChange={setShowSupportGroups}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Support Groups</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                Diabetes Support
              </h4>
              <p className="text-sm text-gray-600 mb-3">Share tips and motivation for managing diabetes.</p>
              {joinedGroups.has(1) ? (
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleCancelGroup(1)}>Cancel</Button>
              ) : (
                <Button size="sm" className="w-full" onClick={() => handleJoinGroup(1)}>Join Group</Button>
              )}
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                Weight Loss Journey
              </h4>
              <p className="text-sm text-gray-600 mb-3">Accountability partners for sustainable weight loss.</p>
              {joinedGroups.has(2) ? (
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleCancelGroup(2)}>Cancel</Button>
              ) : (
                <Button size="sm" className="w-full" onClick={() => handleJoinGroup(2)}>Join Group</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Community Calendar Dialog */}
      <Dialog open={showCommunityCalendar} onOpenChange={setShowCommunityCalendar}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Community Calendar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Nutrition</h4>
                <span className="text-sm text-gray-600">Oct 15, 6 PM</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Learn about balanced diets and healthy eating habits.</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => onNavigate('/video-call')}><Video className="h-3 w-3 mr-1" /> Online</Button>
                <Button size="sm"><Star className="h-3 w-3 mr-1" /> RSVP</Button>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Nutrition Talk</h4>
                <span className="text-sm text-gray-600">Oct 20, 7 PM</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Expert talk on superfoods and their benefits.</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline"><Video className="h-3 w-3 mr-1" /> Online</Button>
                <Button size="sm"><Star className="h-3 w-3 mr-1" /> RSVP</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
