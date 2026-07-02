import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitBusiness } from '../services/api';

const STEPS = ['Business Details', 'Financials', 'Uploads', 'Review'];

const INDUSTRIES = [
  'Restaurants & Cafés', 'Retail & E-Commerce', 'Health & Beauty', 'Professional Services',
  'Technology & IT', 'Construction & Contracting', 'Education & Training',
  'Hospitality & Tourism', 'Automotive', 'Manufacturing & Trading',
  'Finance & Fintech', 'Real Estate', 'Logistics', 'Other',
];

const LOCATIONS = [
  'Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah',
  'Ajman', 'Fujairah', 'Umm Al Quwain',
];

const INITIAL_FORM = {
  business_name: '',
  description: '',
  industry: '',
  location: '',
  year_established: '',
  reason_for_sale: '',
  asking_price: '',
  revenue: '',
  profit: '',
  ebitda: '',
  images: [],
};

function ProgressBar({ current, total }) {
  return (
    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
      <div
        className="h-full bg-investment-blue transition-all duration-500"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  );
}

export default function SellBusinessPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageWarnings, setImageWarnings] = useState([]);
  const [uploadWarnings, setUploadWarnings] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { customer, customerId } = useAuth();
  const navigate = useNavigate();

  // Price preview in sidebar
  const askingPrice = parseFloat(form.asking_price) || 0;

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

  const handleImages = (e) => {
    const incoming = Array.from(e.target.files);
    const warnings = [];

    const valid = incoming.filter(file => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        warnings.push(`"${file.name}" was skipped — only PNG, JPG, and WebP are supported.`);
        return false;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        warnings.push(`"${file.name}" was skipped — file exceeds the 10 MB limit.`);
        return false;
      }
      return true;
    });

    const slots = Math.max(0, 8 - imageFiles.length);
    if (valid.length > slots) {
      warnings.push(`Max 8 images allowed — ${valid.length - slots} file(s) were not added.`);
    }

    const merged = [...imageFiles, ...valid.slice(0, slots)];
    setImageFiles(merged);
    setImagePreviews(merged.map(f => URL.createObjectURL(f)));
    setImageWarnings(warnings);
  };

  const removeImage = (i) => {
    const newFiles = imageFiles.filter((_, idx) => idx !== i);
    const newPreviews = imagePreviews.filter((_, idx) => idx !== i);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setImageWarnings([]);
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.business_name.trim()) return 'Business name is required.';
      if (!form.industry) return 'Please select an industry.';
      if (!form.location) return 'Please select a location.';
    }
    if (step === 1) {
      if (!form.asking_price || parseFloat(form.asking_price) <= 0) return 'Please enter a valid asking price.';
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setError('');
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!customer || !customerId) {
      setError('You must be logged in to submit a listing.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { images, ...fields } = form;
      const result = await submitBusiness({
        shopify_customer_id: customerId,
        ...fields,
      }, imageFiles);
      if (result.upload_errors?.length) {
        setUploadWarnings(result.upload_errors);
      }
      setSubmitted(true);
    } catch (e) {
      setError(e.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-margin-mobile">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-success-green/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-success-green text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="text-headline-lg-mobile font-bold text-primary mb-3">Submission Received!</h2>
          <p className="text-on-surface-variant text-body-md mb-6">
            Your business listing is under review. Our team will contact you within 24 to 48 hours to discuss the next steps.
          </p>
          {uploadWarnings.length > 0 && (
            <div className="mb-6 rounded-xl border border-warning-amber/40 bg-warning-amber/10 px-4 py-3 text-left space-y-1">
              <p className="flex items-center gap-2 text-label-sm font-semibold text-on-surface mb-1">
                <span className="material-symbols-outlined text-warning-amber text-[18px]">warning</span>
                Some images could not be uploaded
              </p>
              {uploadWarnings.map((w, i) => (
                <p key={i} className="text-label-sm text-on-surface-variant pl-6">{w}</p>
              ))}
              <p className="text-label-sm text-on-surface-variant pl-6 pt-1">You can re-submit the listing with smaller or differently formatted images.</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl text-label-sm font-bold"
            >
              View My Dashboard
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(0); setForm(INITIAL_FORM); setImageFiles([]); setImagePreviews([]); setImageWarnings([]); setUploadWarnings([]); }}
              className="border border-outline px-6 py-3 rounded-xl text-label-sm font-medium"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedFields = Object.values(form).filter(v => v && v !== '').length;
  const totalFields = Object.keys(form).length - 1; // exclude images
  const progress = Math.min(Math.round((completedFields / totalFields) * 100), 100);

  return (
    <div className="bg-surface min-h-screen pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Step Indicator */}
        <div className="mb-6 md:mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-variant -translate-y-1/2 z-0" />
            <div
              className="absolute top-5 left-0 h-[2px] bg-investment-blue -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((label, i) => (
              <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-label-sm shadow-md transition-all ${
                  i < step ? 'bg-success-green text-white' :
                  i === step ? 'bg-investment-blue text-on-primary' :
                  'bg-surface-container-high border-2 border-surface-variant text-on-surface-variant'
                }`}>
                  {i < step ? (
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  ) : i + 1}
                </div>
                <span className={`text-label-xs hidden sm:block font-medium transition-colors ${i === step ? 'text-investment-blue' : 'text-on-surface-variant'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-8">
            {error && (
              <div className="bg-error-container text-on-error-container rounded-xl p-4 text-label-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Step 0: Business Details */}
            {step === 0 && (
              <section className="bg-surface-container-lowest p-5 md:p-10 rounded-2xl shadow-sm border border-outline-variant/10">
                <h2 className="text-lg md:text-headline-lg font-bold mb-5 md:mb-8">Business Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Business Name" required>
                    <input
                      value={form.business_name}
                      onChange={e => set('business_name', e.target.value)}
                      className="form-input"
                      placeholder="e.g. Acme Tech Solutions"
                    />
                  </FormField>

                  <FormField label="Industry" required>
                    <select
                      value={form.industry}
                      onChange={e => set('industry', e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select industry...</option>
                      {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Location" required>
                    <select
                      value={form.location}
                      onChange={e => set('location', e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select emirate...</option>
                      {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Year Established">
                    <input
                      value={form.year_established}
                      onChange={e => set('year_established', e.target.value)}
                      className="form-input"
                      placeholder="e.g. 2018"
                      type="text"
                      maxLength={4}
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Business Description">
                      <textarea
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                        className="form-input resize-none"
                        rows={4}
                        placeholder="Describe your business, its operations, and key strengths..."
                      />
                    </FormField>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Reason for Sale">
                      <textarea
                        value={form.reason_for_sale}
                        onChange={e => set('reason_for_sale', e.target.value)}
                        className="form-input resize-none"
                        rows={3}
                        placeholder="Briefly explain why you are looking to exit the business..."
                      />
                    </FormField>
                  </div>
                </div>
              </section>
            )}

            {/* Step 1: Financials */}
            {step === 1 && (
              <section className="bg-surface-container-lowest p-5 md:p-10 rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5 md:mb-8">
                  <h2 className="text-lg md:text-headline-lg font-bold">Financial Details</h2>
                  <span className="text-investment-blue text-[11px] bg-investment-blue/5 px-2.5 py-1 rounded-full border border-investment-blue/20">
                    Verified Figures Preferred
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Asking Price (AED)" required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">AED</span>
                      <input
                        type="number"
                        value={form.asking_price}
                        onChange={e => set('asking_price', e.target.value)}
                        className="form-input pl-14"
                        placeholder="0"
                        min={0}
                      />
                    </div>
                  </FormField>

                  <FormField label="Annual Revenue (AED)">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">AED</span>
                      <input
                        type="number"
                        value={form.revenue}
                        onChange={e => set('revenue', e.target.value)}
                        className="form-input pl-14"
                        placeholder="0"
                        min={0}
                      />
                    </div>
                  </FormField>

                  <FormField label="Net Profit (AED)">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">AED</span>
                      <input
                        type="number"
                        value={form.profit}
                        onChange={e => set('profit', e.target.value)}
                        className="form-input pl-14"
                        placeholder="0"
                        min={0}
                      />
                    </div>
                  </FormField>

                  <FormField label="EBITDA (AED)">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">AED</span>
                      <input
                        type="number"
                        value={form.ebitda}
                        onChange={e => set('ebitda', e.target.value)}
                        className="form-input pl-14"
                        placeholder="0"
                        min={0}
                      />
                    </div>
                  </FormField>
                </div>

                {/* Financial History Table */}
                <div className="mt-8 overflow-x-auto">
                  <h3 className="font-bold text-on-surface mb-4 text-label-sm uppercase tracking-wider">3-Year Financial Summary (Optional)</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/30">
                        <th className="py-3 text-left text-label-xs text-on-surface-variant font-semibold uppercase w-1/4">Metric</th>
                        <th className="py-3 text-right text-label-xs text-on-surface-variant font-semibold uppercase">Current Year</th>
                        <th className="py-3 text-right text-label-xs text-on-surface-variant font-semibold uppercase">Prior Year</th>
                        <th className="py-3 text-right text-label-xs text-on-surface-variant font-semibold uppercase">2 Years Ago</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {['Revenue', 'EBITDA', 'Net Profit'].map(metric => (
                        <tr key={metric}>
                          <td className="py-4 font-medium text-label-sm">{metric}</td>
                          {[0, 1, 2].map(col => (
                            <td key={col} className="py-4">
                              <input
                                type="text"
                                className="w-full bg-transparent text-right border-none focus:ring-0 text-label-sm font-mono outline-none"
                                placeholder="$0"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Step 2: Uploads */}
            {step === 2 && (
              <section className="bg-surface-container-lowest p-5 md:p-10 rounded-2xl shadow-sm border border-outline-variant/10">
                <h2 className="text-lg md:text-headline-lg font-bold mb-1 md:mb-2">Branding &amp; Assets</h2>
                <p className="text-on-surface-variant text-sm md:text-body-md mb-5 md:mb-8">
                  Upload your company logo, premises photos, and product images to attract sophisticated investors.
                </p>

                <label className="block border-2 border-dashed border-outline-variant/50 rounded-2xl p-6 md:p-12 text-center hover:border-investment-blue transition-colors group cursor-pointer bg-surface">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImages}
                    className="sr-only"
                  />
                  <span className="material-symbols-outlined text-investment-blue text-5xl mb-4 group-hover:scale-110 transition-transform block">cloud_upload</span>
                  <p className="font-bold text-xl mb-1">Drag and drop assets here</p>
                  <p className="text-on-surface-variant text-label-sm">PNG, JPG or WebP up to 10MB each, max 8 images</p>
                  <span className="mt-4 inline-block px-6 py-2 bg-surface-container-high rounded-full text-label-sm font-medium hover:bg-surface-variant transition-colors">
                    Browse Files
                  </span>
                </label>

                {imageWarnings.length > 0 && (
                  <div className="mt-4 rounded-xl border border-warning-amber/40 bg-warning-amber/10 px-4 py-3 space-y-1">
                    {imageWarnings.map((w, i) => (
                      <p key={i} className="flex items-start gap-2 text-label-sm text-on-surface">
                        <span className="material-symbols-outlined text-warning-amber text-[18px] mt-px shrink-0">warning</span>
                        {w}
                      </p>
                    ))}
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-surface-container relative overflow-hidden group">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-error text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-xl bg-surface-container-high border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer hover:border-investment-blue transition-colors">
                      <input type="file" multiple accept="image/*" onChange={handleImages} className="sr-only" />
                      <span className="material-symbols-outlined text-outline text-2xl">add</span>
                      <span className="text-label-xs text-outline mt-1">Add More</span>
                    </label>
                  </div>
                )}
              </section>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <section className="bg-surface-container-lowest p-5 md:p-10 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6 md:space-y-8">
                <h2 className="text-lg md:text-headline-lg font-bold">Review Your Listing</h2>

                {!customer && (
                  <div className="bg-warning-amber/10 border border-warning-amber/30 text-on-surface rounded-xl p-4 text-label-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-warning-amber text-[20px]">warning</span>
                    You must be logged in to submit a listing. Please sign in first.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Business Name', value: form.business_name },
                    { label: 'Industry', value: form.industry },
                    { label: 'Location', value: form.location },
                    { label: 'Year Established', value: form.year_established },
                    { label: 'Asking Price', value: form.asking_price ? `AED ${parseFloat(form.asking_price).toLocaleString()}` : '—' },
                    { label: 'Annual Revenue', value: form.revenue ? `AED ${parseFloat(form.revenue).toLocaleString()}` : '—' },
                    { label: 'Net Profit', value: form.profit ? `AED ${parseFloat(form.profit).toLocaleString()}` : '—' },
                    { label: 'EBITDA', value: form.ebitda ? `AED ${parseFloat(form.ebitda).toLocaleString()}` : '—' },
                  ].map(item => (
                    <div key={item.label} className="space-y-1">
                      <p className="text-label-xs text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                      <p className="font-medium text-body-md">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>

                {form.description && (
                  <div>
                    <p className="text-label-xs text-on-surface-variant uppercase tracking-wider mb-1">Description</p>
                    <p className="text-body-md text-on-surface leading-relaxed">{form.description}</p>
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div>
                    <p className="text-label-xs text-on-surface-variant uppercase tracking-wider mb-3">Images ({imagePreviews.length})</p>
                    <div className="flex gap-3 flex-wrap">
                      {imagePreviews.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
                  <p className="text-label-sm text-on-surface-variant">
                    By submitting, your listing will enter a review queue. Our team manually approves all listings before publishing to the marketplace. You'll receive an email notification within 24 to 48 hours.
                  </p>
                </div>
              </section>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={back}
                disabled={step === 0}
                className="px-4 py-2.5 md:px-8 md:py-3 rounded-xl border border-outline font-semibold text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm flex-shrink-0"
              >
                Previous
              </button>
              <div className="flex gap-2 md:gap-3">
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={next}
                    className="px-5 py-2.5 md:px-10 md:py-3 rounded-xl bg-primary text-on-primary font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !customer}
                    className="px-5 py-2.5 md:px-10 md:py-3 rounded-xl bg-primary text-on-primary font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting…' : 'Submit Listing'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="glass-card p-5 md:p-8 rounded-3xl shadow-xl shadow-primary/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-investment-blue/10 flex items-center justify-center text-investment-blue">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Listing Summary</h3>
                  <p className="text-label-xs text-on-surface-variant">Step {step + 1} of {STEPS.length}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="pb-5 border-b border-outline-variant/20">
                  <p className="text-label-xs uppercase tracking-widest text-on-surface-variant mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning-amber" />
                    <span className="font-medium text-label-sm">Confidential Listing</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant text-label-sm">Target Price</span>
                    <span className="font-bold text-lg tabular-nums">
                      {askingPrice > 0 ? `AED ${askingPrice.toLocaleString()}` : 'AED 0'}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-label-sm italic text-on-surface-variant leading-relaxed">
                  "Premium placement on SellMyBusiness.ae typically increases inquiry volume by 3x."
                </div>

                <div className="space-y-1.5">
                  <p className="text-label-xs text-on-surface-variant">Listing Health</p>
                  <ProgressBar current={progress} total={100} />
                  <p className="text-[10px] text-right text-investment-blue font-bold">{progress}% COMPLETE</p>
                </div>
              </div>
            </div>

            {/* Advisor CTA */}
            <div className="bg-primary text-on-primary p-8 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-on-primary/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <h4 className="font-bold text-lg mb-3 relative z-10">Need an Expert?</h4>
              <p className="text-on-primary-container text-body-md mb-6 relative z-10">
                Connect with a certified M&amp;A Advisor to maximise your valuation and streamline the process.
              </p>
              <a
                href={`https://wa.me/${import.meta.env.VITE_CONTACT_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gold-leaf text-on-secondary-fixed py-3 rounded-xl font-bold hover:brightness-110 transition-all relative z-10 text-label-sm flex items-center justify-center"
              >
                Contact Advisor
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-label-xs text-on-surface-variant uppercase tracking-wider block">
        {label}{required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
