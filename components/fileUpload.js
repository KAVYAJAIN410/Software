import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title || !description) return alert("All fields are required!");
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("Title", title);
    formData.append("Description", description);
  
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData, // ✅ No need to set `Content-Type`, Fetch will handle it
        headers: {
          Authorization: `Bearer ${session?.user?.email}`,
        },
      });
  
      const data = await response.json();
      console.log("✅ Upload Response:", data);
  
      if (response.ok) {
        setMessage(`Uploaded: ${title}`);
      } else {
        setMessage("Upload failed!");
      }
    } catch (error) {
      console.error("🔥 Upload Error:", error);
      setMessage("Upload failed!");
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">Upload Course Material</h2>
      <input type="text" placeholder="Title" value={title} onChange={handleTitleChange} className="mt-2 p-2 border rounded" />
      <input type="text" placeholder="Description" value={description} onChange={handleDescriptionChange} className="mt-2 p-2 border rounded" />
      <input type="file" onChange={handleFileChange} className="mt-2 p-2 border rounded" />
      <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Upload
      </button>
      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
}
