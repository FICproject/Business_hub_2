import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Upload,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { jobsApi } from '../../services/api';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
const isValidDocument = (url) => {
  if (!url) return true;
  const clean = String(url).split('?')[0].toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => clean.endsWith(ext));
};

export const StudentJobApplicationModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useSelector((state) => state.auth);

  // Active step / tab in application form
  const [activeStep, setActiveStep] = useState(1);

  // 1. Personal Information
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [dob, setDob] = useState('2002-06-15');
  const [gender, setGender] = useState('Prefer not to say');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560001');

  // 2. Educational Details
  const [highestQualification, setHighestQualification] = useState('B.Tech / B.E');
  const [courseDegree, setCourseDegree] = useState('Computer Science & Engineering');
  const [specialization, setSpecialization] = useState('Software Engineering');
  const [collegeUniversity, setCollegeUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState('2025');
  const [percentageCgpa, setPercentageCgpa] = useState('');
  const [additionalQualifications, setAdditionalQualifications] = useState('');

  // 3. Professional Details
  const [experienceType, setExperienceType] = useState('fresher'); // 'fresher' | 'experienced'
  const [totalExperience, setTotalExperience] = useState('');
  const [previousCompany, setPreviousCompany] = useState('');
  const [previousRole, setPreviousRole] = useState('');
  const [technicalSkills, setTechnicalSkills] = useState('JavaScript, React, Node.js, SQL');
  const [softSkills, setSoftSkills] = useState('Problem Solving, Team Collaboration');
  const [certifications, setCertifications] = useState('');
  const [internshipDetails, setInternshipDetails] = useState('');

  // 4. Documents
  const [resumeUrl, setResumeUrl] = useState('');
  const [educationalCertificatesUrl, setEducationalCertificatesUrl] = useState('');
  const [experienceCertificatesUrl, setExperienceCertificatesUrl] = useState('');
  const [portfolioDocumentsUrl, setPortfolioDocumentsUrl] = useState('');

  // 5. Additional Information
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [gitHubUrl, setGitHubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate');
  const [coverLetter, setCoverLetter] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');

  // State management
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successApp, setSuccessApp] = useState(null);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate Mandatory Personal Details
    if (!fullName.trim() || !email.trim() || !mobile.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setError('Please fill in all mandatory Personal Information fields.');
      setActiveStep(1);
      return;
    }

    // Validate Mandatory Educational Details
    if (!highestQualification.trim() || !courseDegree.trim() || !collegeUniversity.trim() || !percentageCgpa.trim()) {
      setError('Please fill in all mandatory Educational Details.');
      setActiveStep(2);
      return;
    }

    // Validate Professional Details
    if (experienceType === 'experienced' && !totalExperience.trim()) {
      setError('Please state your Total Experience if experienced.');
      setActiveStep(3);
      return;
    }
    if (!technicalSkills.trim()) {
      setError('Technical skills are mandatory.');
      setActiveStep(3);
      return;
    }

    // Validate Mandatory Resume
    if (!resumeUrl.trim()) {
      setError('Resume / CV document URL is mandatory.');
      setActiveStep(4);
      return;
    }

    // Validate Document Formats (PDF, DOC, DOCX, JPG, JPEG, PNG)
    const docs = [
      { name: 'Resume', url: resumeUrl },
      { name: 'Educational Certificate', url: educationalCertificatesUrl },
      { name: 'Experience Certificate', url: experienceCertificatesUrl },
      { name: 'Portfolio Document', url: portfolioDocumentsUrl },
    ];

    for (const d of docs) {
      if (d.url && !isValidDocument(d.url)) {
        setError(`${d.name} format is not supported. Please provide a PDF, DOC, DOCX, JPG, JPEG, or PNG link.`);
        setActiveStep(4);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        dob,
        gender,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),

        highestQualification: highestQualification.trim(),
        courseDegree: courseDegree.trim(),
        specialization: specialization.trim(),
        collegeUniversity: collegeUniversity.trim(),
        graduationYear: graduationYear.trim(),
        percentageCgpa: percentageCgpa.trim(),
        additionalQualifications: additionalQualifications.trim(),

        experienceType,
        totalExperience: experienceType === 'experienced' ? totalExperience.trim() : 'Fresher (0 Years)',
        previousCompany: previousCompany.trim(),
        previousRole: previousRole.trim(),
        technicalSkills: technicalSkills.split(',').map((s) => s.trim()).filter(Boolean),
        softSkills: softSkills.trim(),
        certifications: certifications.trim(),
        internshipDetails: internshipDetails.trim(),

        resumeUrl: resumeUrl.trim(),
        educationalCertificatesUrl: educationalCertificatesUrl.trim(),
        experienceCertificatesUrl: experienceCertificatesUrl.trim(),
        portfolioDocumentsUrl: portfolioDocumentsUrl.trim(),

        linkedInUrl: linkedInUrl.trim(),
        gitHubUrl: gitHubUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
        expectedSalary: expectedSalary.trim(),
        noticePeriod: noticePeriod.trim(),
        coverLetter: coverLetter.trim(),
        additionalInformation: additionalInformation.trim(),
      };

      const res = await jobsApi.applyForJob(job._id, payload);
      if (res.data?.success) {
        setSuccessApp(res.data.application);
        if (onSuccess) onSuccess(res.data.application);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Personal', icon: User },
    { num: 2, label: 'Education', icon: GraduationCap },
    { num: 3, label: 'Experience', icon: Briefcase },
    { num: 4, label: 'Documents', icon: FileText },
    { num: 5, label: 'Additional', icon: LinkIcon },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-navy-950 text-white flex items-center justify-between border-b border-navy-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Student Career Application
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">{job.title}</h3>
            <p className="text-xs text-teal-200">
              {job.businessName || 'Business Partner'} • {job.location || 'Remote'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View (PRD Section 2) */}
        {successApp ? (
          <div className="p-8 sm:p-12 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-navy-950">Application Successfully Submitted!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your application has been delivered to Business Hub Admin. You can track this application anytime in your "My Applications" dashboard.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-sm mx-auto text-xs space-y-1 text-slate-700">
              <p className="text-[11px] text-slate-400 font-bold uppercase">Application Reference ID</p>
              <p className="text-base font-black text-navy-950 font-mono">{successApp.applicationId || successApp._id}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200 mt-1">
                Status: {successApp.status || 'Submitted'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-all"
            >
              Done / Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Step Wizard Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 sm:px-6 py-2 overflow-x-auto text-xs font-bold">
              {steps.map((st) => {
                const Icon = st.icon;
                const isActive = activeStep === st.num;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setActiveStep(st.num)}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition-colors whitespace-nowrap ${
                      isActive ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{st.num}. {st.label}</span>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="m-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Steps */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
              {/* STEP 1: Personal Information */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" /> Personal Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@example.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Residential Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, building, apartment..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Karnataka"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560001"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Educational Details */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-teal-600" /> Educational Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Highest Qualification *</label>
                      <input
                        type="text"
                        required
                        value={highestQualification}
                        onChange={(e) => setHighestQualification(e.target.value)}
                        placeholder="e.g. B.Tech / MCA / B.Sc / MBA"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Course / Degree *</label>
                      <input
                        type="text"
                        required
                        value={courseDegree}
                        onChange={(e) => setCourseDegree(e.target.value)}
                        placeholder="e.g. Computer Science and Engineering"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Specialization *</label>
                      <input
                        type="text"
                        required
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="e.g. Cloud Systems & Web Development"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">College / University *</label>
                      <input
                        type="text"
                        required
                        value={collegeUniversity}
                        onChange={(e) => setCollegeUniversity(e.target.value)}
                        placeholder="e.g. National Institute of Technology"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Graduation Year *</label>
                      <input
                        type="text"
                        required
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        placeholder="2025"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Percentage / CGPA *</label>
                      <input
                        type="text"
                        required
                        value={percentageCgpa}
                        onChange={(e) => setPercentageCgpa(e.target.value)}
                        placeholder="e.g. 8.6 CGPA or 85%"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Additional Qualifications</label>
                    <input
                      type="text"
                      value={additionalQualifications}
                      onChange={(e) => setAdditionalQualifications(e.target.value)}
                      placeholder="e.g. Diplomas, Specializations, Honors"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Professional Details */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-600" /> Professional Experience & Skills
                  </h4>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Candidate Category *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setExperienceType('fresher')}
                        className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                          experienceType === 'fresher'
                            ? 'bg-navy-950 text-white border-navy-950 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Fresher (0 - 1 Year)
                      </button>
                      <button
                        type="button"
                        onClick={() => setExperienceType('experienced')}
                        className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                          experienceType === 'experienced'
                            ? 'bg-navy-950 text-white border-navy-950 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Experienced Professional
                      </button>
                    </div>
                  </div>

                  {experienceType === 'experienced' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Total Experience *</label>
                        <input
                          type="text"
                          required
                          value={totalExperience}
                          onChange={(e) => setTotalExperience(e.target.value)}
                          placeholder="e.g. 2.5 Years"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Previous Company</label>
                        <input
                          type="text"
                          value={previousCompany}
                          onChange={(e) => setPreviousCompany(e.target.value)}
                          placeholder="Company name"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Previous Role</label>
                        <input
                          type="text"
                          value={previousRole}
                          onChange={(e) => setPreviousRole(e.target.value)}
                          placeholder="Job title"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Technical Skills (Comma separated) *</label>
                    <input
                      type="text"
                      required
                      value={technicalSkills}
                      onChange={(e) => setTechnicalSkills(e.target.value)}
                      placeholder="e.g. JavaScript, React, Node.js, Python, MongoDB, Docker"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Soft Skills</label>
                      <input
                        type="text"
                        value={softSkills}
                        onChange={(e) => setSoftSkills(e.target.value)}
                        placeholder="Communication, Analytical Thinking"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Certifications</label>
                      <input
                        type="text"
                        value={certifications}
                        onChange={(e) => setCertifications(e.target.value)}
                        placeholder="e.g. AWS Cloud Certified, Meta React"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Internship Experience (Optional)</label>
                    <textarea
                      rows={2}
                      value={internshipDetails}
                      onChange={(e) => setInternshipDetails(e.target.value)}
                      placeholder="Outline any notable internship projects and organizations..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Documents */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" /> Documents & Portfolio
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      PDF, DOC, DOCX, JPG, PNG
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Resume / CV Document URL *</label>
                      <button
                        type="button"
                        onClick={() => setResumeUrl('https://businesshub.com/uploads/resumes/my_resume.pdf')}
                        className="text-[10px] font-bold text-teal-600 hover:underline"
                      >
                        Sample Resume URL
                      </button>
                    </div>
                    <input
                      type="url"
                      required
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://.../resume.pdf"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-[10px] text-slate-400">
                      Mandatory. Secure cloud link to your latest resume / CV document.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Educational Certificates (Optional)</label>
                    <input
                      type="url"
                      value={educationalCertificatesUrl}
                      onChange={(e) => setEducationalCertificatesUrl(e.target.value)}
                      placeholder="https://.../degree_cert.pdf"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Experience Certificates</label>
                      <input
                        type="url"
                        value={experienceCertificatesUrl}
                        onChange={(e) => setExperienceCertificatesUrl(e.target.value)}
                        placeholder="https://.../relieving_letter.pdf"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Portfolio Document / Pitch Deck</label>
                      <input
                        type="url"
                        value={portfolioDocumentsUrl}
                        onChange={(e) => setPortfolioDocumentsUrl(e.target.value)}
                        placeholder="https://.../portfolio.pdf"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Additional Information */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-teal-600" /> Additional Details & Web Links
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={linkedInUrl}
                        onChange={(e) => setLinkedInUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">GitHub Profile</label>
                      <input
                        type="url"
                        value={gitHubUrl}
                        onChange={(e) => setGitHubUrl(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Portfolio Website</label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://myportfolio.dev"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Expected Salary</label>
                      <input
                        type="text"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        placeholder="e.g. ₹6,50,000 / year or Negotiable"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Notice Period / Availability</label>
                      <input
                        type="text"
                        value={noticePeriod}
                        onChange={(e) => setNoticePeriod(e.target.value)}
                        placeholder="Immediate / 15 Days / 1 Month"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Cover Letter / Note to Admin</label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Outline your motivation and key strengths for this position..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {/* Bottom Navigation & Submission Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {activeStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    ← Previous Step
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  {activeStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                      className="px-5 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs hover:bg-navy-900 shadow-sm"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Submitting Application...' : 'Submit to Business Hub Admin'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentJobApplicationModal;
