import apiClient from './apiClient';

export const userService = {
    register: (data) => apiClient.post('/users/register', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    login: (data) => apiClient.post('/users/login', data),
    logout: () => apiClient.post('/users/logout'),
    getCurrentUser: () => apiClient.get('/users/current-user'),
    changePassword: (data) => apiClient.post('/users/change-password', data),
    updateAccount: (data) => apiClient.patch('/users/update-account', data),
    updateAvatar: (data) => apiClient.patch('/users/update-avatar', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateCoverImage: (data) => apiClient.patch('/users/update-coverImage', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getChannelProfile: (username) => apiClient.get(`/users/c/${username}`),
    getWatchHistory: () => apiClient.get('/users/history'),
};

export const videoService = {
    getAllVideos: (params) => apiClient.get('/videos', { params }), // limit, page, query, sortBy, sortType, userId
    publishVideo: (data) => apiClient.post('/videos', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getVideoById: (videoId) => apiClient.get(`/videos/${videoId}`),
    updateVideo: (videoId, data) => apiClient.patch(`/videos/${videoId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteVideo: (videoId) => apiClient.delete(`/videos/${videoId}`),
    togglePublishStatus: (videoId) => apiClient.patch(`/videos/toggle/publish/${videoId}`),
};

export const tweetService = {
    createTweet: (data) => apiClient.post('/tweets', data),
    getUserTweets: (userId) => apiClient.get(`/tweets/user/${userId}`),
    updateTweet: (tweetId, data) => apiClient.patch(`/tweets/${tweetId}`, data),
    deleteTweet: (tweetId) => apiClient.delete(`/tweets/${tweetId}`),
};

export const commentService = {
    getVideoComments: (videoId, params) => apiClient.get(`/comments/${videoId}`, { params }), 
    addComment: (videoId, data) => apiClient.post(`/comments/${videoId}`, data),
    updateComment: (commentId, data) => apiClient.patch(`/comments/c/${commentId}`, data),
    deleteComment: (commentId) => apiClient.delete(`/comments/c/${commentId}`),
};

export const likeService = {
    toggleVideoLike: (videoId) => apiClient.post(`/likes/toggle/v/${videoId}`),
    toggleCommentLike: (commentId) => apiClient.post(`/likes/toggle/c/${commentId}`),
    toggleTweetLike: (tweetId) => apiClient.post(`/likes/toggle/t/${tweetId}`),
    getLikedVideos: () => apiClient.get('/likes/videos'),
};

export const playlistService = {
    createPlaylist: (data) => apiClient.post('/playlists', data),
    getUserPlaylists: (userId) => apiClient.get(`/playlists/user/${userId}`),
    getPlaylistById: (playlistId) => apiClient.get(`/playlists/${playlistId}`),
    addVideoToPlaylist: (videoId, playlistId) => apiClient.patch(`/playlists/add/${videoId}/${playlistId}`),
    removeVideoFromPlaylist: (videoId, playlistId) => apiClient.patch(`/playlists/remove/${videoId}/${playlistId}`),
    deletePlaylist: (playlistId) => apiClient.delete(`/playlists/${playlistId}`),
    updatePlaylist: (playlistId, data) => apiClient.patch(`/playlists/${playlistId}`, data),
};

export const subscriptionService = {
    getSubscribedChannels: (subscriberId) => apiClient.get(`/subscriptions/c/${subscriberId}`), 
    getUserChannelSubscribers: (channelId) => apiClient.get(`/subscriptions/u/${channelId}`),
    toggleSubscription: (channelId) => apiClient.post(`/subscriptions/c/${channelId}`),
};

export const dashboardService = {
    getChannelStats: () => apiClient.get('/dashboard/stats'),
    getChannelVideos: () => apiClient.get('/dashboard/videos'),
};
