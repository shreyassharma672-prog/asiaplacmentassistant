import { Upload } from "lucide-react";
import Card from "./Card";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500";

const textareaClass = `${inputClass} min-h-28 resize-y leading-6`;

const personalFields = [
  { name: "name", label: "Full Name", placeholder: "Your full name" },
  { name: "email", label: "Email", placeholder: "you@example.com", type: "email" },
  { name: "phone", label: "Phone", placeholder: "+91 XXXXX XXXXX" },
  { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/yourprofile" },
  { name: "github", label: "GitHub", placeholder: "github.com/yourusername" },
];

const professionalFields = [
  { name: "education", label: "Education", placeholder: "Degree, college, CGPA, graduation year" },
  { name: "skills", label: "Skills", placeholder: "React, JavaScript, SQL, Python, communication" },
  { name: "projects", label: "Projects", placeholder: "Project name, tech stack, impact, responsibilities" },
  { name: "experience", label: "Experience", placeholder: "Internships, work experience, responsibilities" },
  { name: "achievements", label: "Achievements", placeholder: "Awards, hackathons, leadership, measurable wins" },
  { name: "certifications", label: "Certifications", placeholder: "Courses, certifications, workshops" },
];

function Field({ field, value, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
        {field.label}
      </span>
      <input
        className={inputClass}
        type={field.type || "text"}
        name={field.name}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder}
      />
    </label>
  );
}

function TextAreaField({ field, value, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
        {field.label}
      </span>
      <textarea
        className={textareaClass}
        name={field.name}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder}
      />
    </label>
  );
}

export default function ResumeForm({
  formData,
  jobDescription,
  profilePhoto,
  onChange,
  onJobDescriptionChange,
  onPhotoUpload,
}) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">
            Resume Inputs
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            Candidate Details
          </h2>
        </div>
        <label className="grid h-12 w-12 cursor-pointer place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
          <Upload size={20} />
          <input type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} />
        </label>
      </div>

      {profilePhoto && (
        <div className="mb-6 flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <img src={profilePhoto} alt="Profile" className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <p className="font-bold text-slate-950 dark:text-white">Profile photo added</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              It appears in the live preview and PDF export.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {personalFields.map((field) => (
              <Field
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={onChange}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Professional Information
          </h3>
          <div className="grid gap-4">
            {professionalFields.map((field) => (
              <TextAreaField
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={onChange}
              />
            ))}
          </div>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Job Description <span className="font-medium text-slate-400">(Optional)</span>
          </span>
          <textarea
            className={`${textareaClass} min-h-40`}
            value={jobDescription}
            onChange={onJobDescriptionChange}
            placeholder="Paste a target job description to personalize the AI-generated resume..."
          />
        </label>
      </div>
    </Card>
  );
}
