import type { CourseForContent } from '@/lib/courseContent';
import {
  getOverview,
  getFeesBreakdown,
  getEntryRequirements,
  getPswPathway,
  getCareerOutcomes,
  getCityLivingCost,
} from '@/lib/course-sections';

interface Props {
  course: CourseForContent;
  universityName: string;
  universitySlug: string;
}

export default function CourseKeyFacts({ course, universityName, universitySlug }: Props) {
  const overview = getOverview(course, universityName);
  const fees = getFeesBreakdown(course);
  const cityLiving = getCityLivingCost(course);
  const entryReq = getEntryRequirements(course);
  const psw = getPswPathway(course, universityName);
  const career = getCareerOutcomes(course, universitySlug);

  return (
    <>
      {/* 1. Overview */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {course.name} at {universityName}: Overview for Indian Students
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">{overview}</p>
      </div>

      {/* 2. Fees breakdown */}
      {fees && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {course.name} Fees in INR for Indian Students
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fees.native && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Annual Tuition ({fees.native.code})</p>
                <p className="text-sm font-semibold text-gray-900">
                  {fees.native.code} {fees.native.amount.toLocaleString()}
                </p>
              </div>
            )}
            {fees.annualINRLakh && (
              <div className="p-4 bg-brand-50 rounded-xl">
                <p className="text-xs text-brand-600 font-medium mb-1">Annual Tuition in INR</p>
                <p className="text-sm font-semibold text-brand-800">₹{fees.annualINRLakh} lakh/year</p>
              </div>
            )}
            {/*
              Living cost is a university/city figure, not a course fact — it is
              identical for every course at every university in the registry. Showing
              it here repeated it across ~500 sibling pages while implying it varied by
              course. It still feeds the Total Cost of Study calculation below, and the
              standalone figure lives on the university page.
              (Aug 2026 differentiation audit.)
            */}
          </div>
          {!fees.livingCostNative && cityLiving && (
            <p className="text-xs text-gray-600 mt-4">
              Estimated student living costs in {cityLiving.city}: {cityLiving.currencySymbol} {cityLiving.totalMonthly.min.toLocaleString()}–{cityLiving.totalMonthly.max.toLocaleString()} per month
              (approximately ₹{cityLiving.totalMonthlyINR.min.toLocaleString()}–₹{cityLiving.totalMonthlyINR.max.toLocaleString()}), covering rent, groceries, transport, and utilities.
            </p>
          )}
          {fees.native && fees.rate && (
            <p className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-3">
              Conversion rate used: 1 {fees.native.code} ≈ ₹{fees.rate.toFixed(1)} (indicative, as of {fees.rateAsOf}). Tuition only — visa fees, insurance, and application fees are additional.
            </p>
          )}
        </div>
      )}

      {/* 3. Entry requirements */}
      {entryReq && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Entry Requirements for {course.name} at {universityName}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Academic Eligibility</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{entryReq.academic}</p>
            </div>
            {entryReq.ielts && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">IELTS Requirement</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {universityName}&apos;s standard IELTS requirement for {course.name} is an overall band of <strong>{entryReq.ielts.min}+</strong>
                  {entryReq.ielts.toefl ? <> (TOEFL iBT {entryReq.ielts.toefl}+ accepted as an alternative</> : null}
                  {entryReq.ielts.toefl && entryReq.ielts.pte ? <>, PTE Academic {entryReq.ielts.pte}+ also accepted)</> : entryReq.ielts.toefl ? <>)</> : null}
                  . This is the university&apos;s published overall-band standard — our data does not include a section-wise (listening/reading/writing/speaking) breakdown, so confirm individual section minimums with the admissions office before applying.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Post-study work & PR pathway */}
      {psw && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Post-Study Work &amp; PR Pathway in {course.country}
          </h2>
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
            <span className="text-green-600 text-lg flex-shrink-0 mt-0.5">🛂</span>
            <div>
              <p className="text-sm font-semibold text-green-800">{psw.visaName}</p>
              <p className="text-xs text-green-700 mt-0.5">Work duration: {psw.workDuration}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{psw.body}</p>
        </div>
      )}

      {/* 5. Career outcomes — only if real per-university salary data exists */}
      {career && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Career Outcomes &amp; Salary After {course.name} at {universityName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-green-700">~₹{career.salaryLakh}L</p>
              <p className="text-xs text-gray-500 mt-1">Avg. Graduate Salary (Est., INR/yr)</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-gray-900">~{career.employmentRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Graduate Employment Rate (Est.)</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-gray-900">~{career.paybackYears} yrs</p>
              <p className="text-xs text-gray-500 mt-1">Fee Payback Period (Est.)</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            These are indicative, university-wide estimates, not officially published or programme-specific figures: an estimated average salary of around USD {career.avgSalaryUSD.toLocaleString()} (₹{career.salaryLakh} lakh) per year, against a total programme cost of approximately ₹{career.totalFeeLakh} lakh. Actual outcomes vary by specialisation and individual profile — confirm current figures with the university or your Jaivik Overseas counsellor.
          </p>
        </div>
      )}
    </>
  );
}
