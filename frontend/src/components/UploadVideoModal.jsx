import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const UploadVideoModal = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.videoFile[0]) formData.append("videoFile", data.videoFile[0]);
    if (data.thumbnail[0]) formData.append("thumbnail", data.thumbnail[0]);

    try {
      await api.post('/videos', formData);
      toast.success("Video uploaded successfully!");
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl border border-surfaceHover overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-surfaceHover bg-surface">
          <h2 className="text-xl font-bold text-white">Upload Video</h2>
          <button onClick={onClose} className="p-2 hover:bg-surfaceHover rounded-full text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title (Required)</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-surfaceHover px-4 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Add a title that describes your video"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description (Required)</label>
                <textarea 
                  className="w-full bg-background border border-surfaceHover px-4 py-2 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors resize-none h-32"
                  placeholder="Tell your viewers about your video"
                  {...register("description", { required: "Description is required" })}
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Video File (Required)</label>
                  <label className="w-full bg-background border border-dashed border-surfaceHover overflow-hidden rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-surfaceHover file:text-white cursor-pointer"
                      {...register("videoFile", { required: "Video is required" })}
                    />
                  </label>
                  {errors.videoFile && <p className="text-red-500 text-xs mt-1">{errors.videoFile.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail (Required)</label>
                  <label className="w-full bg-background border border-dashed border-surfaceHover overflow-hidden rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-surfaceHover file:text-white cursor-pointer"
                      {...register("thumbnail", { required: "Thumbnail is required" })}
                    />
                  </label>
                  {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-surfaceHover mt-6">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-medium text-white hover:bg-surfaceHover transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-medium text-white transition-colors flex items-center"
              >
                {loading ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoModal;
