import React, { useState } from "react";
import axios from "axios";

const CreateComment = ({ postId, onCommentCreated }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `https://localhost:7039/api/Comment`,
                { postId, content },
                { withCredentials: true }
            );
            
            onCommentCreated(response.data);
            setContent("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post comment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows={2}
                    required
                />
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="self-end bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>
            {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </form>
    );
};

export default CreateComment;