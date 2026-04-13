'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { profileApi } from '@/services/api';
import { loadMasterData } from '@/app/admin/master-file/data';

/* ── Types ─────────────────────────────────────────────────────── */
type FormState = {
  name: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  complexion: string;
  appearance: string;
  dressCode: string;
  ethnicity: string;
  civilStatus: string;
  children: string;
  familyStatus: string;
  country: string;
  state: string;
  city: string;
  residencyStatus: string;
  education: string;
  fieldOfStudy: string;
  occupation: string;
  profession: string;
  fatherEthnicity: string;
  fatherCountry: string;
  fatherOccupation: string;
  motherEthnicity: string;
  motherCountry: string;
  motherOccupation: string;
  siblings: string;
  countryPreference: string;
  aboutUs: string;
  expectations: string;
};

const EMPTY: FormState = {
  name: '', dateOfBirth: '', height: '', weight: '',
  complexion: '', appearance: '', dressCode: '', ethnicity: '',
  civilStatus: '', children: '', familyStatus: '',
  country: '', state: '', city: '', residencyStatus: '',
  education: '', fieldOfStudy: '', occupation: '', profession: '',
  fatherEthnicity: '', fatherCountry: '', fatherOccupation: '',
  motherEthnicity: '', motherCountry: '', motherOccupation: '',
  siblings: '', countryPreference: '',
  aboutUs: '', expectations: '',
};

