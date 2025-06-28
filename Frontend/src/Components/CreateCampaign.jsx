import { useState } from "react";
import axios from "axios";

export default function CreateCampaign() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    organizer: "",
    beneficiaryName: "",
    medicalCondition: "",
    email: "",
    phone: "",
    story: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDocumentChange = (e) => {
    setDocuments([...e.target.files]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = Object.values(form).every((val) => val.trim() !== "");
  if (!isValid) {
    setStatus({ success: false, message: "Please fill in all required fields." });
    return;
  }

  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (key === "goal") {
      formData.append(key, Number(value));
    } else {
      formData.append(key, value);
    }
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  documents.forEach((doc) => {
    formData.append("documents", doc);
  });

  try {
    const token = localStorage.getItem("token"); // ✅ Get token from storage

    const response = await axios.post("http://localhost:5000/api/campaigns", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // ✅ Include token in headers
      },
    });

    setStatus({ success: true, message: "Campaign created successfully!" });

    // Reset form
    setForm({
      title: "",
      description: "",
      goal: "",
      organizer: "",
      beneficiaryName: "",
      medicalCondition: "",
      email: "",
      phone: "",
      story: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setDocuments([]);
  } catch (err) {
    console.error("Submission Error:", err.response?.data || err.message);
    setStatus({
      success: false,
      message: err.response?.data?.error || "Server error. Please try again.",
    });
  }
};


  return (
    <div className="container py-5 mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="mb-4 text-center text-primary">Start a Fundraiser</h2>

          {status && (
            <div
              className={`alert ${status.success ? "alert-success" : "alert-danger"}`}
              role="alert"
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Campaign Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. Help Raju Fight Cancer"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Goal Amount (₹)</label>
                <input
                  type="number"
                  name="goal"
                  required
                  value={form.goal}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="500000"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Short Description</label>
                <textarea
                  name="description"
                  required
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="form-control"
                  placeholder="Briefly describe the fundraiser"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Organizer Name</label>
                <input
                  type="text"
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Your name"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Beneficiary Name</label>
                <input
                  type="text"
                  name="beneficiaryName"
                  value={form.beneficiaryName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Who needs help?"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Medical Condition</label>
                <input
                  type="text"
                  name="medicalCondition"
                  value={form.medicalCondition}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., Kidney Failure"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="you@example.com"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="+91XXXXXXXXXX"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Detailed Story (optional)</label>
                <textarea
                  name="story"
                  value={form.story}
                  onChange={handleChange}
                  rows={4}
                  className="form-control"
                  placeholder="Describe the situation in detail"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Upload Campaign Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 img-thumbnail"
                    style={{ height: 150 }}
                  />
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Upload Documents (if any)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple
                  onChange={handleDocumentChange}
                  className="form-control"
                />
                {documents.length > 0 && (
                  <ul className="mt-2 list-unstyled small text-muted">
                    {documents.map((doc, i) => (
                      <li key={i}>📎 {doc.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-12 mt-3">
                <button type="submit" className="btn btn-primary w-100 py-2">
                  Submit Fundraiser
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
