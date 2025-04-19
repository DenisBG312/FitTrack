import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  HeartIcon, ChatBubbleLeftIcon, ArrowPathIcon, PlusIcon, 
  BookmarkIcon, ShareIcon, EllipsisHorizontalIcon, FireIcon, 
  UserGroupIcon, GlobeAltIcon 
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import axios from "axios";
import CreatePostModal from "./CreatePostModal";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";

const SocialFeed = () => {
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("everyone");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
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
  }, [activeTab]);

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

    try {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const alreadyLiked = post.likes.some(like => like.UserId === currentUser.id);
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

      const response = await axios.post(
        `${API_URL}/Post/${postId}/like`,
        {},
        { withCredentials: true }
      );

      const updatedLikes = response.data.likes;
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: updatedLikes } : post
      ));
    } catch (err) {
      console.error("Error toggling like:", err);
      setPosts(originalPosts);
      setError("Failed to update like. Please try again.");
    }
  };

  const handleBookmark = (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarkedPosts.includes(postId)) {
      setBookmarkedPosts(bookmarkedPosts.filter(id => id !== postId));
    } else {
      setBookmarkedPosts([...bookmarkedPosts, postId]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-950">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-xl text-amber-500 font-medium mb-6"
        >
          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
              y: [0, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading your fitness feed
          </motion.span>
        </motion.div>

        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="text-amber-500"
          >
            <ArrowPathIcon className="h-10 w-10" />
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-amber-500 rounded-full blur-xl"
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-16 p-6 bg-gray-900 rounded-xl shadow-lg"
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>
        <div className="text-red-400 text-base mb-4 text-center font-medium">
          {error}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={fetchPosts}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md text-sm"
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

  const tabIcons = {
    everyone: <GlobeAltIcon className="h-4 w-4" />,
    following: <UserGroupIcon className="h-4 w-4" />,
    trending: <FireIcon className="h-4 w-4" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black pb-20" ref={feedRef}>
      <motion.div
        ref={headerRef}
        className="sticky top-0 z-20 bg-gray-950/90 mb-5 border-b border-gray-800/50"
        style={{
          opacity: headerOpacity,
          backdropFilter: headerBackdropStyle
        }}
      >
        <div className="max-w-xl mx-auto px-4 pt-4 pb-1">
          <div className="flex justify-between items-center mb-4">
            <motion.h1
              className="text-xl font-bold"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                FitConnect
              </span>
            </motion.h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-medium py-1.5 px-3.5 rounded-full transition-all duration-200 shadow-md shadow-amber-500/10 text-sm"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Post</span>
            </motion.button>
          </div>

          <div className="flex border-b border-gray-800/50">
            {["Everyone", "Following", "Trending"].map((tab, index) => {
              const tabValue = tab.toLowerCase();
              const isActive = activeTab === tabValue;

              return (
                <motion.button
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }}
                  onClick={() => setActiveTab(tabValue)}
                  className={`relative flex items-center gap-1.5 py-2.5 px-3 text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-amber-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tabIcons[tabValue]}
                  {tab}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600"
                      initial={false}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="max-w-xl mx-auto px-4">
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
                className="text-amber-500 mb-5 relative"
                animate={{
                  rotate: [0, 3, 0, -3, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <motion.div
                  className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"
                  initial={{ opacity: 0.2 }}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <h3 className="text-xl font-medium mb-2 text-gray-100">No posts found</h3>
              <p className="text-gray-400 mb-6 max-w-xs text-sm">
                There are no posts in your feed yet. Be the first one to share your fitness journey!
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md text-sm"
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
                  className="bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-gray-800/40 hover:border-gray-700/60 transition-all duration-300"
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
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full blur-sm opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                          <img
                            src={post.user?.profileImageUrl || "/default-avatar.png"}
                            alt={post.user?.username || "Unknown User"}
                            className="relative h-10 w-10 rounded-full object-cover border border-amber-600/70 z-10"
                          />
                        </motion.div>
                        <div>
                          <p className="font-medium group-hover:text-amber-500 transition-colors duration-200 text-sm">
                            {post.user?.username || "Unknown User"}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {moment(post.createdAt).fromNow()}
                          </p>
                        </div>
                      </Link>

                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mb-3">
                      <h3 className="text-lg font-medium mb-1.5 text-gray-100">{post.title}</h3>
                      <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{post.content}</p>
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
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                      </motion.div>
                    )}

                    {(post.workout || post.nutritionLog) && (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="bg-gray-800/70 border border-gray-700/50 rounded-lg p-3 mb-3 backdrop-blur-sm"
                      >
                        {post.workout && post.nutritionLog ? (
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-amber-500/20 p-1.5 rounded-md mr-2.5">
                                <span className="text-lg">🏋️</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-amber-500 text-xs mb-0.5">Workout</h4>
                                <p className="text-xs text-gray-200">
                                  {post.workout.title} · {post.workout.duration} mins
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-green-500/20 p-1.5 rounded-md mr-2.5">
                                <span className="text-lg">🥗</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-green-500 text-xs mb-0.5">Nutrition</h4>
                                <p className="text-xs text-gray-200">
                                  {post.nutritionLog.foodName} · {post.nutritionLog.calories} kcal
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : post.workout ? (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-amber-500/20 p-1.5 rounded-md mr-2.5">
                              <span className="text-lg">🏋️</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-amber-500 text-xs mb-0.5">Workout</h4>
                              <p className="text-xs text-gray-200">
                                {post.workout.title} · {post.workout.duration} mins
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-green-500/20 p-1.5 rounded-md mr-2.5">
                              <span className="text-lg">🥗</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-green-500 text-xs mb-0.5">Nutrition</h4>
                              <p className="text-xs text-gray-200">
                                {post.nutritionLog.foodName} · {post.nutritionLog.calories} kcal
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between text-gray-400 pt-2 border-t border-gray-800/40">
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
                            <HeartIcon className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                          )}
                          <span className="text-xs group-hover:text-red-400">{post.likes.length}</span>
                        </motion.button>

                        <div className="flex items-center gap-1.5 transition-colors duration-200 group">
                          <ChatBubbleLeftIcon className="h-5 w-5" />
                          <span className="text-xs">{post.comments.length}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(post.id, e);
                          }}
                          className="text-gray-400 transition-colors duration-200"
                        >
                          {bookmarkedPosts.includes(post.id) ? (
                            <BookmarkSolidIcon className="h-4 w-4 text-amber-500" />
                          ) : (
                            <BookmarkIcon className="h-4 w-4 hover:text-amber-500" />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-amber-500 transition-colors duration-200"
                        >
                          <ShareIcon className="h-4 w-4" />
                        </motion.button>
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
            className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 p-3 rounded-full shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialFeed;