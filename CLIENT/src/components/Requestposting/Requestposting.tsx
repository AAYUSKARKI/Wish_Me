import axios from "axios";
import { useSelector } from "react-redux";
import { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "../Sidebar/Sidebar";
import toast from "react-hot-toast";

interface Request {
  content: string;
  media: File | null;
  mediaPreview: string;
  category: string[];
}

const CreateRequest: React.FC = () => {
  const { user } = useSelector((state: any) => state.user);

  const [request, setRequest] = useState<Request>({
    content: "",
    media: null,
    mediaPreview: "",
    category: [],
  });
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [categoryNotAvailable, setCategoryNotAvailable] = useState(false);

  useEffect(() => {
    const fetchSellerCategories = async () => {
      try {
        const response = await axios.get("https://wish-me-65k8.onrender.com/api/v1/users/sellercategory");
        if (response.data.success) {
          setAvailableCategories(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch seller categories", error);
      }
    };

    fetchSellerCategories();
  }, []);

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRequest({
        ...request,
        media: file,
        mediaPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveImage = () => {
    setRequest({
      ...request,
      media: null,
      mediaPreview: "",
    });
  };

  const handleAddCategory = (category: string) => {
    if (category.trim() && !request.category.includes(category.trim())) {
      setRequest({
        ...request,
        category: [...request.category, category.trim()],
      });
      setCategoryInput("");
      setSuggestions([]);
      setCategoryNotAvailable(false);
    }
  };

  const handleRemoveCategory = (category: string) => {
    setRequest({
      ...request,
      category: request.category.filter(cat => cat !== category),
    });
  };

  const handleCategoryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCategoryInput(input);

    if (input.trim()) {
      const filteredSuggestions = availableCategories.filter(category =>
        category.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setCategoryNotAvailable(filteredSuggestions.length === 0);
    } else {
      setSuggestions([]);
      setCategoryNotAvailable(false);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("content", request.content);
    if (request.media) {
      formData.append("media", request.media);
    }
    formData.append("createdBy", user?._id);
    formData.append("category", JSON.stringify(request.category));

    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      await axios.post("https://wish-me-65k8.onrender.com/api/v1/requests", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Request created successfully!");
      // Clear the form after successful submission
      setRequest({
        content: "",
        media: null,
        mediaPreview: "",
        category: [],
      });
    } catch (error) {
      toast.error("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen dark:bg-gray-950">
      <Sidebar />
      <div className="w-full lg:w-2/3 mx-auto mt-[75px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="ml-4 text-lg font-semibold text-gray-700 dark:text-white">{user?.username}</p>
        </div>
        <textarea
          className="w-full h-[9rem] p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 resize-none"
          value={request.content}
          onChange={(e) => setRequest({ ...request, content: e.target.value })}
          placeholder="What do you want?"
        ></textarea>
        {request.mediaPreview && (
          <div className="relative mt-4">
            <img
              src={request.mediaPreview}
              alt="Selected media"
              className="w-full max-h-60 object-contain rounded-lg shadow-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              &times;
            </button>
          </div>
        )}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
          <label className="cursor-pointer flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
            <span>Upload Media</span>
            <input
              type="file"
              className="hidden"
              onChange={handleMediaChange}
              accept="image/*"
            />
          </label>
          <div className="mt-4 sm:mt-0 sm:ml-4 w-full">
            <label className="text-gray-700 dark:text-gray-300" htmlFor="category">
              Product Categories
            </label>
            <div className="relative">
              <input
                type="text"
                name="category"
                id="category"
                className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                value={categoryInput}
                onChange={handleCategoryInputChange}
                disabled={loading}
                placeholder="Enter or select categories"
              />
              {categoryNotAvailable && (
                <p className="text-red-500 mt-2 text-sm dark:text-red-400">{categoryInput} Category not available</p>
              )}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-md max-h-40 overflow-auto z-10">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleAddCategory(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {request.category.map((category, index) => (
            <div key={index} className="flex items-center bg-indigo-200 dark:bg-indigo-600 text-indigo-800 dark:text-white px-2 py-1 rounded-full">
              <span>{category}</span>
              <button
                type="button"
                className="ml-2 text-red-600 dark:text-red-400"
                onClick={() => handleRemoveCategory(category)}
                disabled={loading}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            Post Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
