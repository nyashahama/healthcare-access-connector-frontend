import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import forumService from "api/services/forumService";
import { useToast } from "hooks/useToast";
import Card from "components/card";
import {
  MdForum, MdSearch, MdAdd, MdComment, MdAccessTime, MdPerson,
} from "react-icons/md";

const ProviderCommunityForum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    forumService.getPosts({ limit: 50 }).then((data) => {
      setPosts(data.posts || []);
    }).catch(() => {
      showToast("Failed to load posts", "error");
    }).finally(() => setLoading(false));
  }, [showToast]);

  const handleViewPost = (postId) => {
    navigate(`/provider/community/post/${postId}`);
  };

  const handleCreatePost = () => {
    navigate("/provider/community/new");
  };

  const PostCard = ({ post }) => (
    <Card
      extra="p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleViewPost(post.id)}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl dark:bg-brand-900/30">
            {post.author_email?.charAt(0).toUpperCase() || "?"}
          </div>
        </div>
        <div className="flex-1">
          <h5 className="font-bold text-navy-700 dark:text-white">{post.title}</h5>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center">
              <MdPerson className="mr-1 h-3 w-3" />
              {post.author_email?.split("@")[0] || "Anonymous"}
            </span>
            <span className="flex items-center">
              <MdAccessTime className="mr-1 h-3 w-3" />
              {new Date(post.created_at).toLocaleDateString()}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
              {post.category}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-gray-600 dark:text-gray-300">{post.content}</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <MdComment className="h-4 w-4" />
              <span>{post.comment_count || 0} comments</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleViewPost(post.id); }}
              className="ml-auto text-sm font-medium text-brand-500 hover:text-brand-600">
              Join Discussion →
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">Professional Forum</h3>
        <p className="text-gray-600 dark:text-gray-300">Connect with healthcare professionals, share knowledge and discuss cases</p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search discussions..." className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-800"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button onClick={handleCreatePost} className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">
          <MdAdd className="mr-2 h-4 w-4" />New Discussion
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">{posts.length} discussions</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="border-t-transparent h-10 w-10 animate-spin rounded-full border-4 border-brand-500" /></div>
      ) : posts.length === 0 ? (
        <Card extra="p-8 text-center">
          <MdForum className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-300">No discussions yet</p>
          <button onClick={handleCreatePost} className="mt-3 text-brand-500 font-medium">Start a discussion</button>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.filter((p) => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.content || "").toLowerCase().includes(searchQuery.toLowerCase())).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderCommunityForum;