/* ── Field component ────────────────────────────────────────────── */
function Field({
  label, name, value, onChange, type = 'text', options, disabled, rows,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (k: keyof FormState, v: string) => void;
  type?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  rows?: number;
}) {
  const base =
    'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#1C3B35]/20 focus:border-[#1C3B35] transition bg-white placeholder-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed';

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          disabled={disabled}
          onChange={e => onChange(name, e.target.value)}
          className={`${base} appearance-none cursor-pointer`}
        >
          <option value="">— Select —</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : rows ? (
        <textarea
          name={name}
          value={value}
          rows={rows}
          disabled={disabled}
          onChange={e => onChange(name, e.target.value)}
          className={`${base} resize-none`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          disabled={disabled}
          onChange={e => onChange(name, e.target.value)}
          className={base}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="px-5 py-3.5 bg-[#F0F4F2] border-b border-gray-100 rounded-t-2xl">
        <h3 className="text-xs font-bold text-[#1C3B35] uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-b-2xl">{children}</div>
    </div>
  );
}

/* ── Multi-Country Select ────────────────────────────────────────── */
function MultiCountrySelect({
  selected,
  onChange,
  countries,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  countries: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (country: string) => {
    if (selected.includes(country)) {
      onChange(selected.filter(c => c !== country));
    } else {
      onChange([...selected, country]);
    }
  };

  const filtered = countries.filter(
    c => c.toLowerCase().includes(search.toLowerCase()) && !selected.includes(c)
  );

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        Country Preference
        <span className="ml-1.5 text-[10px] font-normal text-gray-400 normal-case">(select multiple)</span>
      </label>

      {/* Selected pill tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {selected.map(c => (
            <span
              key={c}
              className="inline-flex items-center gap-1 bg-[#1C3B35]/10 text-[#1C3B35] text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {c}
              <button
                type="button"
                onClick={() => toggle(c)}
                className="ml-0.5 text-[#1C3B35]/60 hover:text-[#1C3B35] rounded-full leading-none text-sm transition"
                aria-label={`Remove ${c}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setOpen(o => !o); setSearch(''); }}
          className="w-full flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-white hover:border-[#1C3B35]/40 focus:outline-none focus:ring-2 focus:ring-[#1C3B35]/20 focus:border-[#1C3B35] transition"
        >
          <span className={selected.length === 0 ? 'text-gray-300' : 'text-gray-700 font-medium'}>
            {selected.length === 0 ? 'Select countries…' : `${selected.length} selected`}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-[200] mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Search */}
            <div className="px-3 pt-2.5 pb-1.5 border-b border-gray-100">
              <input
                type="text"
                autoFocus
                placeholder="Search country…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1C3B35]/20 focus:border-[#1C3B35] transition"
              />
            </div>
            {/* Options list */}
            <ul className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-2.5 text-xs text-gray-400 italic">No countries found</li>
              ) : (
                filtered.map(c => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => toggle(c)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#1C3B35]/5 flex items-center gap-2 transition"
                    >
                      <span className="w-4 h-4 rounded border border-gray-300 bg-white flex items-center justify-center flex-shrink-0" />
                      {c}
                    </button>
                  </li>
                ))
              )}
            </ul>
            {/* Already selected at bottom */}
            {selected.length > 0 && (
              <div className="border-t border-gray-100 py-1">
                {selected.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle(c)}
                    className="w-full text-left px-4 py-2 text-sm text-[#1C3B35] font-medium hover:bg-[#1C3B35]/5 flex items-center gap-2 transition"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
const CIVIL_STATUS_OPTS = [
  { value: 'Never Married', label: 'Never Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
  { value: 'Separated', label: 'Separated' },
  { value: 'Other', label: 'Other' },
];
const COMPLEXION_OPTS = [
  { value: 'Very Fair', label: 'Very Fair' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Wheatish', label: 'Wheatish' },
  { value: 'Olive', label: 'Olive' },
  { value: 'Brown', label: 'Brown' },
  { value: 'Dark', label: 'Dark' },
];
const APPEARANCE_OPTS = [
  { value: 'Very Fair', label: 'Very Fair' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Average', label: 'Average' },
  { value: 'Good Looking', label: 'Good Looking' },
  { value: 'Very Good Looking', label: 'Very Good Looking' },
];
const DRESS_CODE_OPTS = [
  { value: 'Traditional', label: 'Traditional' },
  { value: 'Modern', label: 'Modern' },
  { value: 'Hijab', label: 'Hijab' },
  { value: 'Niqab', label: 'Niqab' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Formal', label: 'Formal' },
];
const FAMILY_STATUS_OPTS = [
  { value: 'Middle Class', label: 'Middle Class' },
  { value: 'Upper Class', label: 'Upper Class' },
  { value: 'Lower Class', label: 'Lower Class' },
  { value: 'Rich', label: 'Rich' },
];
const RESIDENCY_OPTS = [
  { value: 'Citizen', label: 'Citizen' },
  { value: 'Permanent Resident', label: 'Permanent Resident' },
  { value: 'Visa Holder', label: 'Visa Holder' },
  { value: 'Student Visa', label: 'Student Visa' },
  { value: 'Work Visa', label: 'Work Visa' },
  { value: 'Other', label: 'Other' },
];
const EDUCATION_OPTS = [
  { value: 'High School', label: 'High School' },
  { value: "Bachelor's", label: "Bachelor's" },
  { value: "Master's", label: "Master's" },
  { value: 'PhD', label: 'PhD' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Other', label: 'Other' },
];

/* ── Page ──────────────────────────────────────────────────────── */
export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [gender, setGender] = useState('');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [countryPrefList, setCountryPrefList] = useState<string[]>([]);
  const [masterCountries, setMasterCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load master country list
  useEffect(() => {
    const md = loadMasterData();
    setMasterCountries(md.countries.map(c => c.name).sort());
  }, []);

  useEffect(() => {
    if (!id) return;
    profileApi.getOne(id)
      .then((r) => {
        const p = r.data ?? r;
        setGender(p.gender ?? '');
        setForm({
          name: p.name ?? '',
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
          height: p.height != null ? String(p.height) : '',
          weight: p.weight != null ? String(p.weight) : '',
          complexion: p.complexion ?? '',
          appearance: p.appearance ?? '',
          dressCode: p.dressCode ?? '',
          ethnicity: p.ethnicity ?? '',
          civilStatus: p.civilStatus ?? '',
          children: p.children ?? '',
          familyStatus: p.familyStatus ?? '',
          country: p.country ?? '',
          state: p.state ?? '',
          city: p.city ?? '',
          residencyStatus: p.residencyStatus ?? '',
          education: p.education ?? '',
          fieldOfStudy: p.fieldOfStudy ?? '',
          occupation: p.occupation ?? '',
          profession: p.profession ?? '',
          fatherEthnicity: p.fatherEthnicity ?? '',
          fatherCountry: p.fatherCountry ?? '',
          fatherOccupation: p.fatherOccupation ?? '',
          motherEthnicity: p.motherEthnicity ?? '',
          motherCountry: p.motherCountry ?? '',
          motherOccupation: p.motherOccupation ?? '',
          siblings: p.siblings != null ? String(p.siblings) : '',
          countryPreference: p.countryPreference ?? '',
          aboutUs: p.aboutUs ?? '',
          expectations: p.expectations ?? '',
        });
        // parse comma-separated country preference into array
        const prefStr = p.countryPreference?.trim() ?? '';
        if (prefStr) {
          setCountryPrefList(prefStr.split(',').map((s: string) => s.trim()).filter(Boolean));
        }
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  // Keep form.countryPreference in sync with countryPrefList
  const handleCountryPrefChange = (list: string[]) => {
    setCountryPrefList(list);
    setForm(f => ({ ...f, countryPreference: list.join(',') }));
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const payload: any = { ...form };

      // Always include gender (backend requires it, but it's locked/read-only for the user)
      payload.gender = gender;

      // Convert numeric fields
      if (payload.height) payload.height = Number(payload.height);
      if (payload.weight) payload.weight = Number(payload.weight);
      if (payload.siblings) payload.siblings = Number(payload.siblings);

      // Strip empty strings → undefined for optional fields (but NEVER touch name or gender)
      const KEEP_AS_STRING = new Set(['name', 'gender']);
      Object.keys(payload).forEach(k => {
        if (!KEEP_AS_STRING.has(k) && payload[k] === '') payload[k] = undefined;
      });

      await profileApi.update(id, payload);
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/profiles/${id}`), 1000);
    } catch (e: any) {
      setError(e.message ?? 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400 font-poppins">
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Loading profile…
    </div>
  );

  if (error && !form.name) return (
    <div className="text-center py-16 font-poppins">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => router.back()} className="text-sm text-[#1C3B35] underline">Go back</button>
    </div>
  );

  return (
    <div className="font-poppins space-y-6 max-w-4xl mx-auto pb-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/dashboard/profiles" className="hover:text-[#1C3B35] transition">My Profiles</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
        <Link href={`/dashboard/profiles/${id}`} className="hover:text-[#1C3B35] transition truncate">{form.name || 'Profile'}</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
        <span className="text-gray-600 font-medium">Edit</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1C3B35] to-[#2d6352] rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Edit Profile</h1>
            <p className="text-xs text-white/60 mt-0.5">Update your profile information</p>
          </div>
        </div>
        {/* Gender — read-only locked badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Gender:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            {gender === 'MALE' ? '♂ Male' : '♀ Female'}
            <span className="text-white/50 text-[9px] ml-0.5">(locked)</span>
          </span>
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          Profile saved! Redirecting…
        </div>
      )}

      {/* ── Personal Details ──────────────────────────────────────────── */}
      <SectionCard title="Personal Details">
        <Field label="Full Name" name="name" value={form.name} onChange={set} />
        <Field label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={set} type="date" />
        <Field label="Height (cm)" name="height" value={form.height} onChange={set} type="number" />
        <Field label="Weight (kg)" name="weight" value={form.weight} onChange={set} type="number" />
        <Field label="Complexion" name="complexion" value={form.complexion} onChange={set} options={COMPLEXION_OPTS} />
        <Field label="Appearance" name="appearance" value={form.appearance} onChange={set} options={APPEARANCE_OPTS} />
        <Field label="Dress Code" name="dressCode" value={form.dressCode} onChange={set} options={DRESS_CODE_OPTS} />
        <Field label="Ethnicity" name="ethnicity" value={form.ethnicity} onChange={set} />
        <Field label="Civil Status" name="civilStatus" value={form.civilStatus} onChange={set} options={CIVIL_STATUS_OPTS} />
        <Field label="Children" name="children" value={form.children} onChange={set} />
        <Field label="Family Status" name="familyStatus" value={form.familyStatus} onChange={set} options={FAMILY_STATUS_OPTS} />
      </SectionCard>

      {/* ── Location & Education ──────────────────────────────────────── */}
      <SectionCard title="Location & Education">
        <Field label="Country" name="country" value={form.country} onChange={set} />
        <Field label="State / Province" name="state" value={form.state} onChange={set} />
        <Field label="City" name="city" value={form.city} onChange={set} />
        <Field label="Residency Status" name="residencyStatus" value={form.residencyStatus} onChange={set} options={RESIDENCY_OPTS} />
        <Field label="Education" name="education" value={form.education} onChange={set} options={EDUCATION_OPTS} />
        <Field label="Field of Study" name="fieldOfStudy" value={form.fieldOfStudy} onChange={set} />
        <Field label="Occupation" name="occupation" value={form.occupation} onChange={set} />
        <Field label="Profession / Job Title" name="profession" value={form.profession} onChange={set} />
      </SectionCard>

      {/* ── Family Details ────────────────────────────────────────────── */}
      <SectionCard title="Family Details">
        <Field label="Father's Ethnicity" name="fatherEthnicity" value={form.fatherEthnicity} onChange={set} />
        <Field label="Father's Country" name="fatherCountry" value={form.fatherCountry} onChange={set} />
        <Field label="Father's Occupation" name="fatherOccupation" value={form.fatherOccupation} onChange={set} />
        <Field label="Mother's Ethnicity" name="motherEthnicity" value={form.motherEthnicity} onChange={set} />
        <Field label="Mother's Country" name="motherCountry" value={form.motherCountry} onChange={set} />
        <Field label="Mother's Occupation" name="motherOccupation" value={form.motherOccupation} onChange={set} />
        <Field label="Total Siblings" name="siblings" value={form.siblings} onChange={set} type="number" />
      </SectionCard>

      {/* ── Preferences ───────────────────────────────────────────────── */}
      <SectionCard title="Partner Preferences">
        <div className="sm:col-span-2">
          <MultiCountrySelect
            selected={countryPrefList}
            onChange={handleCountryPrefChange}
            countries={masterCountries}
          />
        </div>
      </SectionCard>

      {/* ── About & Expectations ──────────────────────────────────────── */}
      <SectionCard title="About & Expectations">
        <div className="sm:col-span-2">
          <Field label="About Me" name="aboutUs" value={form.aboutUs} onChange={set} rows={4} />
        </div>
        <div className="sm:col-span-2">
          <Field label="Expectations" name="expectations" value={form.expectations} onChange={set} rows={4} />
        </div>
      </SectionCard>

      {/* ── Action buttons ────────────────────────────────────────────── */}
      <div className="flex gap-3 pt-2">
        <Link
          href={`/dashboard/profiles/${id}`}
          className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-2xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || success}
          className="flex-1 bg-[#1C3B35] text-white text-sm font-semibold py-3 rounded-2xl hover:bg-[#15302a] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

    </div>
  );
}
