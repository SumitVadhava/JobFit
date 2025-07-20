import React from "react";

// Helper function to extract bullet lists between markers
const extractList = (text, startMarker, endMarker) => {
  const section = text.split(startMarker)[1]?.split(endMarker)[0] || "";
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace(/^-\s*/, ""));
};

// Helper to parse missing keywords
const parseMissingKeywords = (text) => {
  return text
    .map((line) => {
      const match = line.match(
        /(.+?) \(type: (.+?), years required: (.+?), context: "(.+?)"\)/
      );
      if (!match) return null;
      const [, keyword, type, years, context] = match;
      return { keyword, type, years, context };
    })
    .filter(Boolean);
};

const ResumeAnalysisReport = ({ data }) => {
  if (!data?.result || !data?.ai_output) return <p>No data available</p>;

  const result = data.result;
  const aiOutput = data.ai_output;

  // Parse all sections
  const matchedKeywords = extractList(aiOutput, "Matched Keywords:", "Missing Keywords:");
  const missingKeywordLines = extractList(aiOutput, "Missing Keywords:", "Improvement Tips:");
  const missingKeywords = parseMissingKeywords(missingKeywordLines);
  const improvementTips = extractList(aiOutput, "Improvement Tips:", "Feedback Report:");
  const feedback = aiOutput.split("Feedback Report:")[1]?.trim();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-gray-800">
      {/* ATS Scores */}
      <section>
        <h2 className="text-2xl font-bold mb-4">ATS Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-100 rounded-lg shadow">
              <p className="text-sm text-gray-500">{key}</p>
              <p className="text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Matched Keywords */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Matched Keywords</h2>
        <ul className="list-disc pl-5 space-y-1">
          {matchedKeywords.map((kw, i) => (
            <li key={i}>{kw}</li>
          ))}
        </ul>
      </section>

      {/* Missing Keywords */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Missing Keywords</h2>
        <div className="space-y-3">
          {missingKeywords.map((item, i) => (
            <div key={i} className="border p-3 rounded bg-red-50 shadow-sm">
              <p className="font-medium">
                {item.keyword}{" "}
                <span className="text-sm text-gray-500">
                  ({item.type}, {item.years} years)
                </span>
              </p>
              <p className="text-sm text-gray-700 italic">Context: {item.context}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Improvement Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Improvement Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          {improvementTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Feedback */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Feedback Report</h2>
        <p className="whitespace-pre-line text-gray-700">{feedback}</p>
      </section>
    </div>
  );
};

export default ResumeAnalysisReport;
