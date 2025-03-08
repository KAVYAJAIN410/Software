import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function TeacherMaterials() {
  const { data: session } = useSession();
  const [materials, setMaterials] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/materials", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.email}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setMaterials(data.materials || []))
        .catch((error) => console.error("Error fetching materials:", error));
    }
  }, [session]);

  // ✅ Function to generate correct Cloudinary preview URL
  const getPreviewUrl = (fileUrl) => {
    if (!fileUrl) return "";
    
    if (fileUrl.endsWith(".pdf")) {
      // ✅ Cloudinary PDF Viewer
      return `https://res.cloudinary.com/dfrb2fapb/image/upload/fl_attachment/${fileUrl}`;
    } else {
      // ✅ Cloudinary Image Transformation (Auto resize)
      return fileUrl.replace("/upload/", "/upload/w_800,h_600,c_fit/");
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">📚 Uploaded Materials</h2>

      {materials.length === 0 ? (
        <p className="text-gray-600">No materials uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {materials.map((material) => (
            <li key={material._id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-bold text-lg">{material.Title}</h3>
              <p className="text-gray-600">{material.Description}</p>

              {material.fileUrl ? (
                <div className="mt-3 flex space-x-4">
                  {/* Preview Button */}
                  <button
                    onClick={() => setPreviewUrl(getPreviewUrl(material.fileUrl))}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
                  >
                    👀 Preview
                  </button>

                  {/* Download Button */}
                  <a
                    href={material.fileUrl}
                    download
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    📥 Download
                  </a>
                </div>
              ) : (
                <p className="text-red-500 mt-2">File not available</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Preview Modal Overlay */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✖ Close
            </button>

            <div className="mt-4">
              {previewUrl.endsWith(".pdf") ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[500px] rounded-lg"
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-[500px] rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
