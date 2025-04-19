import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HeartIcon, ChatBubbleLeftIcon, ArrowPathIcon, PlusIcon, 
  BookmarkIcon, ShareIcon, EllipsisHorizontalIcon 
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import axios from "axios";
import CreatePostModal from "./CreatePostModal";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import Footer from "../Footer";
import LoadingSpinner from "../LoadingSpinner";

const SocialFeed = () => {
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const feedRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const scrollYSmoothPx = useSpring(scrollY, { stiffness: 500, damping: 150, mass: 1 });
  const headerOpacity = useTransform(scrollYSmoothPx, [0, 50], [1, 0.98]);
  const headerBackdrop = useTransform(scrollYSmoothPx, [0, 100], [0, 1]);
  const headerBackdropStyle = useMotionTemplate`backdrop-blur-${headerBackdrop < 0.5 ? '0' : 'md'}`;

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop && st > 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      setLastScrollTop(st <= 0 ? 0 : st);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/profile`, {
          withCredentials: true,
        });
        setCurrentUser({
          id: response.data.id,
          username: response.data.username || "Unknown User",
          profileImageUrl: response.data.profileImageUrl || "/default-avatar.png",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [API_URL]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await new Promise(resolve =>
        setTimeout(async () => {
          try {
            const res = await axios.get(`${API_URL}/Post`);
            resolve(res);
          } catch (error) {
            resolve({ error });
          }
        }, 100)
      );

      if (response.error) throw response.error;

      const data = Array.isArray(response?.data) ? response.data : [];

      const enhancedData = data.map(post => ({
        ...post,
        engagement: Math.floor(Math.random() * 100),
        likeProbability: Math.random()
      }));

      setPosts(enhancedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.response?.data?.message || "Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = async () => {
    setShowCreateModal(false);

    try {
      await fetchPosts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error refetching posts:", err);
    }
  };

  const handleLike = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (!currentUser) {
      navigate("/login");
      return;
    }
  
    const originalPosts = [...posts];
    const post = posts.find(p => p.id === postId);
    const alreadyLiked = post.likes.some(like => like.UserId === currentUser.id);
  
    try {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: alreadyLiked
              ? post.likes.filter(like => like.UserId !== currentUser.id)
              : [...post.likes, {
                UserId: currentUser.id,
                Username: currentUser.username,
                LikedAt: new Date().toISOString()
              }]
          };
        }
        return post;
      });
      setPosts(updatedPosts);
  
      let response;
      if (alreadyLiked) {
        response = await axios.delete(
          `${API_URL}/Post/${postId}/like`,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${API_URL}/Post/${postId}/like`,
          {},
          { withCredentials: true }
        );
      }
  
      if (response.data.likes) {
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        ));
      }
    } catch (err) {
      console.error(`Error ${alreadyLiked ? 'removing' : 'adding'} like:`, err);
      setPosts(originalPosts);
      setError(`Failed to ${alreadyLiked ? 'remove' : 'add'} like. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>
        <div className="text-red-500 text-base mb-4 text-center font-medium">
          {error}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={fetchPosts}
          className="w-full bg-gradient-to-r from-white-500 to-white-600 hover:from-white-600 hover:to-white-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md text-sm"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900" ref={feedRef}>
      <motion.div
        ref={headerRef}
        className="sticky top-0 z-20 bg-white dark:bg-gray-900"
        style={{
          opacity: headerOpacity,
          backdropFilter: headerBackdropStyle
        }}
      >
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="sr-only">Social Feed</h1>
            <div className="flex-1"></div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-xl mx-auto px-4 pb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <img 
                src={currentUser?.profileImageUrl || "/default-avatar.png"} 
                alt={currentUser?.username || "Your profile"}
                className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
              <motion.div 
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full py-2.5 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowCreateModal(true)}
              >
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  What's on your mind, {currentUser.username}?
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />

        <AnimatePresence mode="wait">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <motion.div
                className="text-white-500 mb-5 relative"
                animate={{
                  rotate: [0, 3, 0, -3, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <motion.div
                  className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"
                  initial={{ opacity: 0.2 }}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-100">No posts found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs text-sm">
                There are no posts in your feed yet. Be the first one to share!
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md text-sm"
              >
                Create Your First Post
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  layoutId={`post-${post.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Link
                        to={`/profile/${post.user?.id || "unknown"}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2.5 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative"
                        >
                          <img
                            src={post.user?.profileImageUrl || "/default-avatar.png"}
                            alt={post.user?.username || "Unknown User"}
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                          />
                        </motion.div>
                        <div>
                          <p className="font-medium group-hover:text-white-500 transition-colors duration-200 text-sm">
                            {post.user?.username || "Unknown User"}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {moment(post.createdAt).fromNow()}
                          </p>
                        </div>
                      </Link>
                    </div>

                    <div className="mb-3">
                      <h3 className="text-lg font-medium mb-1.5 text-gray-900 dark:text-gray-100">{post.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed">{post.content}</p>
                    </div>

                    {post.imageUrl && (
                      <motion.div
                        className="mb-3 -mx-4 relative overflow-hidden"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={post.imageUrl}
                          alt="Post content"
                          className="w-full h-64 sm:h-80 object-cover transform hover:scale-[1.01] transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </motion.div>
                    )}

                    {(post.workout || post.nutritionLog) && (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 rounded-lg p-3 mb-3"
                      >
                        {post.workout && post.nutritionLog ? (
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-500/20 p-1.5 rounded-md mr-2.5">
                                <span className="text-lg">🏋️</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-yellow-500 dark:text-yellow-400 text-xs mb-0.5">Workout</h4>
                                <p className="text-xs text-yellow-700 dark:text-gray-200">
                                  {post.workout.title} · {post.workout.duration} mins
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-green-100 dark:bg-green-500/20 p-1.5 rounded-md mr-2.5">
                                <span className="text-lg">🥗</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-green-600 dark:text-green-400 text-xs mb-0.5">Nutrition</h4>
                                <p className="text-xs text-gray-700 dark:text-gray-200">
                                  {post.nutritionLog.foodName} · {post.nutritionLog.calories} kcal
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : post.workout ? (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-500/20 p-1.5 rounded-md mr-2.5">
                              <span className="text-lg">🏋️</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-white-600 dark:text-white-400 text-xs mb-0.5">Workout</h4>
                              <p className="text-xs text-gray-700 dark:text-gray-200">
                                {post.workout.title} · {post.workout.duration} mins
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 dark:bg-green-500/20 p-1.5 rounded-md mr-2.5">
                              <span className="text-lg">🥗</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-green-600 dark:text-green-400 text-xs mb-0.5">Nutrition</h4>
                              <p className="text-xs text-gray-700 dark:text-gray-200">
                                {post.nutritionLog.foodName} · {post.nutritionLog.calories} kcal
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-4">
                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          onClick={(e) => handleLike(post.id, e)}
                          className="flex items-center gap-1.5 transition-colors duration-200 relative group"
                        >
                          {post.likes.some(like => like.userId === currentUser?.id) ? (
                            <>
                              <HeartSolidIcon className="h-5 w-5 text-red-500" />
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [1.5, 1], opacity: [1, 0] }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-red-500 rounded-full blur-md z-0"
                              />
                            </>
                          ) : (
                            <HeartIcon className="h-5 w-5 group-hover:text-red-500 transition-colors" />
                          )}
                          <span className="text-xs group-hover:text-red-500">{post.likes.length}</span>
                        </motion.button>

                        <div className="flex items-center gap-1.5 transition-colors duration-200 group">
                          <ChatBubbleLeftIcon className="h-5 w-5" />
                          <span className="text-xs">{post.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {scrollDirection === "down" && posts.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-5 right-5 z-50 bg-yellow-500 text-white p-3 rounded-full shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer className="mt-8 md:mt-12"/>
    </div>
  );
};

export default SocialFeed;