import axios from "axios";
import { useSelector } from "react-redux";
import { useState, useEffect, ChangeEvent } from "react";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast"; // Assuming you are using react-hot-toast for notifications

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
        const response = await axios.get("http://localhost:7000/api/v1/users/sellercategory");
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
      await axios.post("http://localhost:7000/api/v1/requests", formData, {
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
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 w-3/4 p-4 border border-gray-300 rounded-xl shadow-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <div className="flex justify-between items-center mb-4">
        <IoArrowBack className="text-3xl cursor-pointer" />
        <p className="text-3xl font-bold text-black p-2">Create Request</p>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600"
          disabled={loading}
        >
          Request
        </button>
      </div>
      <div className="relative flex flex-col items-center justify-center bg-gray-300 p-4 rounded-lg">
        <div className="flex justify-start">
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="text-2xl text-black p-2">{user?.username}</p>
        </div>
        <textarea
          className="w-full h-32 p-2 shadow-2xl rounded-lg mb-4"
          value={request.content}
          onChange={(e) => setRequest({ ...request, content: e.target.value })}
          placeholder="What's on your mind?"
        ></textarea>
        {request.mediaPreview && (
          <div className="relative w-full mb-4">
            <img
              src={request.mediaPreview}
              alt="Selected media"
              className="w-full max-h-48 object-contain rounded-lg shadow-xl"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              &times;
            </button>
          </div>
        )}
        <label className="w-full flex items-center justify-center bg-white p-2 rounded-lg shadow-2xl cursor-pointer hover:bg-gray-100">
          <span className="text-gray-700">Upload Media</span>
          <input
            type="file"
            className="hidden"
            onChange={handleMediaChange}
            accept="image/*"
          />
        </label>
        <div className="flex flex-col w-full mt-4">
          <label className="text-gray-700" htmlFor="category">
            Enter your product Categories
          </label>
          <div className="flex items-center mt-2">
            <input
              type="text"
              name="category"
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={categoryInput}
              onChange={handleCategoryInputChange}
              disabled={loading}
            />
            <button
              type="button"
              className="ml-2 py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => handleAddCategory(categoryInput)}
              disabled={loading || !availableCategories.includes(categoryInput.trim())}
            >
              Add
            </button>
          </div>
          {categoryNotAvailable && (
            <p className="text-red-500 mt-2 text-sm">{categoryInput} Category not available</p>
          )}
          {suggestions.length > 0 && (
            <div className="bg-white border border-gray-300 rounded-md shadow-md mt-2 w-full max-h-40 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleAddCategory(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {request.category.map((category, index) => (
              <div key={index} className="flex items-center bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">
                <span>{category}</span>
                <button
                  type="button"
                  className="ml-2 text-red-600"
                  onClick={() => handleRemoveCategory(category)}
                  disabled={loading}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
