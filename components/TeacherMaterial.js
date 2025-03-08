import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function TeacherMaterials() {
  const { data: session } = useSession();
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/materials", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.email}`,
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => setMaterials(data.materials || []))
        .catch((error) => console.error("Error fetching materials:", error));
    }
  }, [session]);

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

              {material.fileId ? (
                <a
                  href={material.fileUrl} // ✅ Use Cloudinary URL directly
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                  📥 Download
                </a>
              ) : (
                <p className="text-red-500 mt-2">File not available</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
