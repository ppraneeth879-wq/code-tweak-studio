import React, { useState, useEffect } from 'react';
import { BookOpen, Code, Database, Brain, Trophy, Menu, X, CheckCircle, Circle, Play, Clock, Zap, Target, Award, LogOut, FileText, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  icon: React.ReactNode;
  difficulty: string;
  duration: string;
  lessons: number;
  gradient: string;
  iconColor: string;
  description: string;
  modules: Module[];
}

interface Module {
  name: string;
  topics: string[];
  lessons: number;
  pdfUrl?: string;
  videoUrl?: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const { user, signOut } = useAuth();

  const courses: Course[] = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      icon: <Brain className="w-8 h-8" />,
      difficulty: 'Beginner to Advanced',
      duration: '150+ hours',
      lessons: 180,
      gradient: 'from-blue-100 to-cyan-100',
      iconColor: 'text-blue-600',
      description: 'Master DSA from basics to advanced topics with 450+ problems',
      modules: [
        { name: 'Arrays & Hashing', topics: ['Introduction to Arrays', 'Two Pointer Technique', 'Sliding Window', 'Prefix Sum', 'Hash Maps'], lessons: 25 },
        { name: 'Linked Lists', topics: ['Singly Linked List', 'Doubly Linked List', 'Circular Linked List', 'Fast & Slow Pointers'], lessons: 18 },
        { name: 'Stacks & Queues', topics: ['Stack Implementation', 'Queue Implementation', 'Monotonic Stack', 'Priority Queue'], lessons: 20 },
        { name: 'Trees & Graphs', topics: ['Binary Trees', 'BST', 'AVL Trees', 'Graph Traversals', 'Shortest Path Algorithms'], lessons: 35 },
        { name: 'Dynamic Programming', topics: ['1D DP', '2D DP', 'DP on Trees', 'DP on Graphs', 'Optimization Techniques'], lessons: 40 },
      ],
    },
    {
      id: 'fullstack',
      title: 'Full Stack Web Development',
      icon: <Code className="w-8 h-8" />,
      difficulty: 'Beginner to Intermediate',
      duration: '120+ hours',
      lessons: 150,
      gradient: 'from-purple-100 to-pink-100',
      iconColor: 'text-purple-600',
      description: 'Build modern web applications from frontend to backend',
      modules: [
        { name: 'HTML & CSS', topics: ['HTML5 Fundamentals', 'CSS Flexbox', 'CSS Grid', 'Responsive Design', 'CSS Animations'], lessons: 20 },
        { name: 'JavaScript', topics: ['ES6+ Features', 'DOM Manipulation', 'Async/Await', 'Promises', 'Event Loop'], lessons: 30 },
        { name: 'React', topics: ['Components', 'Hooks', 'State Management', 'React Router', 'Context API'], lessons: 35 },
        { name: 'Backend', topics: ['Node.js', 'Express.js', 'RESTful APIs', 'Authentication', 'Middleware'], lessons: 30 },
        { name: 'Databases', topics: ['SQL Basics', 'PostgreSQL', 'MongoDB', 'Database Design', 'Migrations'], lessons: 35 },
      ],
    },
    {
      id: 'ml',
      title: 'Machine Learning',
      icon: <Database className="w-8 h-8" />,
      difficulty: 'Intermediate to Advanced',
      duration: '180+ hours',
      lessons: 200,
      gradient: 'from-green-100 to-teal-100',
      iconColor: 'text-green-600',
      description: 'Learn AI and ML from fundamentals to deep learning',
      modules: [
        { name: 'Python for ML', topics: ['NumPy', 'Pandas', 'Matplotlib', 'Data Preprocessing', 'Feature Engineering'], lessons: 25 },
        { name: 'Supervised Learning', topics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM'], lessons: 40 },
        { name: 'Unsupervised Learning', topics: ['K-Means', 'Hierarchical Clustering', 'PCA', 'Anomaly Detection'], lessons: 30 },
        { name: 'Neural Networks', topics: ['Perceptrons', 'Backpropagation', 'CNNs', 'RNNs', 'Transfer Learning'], lessons: 50 },
        { name: 'Advanced Topics', topics: ['GANs', 'Reinforcement Learning', 'NLP', 'Computer Vision', 'Model Deployment'], lessons: 55 },
      ],
    },
  ];

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching progress:', error);
      return;
    }

    const progressMap: Record<string, boolean> = {};
    data?.forEach((item) => {
      progressMap[`${item.course_id}-${item.lesson_id}`] = item.completed;
    });
    setCompletedLessons(progressMap);
  };

  const toggleLesson = async (courseId: string, lessonId: string) => {
    if (!user) return;

    const key = `${courseId}-${lessonId}`;
    const isCompleted = completedLessons[key];

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        completed: !isCompleted,
        completed_at: !isCompleted ? new Date().toISOString() : null,
      });

    if (error) {
      toast.error('Failed to update progress');
      return;
    }

    setCompletedLessons((prev) => ({
      ...prev,
      [key]: !isCompleted,
    }));
    toast.success(isCompleted ? 'Lesson marked as incomplete' : 'Lesson completed!');
  };

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    const completed = Object.keys(completedLessons).filter(
      (key) => key.startsWith(courseId) && completedLessons[key]
    ).length;
    return Math.round((completed / totalLessons) * 100);
  };

  const renderHome = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <Trophy className="w-16 h-16 text-primary mx-auto animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Master Your Skills with Interactive Learning
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Track your progress, complete lessons, and become a coding expert with our comprehensive courses
          </p>
          <Button size="lg" onClick={() => setActiveSection('courses')}>
            Explore Courses
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 gap-8 px-4">
        {[
          { icon: <BookOpen className="w-8 h-8" />, stat: '530+', label: 'Total Lessons' },
          { icon: <Target className="w-8 h-8" />, stat: '450+', label: 'Practice Problems' },
          { icon: <Award className="w-8 h-8" />, stat: '3', label: 'Career Paths' },
        ].map((item, idx) => (
          <div key={idx} className="text-center p-6 bg-card rounded-lg border">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">{item.icon}</div>
            <div className="text-3xl font-bold mb-2">{item.stat}</div>
            <div className="text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </section>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Choose Your Learning Path</h2>
        <p className="text-xl text-muted-foreground">Select a course and start your journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => {
          const progress = getCourseProgress(course.id, course.lessons);
          return (
            <div
              key={course.id}
              className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <div className={`bg-gradient-to-br ${course.gradient} p-6`}>
                <div className={`${course.iconColor} mb-4`}>{course.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {course.difficulty}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  View Course
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-br ${selectedCourse.gradient} p-8`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className={`${selectedCourse.iconColor} mb-4`}>{selectedCourse.icon}</div>
                  <h2 className="text-3xl font-bold mb-2">{selectedCourse.title}</h2>
                  <p className="text-muted-foreground">{selectedCourse.description}</p>
                </div>
                <button onClick={() => setSelectedCourse(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {selectedCourse.modules.map((module, idx) => (
                <div key={idx} className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                    <span>{module.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">{module.lessons} lessons</span>
                  </h3>
                  
                  {(module.pdfUrl || module.videoUrl) && (
                    <div className="flex gap-4 mb-4">
                      {module.pdfUrl && (
                        <a href={module.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <FileText className="w-4 h-4" />
                          View PDF
                        </a>
                      )}
                      {module.videoUrl && (
                        <a href={module.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <Video className="w-4 h-4" />
                          Watch Video
                        </a>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    {module.topics.map((topic, topicIdx) => {
                      const lessonKey = `${selectedCourse.id}-${idx}-${topicIdx}`;
                      const isCompleted = completedLessons[lessonKey];
                      return (
                        <div
                          key={topicIdx}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                          onClick={() => toggleLesson(selectedCourse.id, `${idx}-${topicIdx}`)}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                            {topic}
                          </span>
                          <Play className="w-4 h-4 ml-auto text-muted-foreground" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAbout = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">About CodePup</h2>
        <p className="text-xl text-muted-foreground">Your journey to mastery starts here</p>
      </div>

      <div className="prose prose-lg mx-auto text-muted-foreground">
        <p>
          CodePup is a comprehensive learning platform designed to help you master programming,
          data structures, algorithms, and modern web technologies. Our interactive courses are
          structured to take you from beginner to expert level.
        </p>
        <p>
          Track your progress, complete lessons at your own pace, and access rich learning materials
          including PDFs and video tutorials. Join thousands of learners who are advancing their
          coding careers with CodePup.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">CodePup</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveSection('home')}
                className={`hover:text-primary transition-colors ${activeSection === 'home' ? 'text-primary font-semibold' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveSection('courses')}
                className={`hover:text-primary transition-colors ${activeSection === 'courses' ? 'text-primary font-semibold' : ''}`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveSection('about')}
                className={`hover:text-primary transition-colors ${activeSection === 'about' ? 'text-primary font-semibold' : ''}`}
              >
                About
              </button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2">
              <button
                onClick={() => {
                  setActiveSection('home');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-primary"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveSection('courses');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-primary"
              >
                Courses
              </button>
              <button
                onClick={() => {
                  setActiveSection('about');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-primary"
              >
                About
              </button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && renderHome()}
        {activeSection === 'courses' && renderCourses()}
        {activeSection === 'about' && renderAbout()}
      </main>
    </div>
  );
};

export default Index;
