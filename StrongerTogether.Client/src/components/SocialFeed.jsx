import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HeartIcon, ChatBubbleLeftIcon, ArrowPathIcon, PlusIcon, BookmarkIcon, ShareIcon, EllipsisHorizontalIcon, FireIcon, UserGroupIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import axios from "axios";
import CreatePostModal from "./CreatePostModal";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";

const SocialFeed = () => {
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

    const { scrollY } = useScroll();
    const scrollYSmoothPx = useSpring(scrollY, { stiffness: 500, damping: 150, mass: 1 });
    const headerOpacity = useTransform(scrollYSmoothPx, [0, 50], [1, 0.95]);
    const headerBackdrop = useTransform(scrollYSmoothPx, [0, 100], [0, 1]);
    const headerBackdropStyle = useMotionTemplate`backdrop-blur-${headerBackdrop < 0.5 ? '0' : 'sm'}`;

    useEffect(() => {
        const handleScroll = () => {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
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
                const response = await axios.get("https://localhost:7039/api/auth/profile", {
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
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await new Promise(resolve =>
                setTimeout(async () => {
                    try {
                        const res = await axios.get("https://localhost:7039/api/Post");
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

    const handlePostCreated = async (newPost) => {
        setShowCreateModal(false);

        try {
            await fetchPosts();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Error refetching posts:", err);
        }
    };

    const handleLike = (postId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const alreadyLiked = post.likes.some(like => like.userId === currentUser?.id);

                if (alreadyLiked) {
                    return {
                        ...post,
                        likes: post.likes.filter(like => like.userId !== currentUser?.id)
                    };
                } else {
                    return {
                        ...post,
                        likes: [...post.likes, { userId: currentUser?.id, username: currentUser?.username }]
                    };
                }
            }
            return post;
        }));
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
            <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-xl text-yellow-500 font-semibold mb-6"
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
                        className="text-yellow-500"
                    >
                        <ArrowPathIcon className="h-12 w-12" />
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 bg-yellow-500 rounded-full blur-xl"
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
                className="max-w-md mx-auto mt-16 p-8 bg-gray-800 rounded-xl shadow-2xl"
            >
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center"
                >
                    <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </motion.div>
                <div className="text-red-400 text-lg mb-4 text-center font-medium">
                    {error}
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={fetchPosts}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg"
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
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        }
    };

    const tabIcons = {
        everyone: <GlobeAltIcon className="h-5 w-5" />,
        following: <UserGroupIcon className="h-5 w-5" />,
        trending: <FireIcon className="h-5 w-5" />,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pb-16" ref={feedRef}>
            <motion.div
                ref={headerRef}
                className="sticky top-0 z-20 bg-gray-900/80 mb-8 border-b border-gray-800"
                style={{
                    opacity: headerOpacity,
                    backdropFilter: headerBackdropStyle
                }}
            >
                <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
                    <div className="flex justify-between items-center mb-6">
                        <motion.h1
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                                FitConnect
                            </span>
                        </motion.h1>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(234, 179, 8, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-900 font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-lg shadow-yellow-500/20"
                        >
                            <PlusIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">New Post</span>
                        </motion.button>
                    </div>

                    <div className="flex border-b border-gray-700/80">
                        {["Everyone", "Following", "Trending"].map((tab, index) => {
                            const tabValue = tab.toLowerCase();
                            const isActive = activeTab === tabValue;

                            return (
                                <motion.button
                                    key={tab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }}
                                    onClick={() => setActiveTab(tabValue)}
                                    className={`relative flex items-center gap-1.5 py-3 px-4 text-sm font-medium transition-colors duration-300 ${isActive
                                        ? "text-yellow-500"
                                        : "text-gray-400 hover:text-gray-200"
                                        }`}
                                >
                                    {tabIcons[tabValue]}
                                    {tab}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-600"
                                            initial={false}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            <div className="max-w-2xl mx-auto px-4">
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
                                className="text-yellow-500 mb-6 relative"
                                animate={{
                                    rotate: [0, 5, 0, -5, 0],
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <svg className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">No posts found</h3>
                            <p className="text-gray-400 mb-8 max-w-xs">
                                There are no posts in your feed yet. Be the first one to share your fitness journey!
                            </p>

                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 0 20px rgba(234, 179, 8, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowCreateModal(true)}
                                className="bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg"
                            >
                                Create Your First Post
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-6"
                        >
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    variants={itemVariants}
                                    layoutId={`post-${post.id}`}
                                    className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-700/50 hover:shadow-yellow-500/20 transition-shadow duration-300"
                                    style={{
                                        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
                                    }}
                                >
                                    <Link to={`/posts/${post.id}`} className="block">
                                        <div className="p-5 sm:p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <Link
                                                    to={`/profile/${post.user?.id || "unknown"}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-3 group"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="relative"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                                                        <img
                                                            src={post.user?.profileImageUrl || "/default-avatar.png"}
                                                            alt={post.user?.username || "Unknown User"}
                                                            className="relative h-12 w-12 rounded-full object-cover border-2 border-yellow-600 ring-2 ring-gray-800 z-10"
                                                        />
                                                    </motion.div>
                                                    <div>
                                                        <p className="font-semibold group-hover:text-yellow-500 transition-colors duration-300">
                                                            {post.user?.username || "Unknown User"}
                                                        </p>
                                                        <p className="text-gray-400 text-xs">
                                                            {moment(post.createdAt).fromNow()}
                                                        </p>
                                                    </div>
                                                </Link>

                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-gray-400 hover:text-gray-200 transition-colors duration-300 relative group"
                                                >
                                                    <EllipsisHorizontalIcon className="h-6 w-6" />
                                                    <span className="absolute right-0 mt-2 py-1 px-2 bg-gray-700 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible whitespace-nowrap">
                                                        More options
                                                    </span>
                                                </button>
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold mb-2 text-gray-100">{post.title}</h3>
                                                <p className="text-gray-300 whitespace-pre-line leading-relaxed">{post.content}</p>
                                            </div>

                                            {post.imageUrl && (
                                                <motion.div
                                                    className="mb-4 -mx-6 relative overflow-hidden"
                                                    whileHover={{ scale: 1.01 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <img
                                                        src={post.imageUrl}
                                                        alt="Post content"
                                                        className="w-full h-96 object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                                                </motion.div>
                                            )}

                                            {(post.workout || post.nutritionLog) && (
                                                <motion.div
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    initial={{ y: 8, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 + (index * 0.05), duration: 0.4, type: "spring", stiffness: 300 }}
                                                    className="bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-600/50 rounded-lg p-4 mb-4 backdrop-blur-sm shadow-lg"
                                                >
                                                    {post.workout && post.nutritionLog ? (
                                                        <div className="space-y-4">
                                                            <div className="flex items-start">
                                                                <div className="flex-shrink-0 bg-yellow-500/20 p-2 rounded-lg mr-3">
                                                                    <motion.span
                                                                        className="text-xl"
                                                                        animate={{
                                                                            scale: [1, 1.2, 1],
                                                                            rotate: [0, 5, -5, 0]
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: Infinity,
                                                                            repeatDelay: 4
                                                                        }}
                                                                    >
                                                                        🏋️
                                                                    </motion.span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <motion.h4
                                                                        className="font-semibold text-yellow-500 mb-1"
                                                                        style={{
                                                                            background: "linear-gradient(90deg, #eab308 0%, #f59e0b 100%)",
                                                                            backgroundClip: "text",
                                                                            WebkitBackgroundClip: "text",
                                                                            WebkitTextFillColor: "transparent"
                                                                        }}
                                                                    >
                                                                        Linked Workout
                                                                    </motion.h4>
                                                                    <p className="text-sm text-gray-200 font-medium">
                                                                        {post.workout.title} · {post.workout.duration} mins
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-start">
                                                                <div className="flex-shrink-0 bg-green-500/20 p-2 rounded-lg mr-3">
                                                                    <motion.span
                                                                        className="text-xl"
                                                                        animate={{
                                                                            scale: [1, 1.1, 1],
                                                                            rotate: [0, 2, -2, 0]
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: Infinity,
                                                                            repeatDelay: 4
                                                                        }}
                                                                    >
                                                                        🥗
                                                                    </motion.span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <motion.h4
                                                                        className="font-semibold text-green-500 mb-1"
                                                                        style={{
                                                                            background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
                                                                            backgroundClip: "text",
                                                                            WebkitBackgroundClip: "text",
                                                                            WebkitTextFillColor: "transparent"
                                                                        }}
                                                                    >
                                                                        Linked Nutrition
                                                                    </motion.h4>
                                                                    <p className="text-sm text-gray-200 font-medium">
                                                                        {post.nutritionLog.foodName} · {post.nutritionLog.calories} kcal
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : post.workout ? (
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 bg-yellow-500/20 p-2 rounded-lg mr-3">
                                                                <motion.span
                                                                    className="text-xl"
                                                                    animate={{
                                                                        scale: [1, 1.2, 1],
                                                                        rotate: [0, 5, -5, 0]
                                                                    }}
                                                                    transition={{
                                                                        duration: 2,
                                                                        repeat: Infinity,
                                                                        repeatDelay: 4
                                                                    }}
                                                                >
                                                                    🏋️
                                                                </motion.span>
                                                            </div>
                                                            <div>
                                                                <motion.h4
                                                                    className="font-semibold text-yellow-500 mb-1"
                                                                    style={{
                                                                        background: "linear-gradient(90deg, #eab308 0%, #f59e0b 100%)",
                                                                        backgroundClip: "text",
                                                                        WebkitBackgroundClip: "text",
                                                                        WebkitTextFillColor: "transparent"
                                                                    }}
                                                                >
                                                                    Linked Workout
                                                                </motion.h4>
                                                                <p className="text-sm text-gray-200 font-medium">
                                                                    {post.workout.title} · {post.workout.duration} mins
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 bg-green-500/20 p-2 rounded-lg mr-3">
                                                                <motion.span
                                                                    className="text-xl"
                                                                    animate={{
                                                                        scale: [1, 1.1, 1],
                                                                        rotate: [0, 2, -2, 0]
                                                                    }}
                                                                    transition={{
                                                                        duration: 2,
                                                                        repeat: Infinity,
                                                                        repeatDelay: 4
                                                                    }}
                                                                >
                                                                    🥗
                                                                </motion.span>
                                                            </div>
                                                            <div>
                                                                <motion.h4
                                                                    className="font-semibold text-green-500 mb-1"
                                                                    style={{
                                                                        background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
                                                                        backgroundClip: "text",
                                                                        WebkitBackgroundClip: "text",
                                                                        WebkitTextFillColor: "transparent"
                                                                    }}
                                                                >
                                                                    Linked Nutrition
                                                                </motion.h4>
                                                                <p className="text-sm text-gray-200 font-medium">
                                                                    {post.nutritionLog.foodName} · {post.nutritionLog.calories} kcal
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}

                                            <div className="flex items-center justify-between text-gray-400 pt-4 border-t border-gray-700/50">
                                                <div className="flex gap-6">
                                                    <motion.button
                                                        whileTap={{ scale: 1.3 }}
                                                        onClick={(e) => handleLike(post.id, e)}
                                                        className="flex items-center gap-2 transition-colors duration-300 relative group"
                                                    >
                                                        {post.likes.some(like => like.userId === currentUser?.id) ? (
                                                            <>
                                                                <HeartSolidIcon className="h-6 w-6 text-red-500" />
                                                                <motion.div
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{
                                                                        scale: [1.5, 1],
                                                                        opacity: [1, 0],
                                                                    }}
                                                                    transition={{ duration: 0.5 }}
                                                                    className="absolute inset-0 bg-red-500 rounded-full blur-md z-0"
                                                                />
                                                            </>
                                                        ) : (
                                                            <HeartIcon className="h-6 w-6 group-hover:text-red-400" />
                                                        )}
                                                        <span className="group-hover:text-red-400">{post.likes.length}</span>
                                                    </motion.button>

                                                    <div className="flex items-center gap-2 transition-colors duration-300 group">
                                                        <ChatBubbleLeftIcon className="h-6 w-6" />
                                                        <span>{post.comments.length}</span>
                                                        {post.comments.length > 0 && (
                                                            <span className="absolute scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 bg-gray-700 text-xs py-1 px-2 rounded transition-all duration-300 -translate-y-8 translate-x-8">
                                                                View comments
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleBookmark(post.id, e)
                                                        }}
                                                        className="text-gray-400 transition-colors duration-300 relative group"
                                                    >
                                                        {bookmarkedPosts.includes(post.id) ? (
                                                            <BookmarkSolidIcon className="h-5 w-5 text-yellow-500" />
                                                        ) : (
                                                            <BookmarkIcon className="h-5 w-5 group-hover:text-yellow-500" />
                                                        )}
                                                        <span className="absolute right-0 whitespace-nowrap mt-1 py-1 px-2 bg-gray-700 text-xs rounded scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-8">
                                                            {bookmarkedPosts.includes(post.id) ? 'Saved' : 'Save post'}
                                                        </span>
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 relative group"
                                                    >
                                                        <ShareIcon className="h-5 w-5" />
                                                        <span className="absolute right-0 whitespace-nowrap mt-1 py-1 px-2 bg-gray-700 text-xs rounded scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-8">
                                                            Share post
                                                        </span>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {scrollDirection === "down" && posts.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 20px rgba(234, 179, 8, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-900 p-4 rounded-full shadow-lg shadow-yellow-600/20"
                    >
                        <PlusIcon className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SocialFeed;