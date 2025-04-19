import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  HeartIcon, 
  ChatBubbleLeftIcon,
  ShareIcon, 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { 
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import moment from "moment";
import axios from "axios";
import CreateComment from "./CreateComment";
import LoadingSpinner from "../LoadingSpinner";

const Comment = ({ comment, currentUser, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = comment.user?.id === currentUser?.id;

  const handleUpdate = async () => {
    if (!editedContent.trim()) return;
    
    try {
      await onUpdate(comment.id, editedContent);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id);
      } catch (err) {
        console.error("Error deleting comment:", err);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex gap-2 md:gap-3 animate-fadeIn">
      <div className="flex-shrink-0">
        <img
          // eslint-disable-next-line no-constant-binary-expression
          src={`https://localhost:7039/${comment.user?.profileImageUrl}` || "/default-avatar.png"}
          alt={comment.user?.username}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-yellow-500"
          onError={(e) => {e.target.src = "/default-avatar.png"}}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-700/80 backdrop-blur-sm rounded-lg p-2 md:p-3 transition-all hover:bg-gray-700">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link 
                to={`/profile/${comment.user?.id}`}
                className="font-semibold text-sm hover:text-yellow-400 transition-colors"
              >
                {comment.user?.username}
              </Link>
              <span className="text-xs text-gray-400">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
            
            {isOwner && !isEditing && (
              <div className="flex gap-1 md:gap-2 ml-2 flex-shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors p-1"
                  title="Edit"
                >
                  <PencilIcon className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="animate-spin h-3 w-3 md:h-4 md:w-4 border-t-2 border-b-2 border-red-500 rounded-full"></div>
                  ) : (
                    <TrashIcon className="h-3 w-3 md:h-4 md:w-4" />
                  )}
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full bg-gray-800 text-gray-100 rounded p-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm md:text-base transition-shadow"
                rows="3"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs md:text-sm transition-colors disabled:opacity-50 disabled:hover:bg-yellow-600"
                  disabled={!editedContent.trim()}
                >
                  <CheckIcon className="h-3 w-3" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                  }}
                  className="flex items-center gap-1 bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs md:text-sm transition-colors"
                >
                  <XMarkIcon className="h-3 w-3" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-200 text-sm md:text-base break-words">{comment.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const PostDetails = () => {
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const postResponse = await axios.get(`${API_URL}/Post/${postId}`);
        setPost(postResponse.data);
        
        const commentsResponse = await axios.get(`${API_URL}/Comment/post/${postId}`);
        const sortedComments = commentsResponse.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
        
        try {
          const userResponse = await axios.get(`${API_URL}/auth/profile`, {
            withCredentials: true
          });
          setCurrentUser({
            id: userResponse.data.id,
            username: userResponse.data.username,
            profileImageUrl: userResponse.data.profileImageUrl
          });

          const likeCheck = postResponse.data.likes?.some(
            like => like.userId === userResponse.data.id
          );
          setIsLiked(likeCheck);
        } catch (authErr) {
          console.log("User not authenticated:", authErr);
        }

        setLikeCount(postResponse.data.likes?.length || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
        console.error("Error fetching post details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, postId]);

  const handleCommentCreated = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/Comment/${commentId}`, {
        withCredentials: true
      });
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      throw err;
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      const response = await axios.put(
        `${API_URL}/Comment/${commentId}`,
        { content: newContent },
        { withCredentials: true }
      );
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, content: newContent } : c
      ));
      return response.data;
    } catch (err) {
      console.error("Error updating comment:", err);
      throw err;
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      if (window.confirm("Please login to like posts. Go to login page?")) {
        window.location.href = "/login";
      }
      return;
    }
  
    try {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  
      if (isLiked) {
        await axios.delete(`${API_URL}/Post/${postId}/like`, {
          withCredentials: true
        });
      } else {
        await axios.post(`${API_URL}/Post/${postId}/like`, {}, {
          withCredentials: true
        });
      }
    } catch (err) {
      console.error(`Error ${isLiked ? 'removing' : 'adding'} like:`, err);
      
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      
      setError(`Failed to ${isLiked ? 'remove' : 'add'} like. Please try again.`);
      
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 mt-4 bg-gray-800 rounded-lg text-red-400 animate-fadeIn">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium">{error}</h3>
          <Link to="/" className="mt-4 inline-block text-yellow-500 hover:text-yellow-400 transition-colors">
            ← Back to feed
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-4 mt-4 bg-gray-800 rounded-lg text-gray-300 animate-fadeIn">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium">Post not found</h3>
          <Link to="/" className="mt-4 inline-block text-yellow-500 hover:text-yellow-400 transition-colors">
            ← Back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 md:bg-gray-800 min-h-screen text-gray-100 animate-fadeIn">
      <div className="sticky top-0 z-10 bg-gray-800 bg-opacity-95 backdrop-blur-md p-3 md:p-4 border-b border-gray-700 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <Link to="/community" className="mr-3 text-yellow-500 hover:text-yellow-400 transition-colors p-1">
            <ArrowLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <h1 className="text-lg md:text-xl font-bold truncate">{post.title}</h1>
        </div>
      </div>

      <div className="p-3 md:p-4 border-b border-gray-700">
        <div className="flex items-start gap-3 mb-4">
          <Link to={`/profile/${post.user?.id}`}>
            <img
              src={post.user?.profileImageUrl || "/default-avatar.png"}
              alt={post.user?.username}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-yellow-500 transition-transform hover:scale-105"
              onError={(e) => {e.target.src = "/default-avatar.png"}}
            />
          </Link>
          <div>
            <Link 
              to={`/profile/${post.user?.id}`}
              className="font-semibold hover:text-yellow-400 transition-colors"
            >
              {post.user?.username}
            </Link>
            <p className="text-xs text-gray-400">
              {moment(post.createdAt).format('MMM D, YYYY [at] h:mm A')} · {moment(post.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-yellow-500">{post.title}</h2>
          <p className="whitespace-pre-line text-sm md:text-base">{post.content}</p>
        </div>

        {post.imageUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-700 flex justify-center items-center">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                  <p className="text-xs mt-2 text-yellow-500">Loading image...</p>
                </div>
              </div>
            )}
            <img
              src={post.imageUrl}
              alt="Post content"
              className={`w-full h-auto max-h-96 object-contain rounded-lg transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/image-placeholder.png";
                setImageLoaded(true);
              }}
            />
          </div>
        )}

        {(post.workout || post.nutritionLog) && (
          <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-4 border border-gray-700 shadow-inner">
            {post.workout && (
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg flex-shrink-0">
                  <span className="text-xl">🏋️</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-500">Workout</h3>
                  <p className="text-sm md:text-base">{post.workout.title}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-md">
                      {post.workout.duration} minutes
                    </span>
                    {post.workout.intensity && (
                      <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-md">
                        {post.workout.intensity} intensity
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {post.nutritionLog && (
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg flex-shrink-0">
                  <span className="text-xl">🥗</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-500">Nutrition</h3>
                  <p className="text-sm md:text-base">{post.nutritionLog.foodName}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-md">
                      {post.nutritionLog.calories} calories
                    </span>
                    {post.nutritionLog.protein && (
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-md">
                        {post.nutritionLog.protein}g protein
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-700">
          <div className="flex gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${!currentUser ? 'opacity-70' : ''}`}
            >
              {isLiked ? (
                <>
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  <span className="text-red-500">{likeCount}</span>
                </>
              ) : (
                <>
                  <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  <span className="text-gray-400 hover:text-red-500">{likeCount}</span>
                </>
              )}
            </button>

            <button 
              onClick={() => document.getElementById('commentsSection').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4" id="commentsSection">
        <h3 className="font-bold mb-4 text-yellow-500 flex items-center">
          <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
          Comments 
          <span className="ml-2 text-xs bg-yellow-600/30 text-yellow-500 px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        </h3>
        
        {currentUser ? (
          <CreateComment 
            postId={postId} 
            onCommentCreated={handleCommentCreated} 
          />
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4 text-center border border-gray-700">
            <p className="text-gray-300 text-sm mb-2">Sign in to join the conversation</p>
            <Link 
              to="/login" 
              className="inline-block bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-1 rounded text-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
              />
            ))
          ) : (
            <div className="text-gray-400 text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
              <ChatBubbleLeftIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet</p>
              <p className="text-sm mt-1">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 bg-yellow-600 text-white p-2 rounded-full shadow-lg hover:bg-yellow-500 transition-colors md:hidden"
        aria-label="Back to top"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default PostDetails;