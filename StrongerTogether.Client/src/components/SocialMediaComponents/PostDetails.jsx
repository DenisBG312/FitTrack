import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  BookmarkIcon, 
  ShareIcon, 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { 
  HeartIcon as HeartSolidIcon, 
  BookmarkIcon as BookmarkSolidIcon 
} from "@heroicons/react/24/solid";
import moment from "moment";
import axios from "axios";
import CreateComment from "./CreateComment";

const Comment = ({ 
  comment, 
  currentUser, 
  onDelete, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = comment.user?.id === currentUser?.id;

  const handleUpdate = async () => {
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
    <div className="flex gap-3">
      <img
        // eslint-disable-next-line no-constant-binary-expression
        src={`https://localhost:7039/${comment.user?.profileImageUrl}` || "/default-avatar.png"}
        alt={comment.user?.username}
        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
      />
      <div className="flex-1">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <Link 
                to={`/profile/${comment.user?.id}`}
                className="font-semibold text-sm hover:text-yellow-500"
              >
                {comment.user?.username}
              </Link>
              <span className="text-xs text-gray-400">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
            
            {isOwner && !isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-yellow-500"
                  title="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-red-500"
                  title="Delete"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-red-500 rounded-full"></div>
                  ) : (
                    <TrashIcon className="h-4 w-4" />
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
                className="w-full bg-gray-800 text-gray-100 rounded p-2"
                rows="3"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-1 bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                  disabled={!editedContent.trim()}
                >
                  <CheckIcon className="h-3 w-3" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 bg-gray-600 text-white px-2 py-1 rounded text-sm"
                >
                  <XMarkIcon className="h-3 w-3" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-200">{comment.content}</p>
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
  const [bookmarked, setBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const postResponse = await axios.get(`${API_URL}/Post/${postId}`);
        setPost(postResponse.data);
        
        const commentsResponse = await axios.get(`${API_URL}/Comment/post/${postId}`);
        setComments(commentsResponse.data);
        
        const userResponse = await axios.get(`${API_URL}/auth/profile`, {
          withCredentials: true
        });
        setCurrentUser({
          id: userResponse.data.id,
          username: userResponse.data.username,
          profileImageUrl: userResponse.data.profileImageUrl
        });

        // Check if user has liked the post
        const likeCheck = postResponse.data.likes?.some(
          like => like.userId === userResponse.data.id
        );
        setIsLiked(likeCheck);
        setLikeCount(postResponse.data.likes?.length || 0);

        // Check if post is bookmarked
        try {
          const bookmarkResponse = await axios.get(`${API_URL}/Bookmark/check/${postId}`, {
            withCredentials: true
          });
          setBookmarked(bookmarkResponse.data.isBookmarked);
        } catch (bookmarkErr) {
          console.error("Error checking bookmark:", bookmarkErr);
        }
        
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
    setComments([...comments, newComment]);
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
    if (!currentUser) return;

    try {
      if (isLiked) {
        // Unlike the post
        await axios.delete(`${API_URL}/Post/${postId}/like`, {
          withCredentials: true
        });
        setLikeCount(prev => prev - 1);
      } else {
        // Like the post
        await axios.post(`${API_URL}/Post/${postId}/like`, {}, {
          withCredentials: true
        });
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) return;

    try {
      if (bookmarked) {
        await axios.delete(`${API_URL}/Bookmark/${postId}`, {
          withCredentials: true
        });
      } else {
        await axios.post(`${API_URL}/Bookmark/${postId}`, {}, {
          withCredentials: true
        });
      }
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error("Error bookmarking post:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-gray-800 rounded-lg text-red-400">
        {error}
        <Link to="/" className="block mt-4 text-yellow-500 hover:underline">
          ← Back to feed
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-gray-800 rounded-lg text-gray-300">
        Post not found
        <Link to="/" className="block mt-4 text-yellow-500 hover:underline">
          ← Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 min-h-screen text-gray-100">
      <div className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur-sm p-4 border-b border-gray-700 flex items-center">
        <Link to="/community" className="mr-4 text-yellow-500 hover:text-yellow-400">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Post Details</h1>
      </div>

      <div className="p-4 border-b border-gray-700">
        <div className="flex items-start gap-3 mb-4">
          <img
            src={post.user?.profileImageUrl || "/default-avatar.png"}
            alt={post.user?.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-600"
          />
          <div>
            <Link 
              to={`/profile/${post.user?.id}`}
              className="font-semibold hover:text-yellow-500"
            >
              {post.user?.username}
            </Link>
            <p className="text-xs text-gray-400">
              {moment(post.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="whitespace-pre-line">{post.content}</p>
        </div>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full h-auto rounded-lg mb-4"
          />
        )}

        {(post.workout || post.nutritionLog) && (
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            {post.workout && (
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <span className="text-xl">🏋️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-500">Workout</h3>
                  <p className="text-sm">{post.workout.title}</p>
                  <p className="text-xs text-gray-400">{post.workout.duration} minutes</p>
                </div>
              </div>
            )}
            {post.nutritionLog && (
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <span className="text-xl">🥗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-500">Nutrition</h3>
                  <p className="text-sm">{post.nutritionLog.foodName}</p>
                  <p className="text-xs text-gray-400">{post.nutritionLog.calories} calories</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <div className="flex gap-4">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1"
              disabled={!currentUser}
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

            <div className="flex items-center gap-1 text-gray-400">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{comments.length}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleBookmark}
              className={bookmarked ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}
              disabled={!currentUser}
            >
              {bookmarked ? (
                <BookmarkSolidIcon className="h-5 w-5" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
            </button>
            <button className="text-gray-400 hover:text-yellow-500">
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold mb-4">Comments ({comments.length})</h3>
        
        {currentUser && (
          <CreateComment 
            postId={postId} 
            onCommentCreated={handleCommentCreated} 
          />
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
            <p className="text-gray-400 text-center py-4">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;