import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import moment from 'moment'
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react'

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchVideoData();
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${videoId}`)
      setComments(res.data.data?.comments || res.data.data?.docs || [])
    } catch (err) {
      console.error("Comments error", err)
    }
  }

  const fetchVideoData = async () => {
    try {
      const vidRes = await api.get(`/videos/${videoId}`);
      setVideo(vidRes.data.data);
    } catch (error) {
      toast.error("Failed to load video details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    try {
      await api.post(`/subscriptions/c/${video.owner._id}`);
      toast.success("Subscription toggled");
    } catch {
      toast.error("Failed to update subscription");
    }
  };

  const handleLike = async () => {
    if (!video) return;
    try {
      await api.post(`/likes/toggle/v/${video._id}`);
      toast.success("Like toggled");
    } catch {
      toast.error("Failed to like video");
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      await api.post(`/comments/${videoId}`, { content: commentText });
      toast.success("Comment added");
      setCommentText("");
      const comRes = await api.get(`/comments/${videoId}`);
      setComments(comRes.data.data.docs || comRes.data.data || []);
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-400">Loading...</div>;
  if (!video) return <div className="p-4 text-center text-gray-400">Video not found. It might be private or deleted.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 text-white max-w-[1600px] mx-auto">
      <div className="flex-1">
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden mb-4 shadow-lg border border-surface">
          <video src={video.videoFile} controls autoPlay className="w-full h-full object-contain" poster={video.thumbnail}></video>
        </div>
        
        <h1 className="text-xl font-bold mb-2 break-words">{video.title}</h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface pb-4 mb-4">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <Link to={`/channel/${video.owner?.username}`} className="flex items-center gap-3 group">
              <img src={video.owner?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-surfaceHover group-hover:border-blue-500 transition-all" />
              <div>
                <h3 className="font-semibold group-hover:text-blue-400 transition-colors">{video.owner?.fullName || video.owner?.username || "Unknown Channel"}</h3>
                <p className="text-xs text-gray-400">Subscribers</p>
              </div>
            </Link>
            <button onClick={handleSubscribe} className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors ml-2 shadow-md">
              Subscribe
            </button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button onClick={handleLike} className="flex items-center gap-2 bg-surface hover:bg-surfaceHover px-4 py-2 rounded-full transition-colors font-medium">
              <ThumbsUp className="w-5 h-5" />
              <span>Like</span>
            </button>
            <button className="flex items-center gap-2 bg-surface hover:bg-surfaceHover px-4 py-2 rounded-full transition-colors font-medium">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button className="bg-surface hover:bg-surfaceHover p-2 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-surface hover:bg-surfaceHover transition-colors p-4 rounded-xl mb-6 cursor-pointer">
          <p className="font-semibold text-sm mb-1 text-gray-200">{video.views} views &bull; {moment(video.createdAt).format("MMM D, YYYY")}</p>
          <p className="text-sm whitespace-pre-wrap text-gray-300">{video.description}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            {comments.length} Comments
          </h3>
          
          <div className="flex gap-4 mb-8">
            <img src={user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-surfaceHover" />
            <form onSubmit={submitComment} className="flex-1 flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-transparent border-b border-surfaceHover focus:border-white focus:outline-none py-1 text-sm font-medium placeholder-gray-400 transition-colors"
                disabled={!user}
              />
              {!user && <p className="text-xs text-red-400 mt-1">Please login to comment.</p>}
              {commentText && (
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setCommentText("")} className="px-4 py-2 rounded-full text-sm font-medium hover:bg-surface transition-colors">Cancel</button>
                  <button type="submit" disabled={submittingComment || !user} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                    Comment
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="flex flex-col gap-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <Link to={`/channel/${comment.owner?.username}`}>
                  <img src={comment.owner?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-surfaceHover" />
                </Link>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[13px] bg-slate-800 px-2 py-0.5 rounded-md">{comment.owner?.fullName || comment.owner?.username || "User"}</span>
                    <span className="text-xs text-gray-400">{moment(comment.createdAt).fromNow()}</span>
                  </div>
                  <p className="text-sm text-gray-200 mt-1">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs">Like</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] flex flex-col gap-3">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="flex gap-2 group cursor-pointer">
            <div className="w-40 aspect-video bg-surface rounded-lg flex-shrink-0 animate-pulse"></div>
            <div className="flex flex-col flex-1 py-1">
              <div className="h-4 bg-surface rounded w-full mb-2"></div>
              <div className="h-3 bg-surface rounded w-2/3 mb-1"></div>
              <div className="h-3 bg-surface rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VideoDetail
