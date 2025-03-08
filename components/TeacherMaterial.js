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

  // ✅ Generate Cloudinary preview URL
  const getPreviewUrl = (fileUrl) => {
    if (!fileUrl) return "";
    
    if (fileUrl.endsWith(".pdf")) {
      return `https://res.cloudinary.com/dfrb2fapb/image/upload/fl_attachment/${fileUrl}`;
    } else {
      return fileUrl.replace("/upload/", "/upload/w_800,h_600,c_fit/");
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-xl max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        Uploaded Materials
      </h2>

      {materials.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">No materials uploaded yet.</p>
      ) : (
        <ul className="space-y-6">
          {materials.map((material) => (
            <li key={material._id} className="p-5 border border-gray-300 rounded-xl bg-gray-50 shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-800">{material.Title}</h3>
              <p className="text-gray-600 mt-2">{material.Description}</p>

              {material.fileUrl ? (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => setPreviewUrl(getPreviewUrl(material.fileUrl))}
                    className="px-5 py-2.5 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition"
                  >
                    👀 Preview
                  </button>

                  <a
                    href={material.fileUrl}
                    download
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                  >
                    📥 Download
                  </a>
                </div>
              ) : (
                <p className="text-red-500 mt-3">File not available</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Preview Modal Overlay */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-3xl w-full relative">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✖
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
                  className="w-full h-auto max-h-[500px] rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
