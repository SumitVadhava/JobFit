// import * as React from "react";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// // import { Span } from "@chakra-ui/react";

// export default function FAQSection() {
//   const faqsJobSeekers = [
//     {
//       title: "What is JobFit?",
//       content:
//         "JobFit is a smart job-matching platform that helps you discover job opportunities that best align with your skills, experience, and preferences. Our AI-powered system ensures you get the most relevant listings.",
//     },
//     {
//       title: "How do I create an account on JobFit?",
//       content:
//         "Click on the “Sign Up” button on the homepage and fill in your details such as name, email, phone, and password. You can also sign up using Google or LinkedIn.",
//     },
//     {
//       title: "Is it free to use JobFit as a job seeker?",
//       content:
//         "Yes, JobFit is completely free for job seekers. You can search and apply to jobs without any charges.",
//     },
//     {
//       title: "How do I upload my resume?",
//       content:
//         "Once logged in, go to your profile and click on “Upload Resume”. You can upload a PDF, Word, or TXT file.",
//     },
//     {
//       title: "How do I apply for jobs on JobFit?",
//       content:
//         "Browse or search for jobs using filters like location, industry, or job type. Click on a job listing, review the details, and click “Apply Now”.",
//     },
//   ];

//   const faqsRecruiters = [
//     {
//       title: "How do I post a job on JobFit?",
//       content:
//         "Sign up as a recruiter, verify your company email, and go to your Recruiter Dashboard. Click “Post a Job”, fill in the details, and submit.",
//     },
//     {
//       title: "Is there a fee to post jobs?",
//       content:
//         "JobFit offers both free and premium job posting options. Free posts are visible for 15 days. Premium plans offer better visibility and candidate targeting.",
//     },
//     {
//       title: "How can I search for candidates?",
//       content:
//         "Once registered, use the Talent Search feature to find candidates based on skills, location, experience, and keywords.",
//     },
//     {
//       title: "How do I manage my job listings?",
//       content:
//         "You can edit, deactivate, or delete job posts from the Recruiter Dashboard under “My Job Posts”.",
//     },
//     {
//       title: "Can I contact applicants directly?",
//       content:
//         "Yes. You can view their contact info (if made public) or message them via JobFit's internal messaging system.",
//     },
//   ];

//   return (
//     <div className="bg-white min-h-screen max-w-7xl mx-auto py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-purple-800 mb-8 text-center">
//           JobFit – FAQ
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Column 1: For Job Seekers */}
//           <div>
//             <h3 className="text-xl font-semibold text-purple-800 mb-4">
//               For Job Seekers
//             </h3>
//             <div className="space-y-4">
//               {faqsJobSeekers.map((faq, index) => (
//                 <Accordion
//                   key={index}
//                   defaultExpanded={index === 0} // First FAQ expanded by default
//                   sx={{
//                     "&:before": { display: "none" },
//                     border: "1px solid #E5E7EB",
//                     borderRadius: "0.5rem",
//                     backgroundColor: "#FFFFFF",
//                     "&:hover": { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
//                   }}
//                 >
//                   <AccordionSummary
//                     expandIcon={<ExpandMoreIcon sx={{ color: "#6B46C1" }} />}
//                     aria-controls={`panel1-${index}-content`}
//                     id={`panel1-${index}-header`}
//                     sx={{
//                       backgroundColor: "#F9F9F9",
//                       borderBottom: "1px solid #E5E7EB",
//                     }}
//                   >
//                     <Typography
//                       component="span"
//                       sx={{ fontWeight: "600", color: "#6B46C1" }}
//                     >
//                       {faq.title}
//                     </Typography>
//                   </AccordionSummary>
//                   <AccordionDetails sx={{ backgroundColor: "#FFFFFF" }}>
//                     <Typography sx={{ color: "#4B5563" }}>
//                       {faq.content}
//                     </Typography>
//                   </AccordionDetails>
//                 </Accordion>
//               ))}
//             </div>
//           </div>

//           {/* Column 2: For Recruiters */}
//           <div>
//             <h3 className="text-xl font-semibold text-purple-800 mb-4">
//               For Recruiters
//             </h3>
//             <div className="space-y-4">
//               {faqsRecruiters.map((faq, index) => (
//                 <Accordion
//                   key={index}
//                   defaultExpanded={index === 0} // First FAQ expanded by default
//                   sx={{
//                     "&:before": { display: "none" },
//                     border: "1px solid #E5E7EB",
//                     borderRadius: "0.5rem",
//                     backgroundColor: "#FFFFFF",
//                     "&:hover": { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
//                   }}
//                 >
//                   <AccordionSummary
//                     expandIcon={<ExpandMoreIcon sx={{ color: "#6B46C1" }} />}
//                     aria-controls={`panel2-${index}-content`}
//                     id={`panel2-${index}-header`}
//                     sx={{
//                       backgroundColor: "#F9F9F9",
//                       borderBottom: "1px solid #E5E7EB",
//                     }}
//                   >
//                     <Typography
//                       component="span"
//                       sx={{ fontWeight: "600", color: "#6B46C1" }}
//                     >
//                       {faq.title}
//                     </Typography>
//                   </AccordionSummary>
//                   <AccordionDetails sx={{ backgroundColor: "#FFFFFF" }}>
//                     <Typography sx={{ color: "#4B5563" }}>
//                       {faq.content}
//                     </Typography>
//                   </AccordionDetails>
//                 </Accordion>
//               ))}
//             </div>
//           </div>
//         </div>
//         {/* Ask any doubt to our Chatbot */}
//         <div className="mt-10 text-center">
//           <h3 className="text-xl font-semibold text-purple-800 mb-4">
//             Still Have Questions?
//           </h3>
//           <p className="text-gray-600 mb-4">
//             Ask any doubt to our ChatBot{"  "}
//             <span className="font-bold text-lg  text-purple-700">
//               JobBot
//             </span>{" "}
//             for instant assistance!
//           </p>
//           <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200">
//             Chat with JobBot
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { Span } from "@chakra-ui/react";

export default function FAQSection() {
  const faqsJobSeekers = [
    {
      title: "What is JobFit?",
      content:
        "JobFit is a smart job-matching platform that helps you discover job opportunities that best align with your skills, experience, and preferences. Our AI-powered system ensures you get the most relevant listings.",
    },
    {
      title: "How do I create an account on JobFit?",
      content:
        "Click on the “Sign Up” button on the homepage and fill in your details such as name, email, phone, and password. You can also sign up using Google or LinkedIn.",
    },
    {
      title: "Is it free to use JobFit as a job seeker?",
      content:
        "Yes, JobFit is completely free for job seekers. You can search and apply to jobs without any charges.",
    },
    {
      title: "How do I upload my resume?",
      content:
        "Once logged in, go to your profile and click on “Upload Resume”. You can upload a PDF, Word, or TXT file.",
    },
    {
      title: "How do I apply for jobs on JobFit?",
      content:
        "Browse or search for jobs using filters like location, industry, or job type. Click on a job listing, review the details, and click “Apply Now”.",
    },
  ];

  const faqsRecruiters = [
    {
      title: "How do I post a job on JobFit?",
      content:
        "Sign up as a recruiter, verify your company email, and go to your Recruiter Dashboard. Click “Post a Job”, fill in the details, and submit.",
    },
    {
      title: "Is there a fee to post jobs?",
      content:
        "JobFit offers both free and premium job posting options. Free posts are visible for 15 days. Premium plans offer better visibility and candidate targeting.",
    },
    {
      title: "How can I search for candidates?",
      content:
        "Once registered, use the Talent Search feature to find candidates based on skills, location, experience, and keywords.",
    },
    {
      title: "How do I manage my job listings?",
      content:
        "You can edit, deactivate, or delete job posts from the Recruiter Dashboard under “My Job Posts”.",
    },
    {
      title: "Can I contact applicants directly?",
      content:
        "Yes. You can view their contact info (if made public) or message them via JobFit's internal messaging system.",
    },
  ];

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-800 mb-8 text-center">
          JobFit – FAQ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: For Job Seekers */}
          <div>
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
              For Job Seekers
            </h3>
            <div className="space-y-4">
              {faqsJobSeekers.map((faq, index) => (
                <Accordion
                  key={index}
                  // First FAQ expanded by default
                  sx={{
                    "&:before": { display: "none" },
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.5rem",
                    backgroundColor: "#FFFFFF",
                    "&:hover": { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#6B46C1" }} />}
                    aria-controls={`panel1-${index}-content`}
                    id={`panel1-${index}-header`}
                    sx={{
                      backgroundColor: "#F9F9F9",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{ fontWeight: "600", color: "#6B46C1" }}
                    >
                      {faq.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#FFFFFF" }}>
                    <Typography sx={{ color: "#4B5563" }}>
                      {faq.content}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>

          {/* Column 2: For Recruiters */}
          <div>
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
              For Recruiters
            </h3>
            <div className="space-y-4">
              {faqsRecruiters.map((faq, index) => (
                <Accordion
                  key={index}
                  sx={{
                    "&:before": { display: "none" },
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.5rem",
                    backgroundColor: "#FFFFFF",
                    "&:hover": { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#6B46C1" }} />}
                    aria-controls={`panel2-${index}-content`}
                    id={`panel2-${index}-header`}
                    sx={{
                      backgroundColor: "#F9F9F9",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{ fontWeight: "600", color: "#6B46C1" }}
                    >
                      {faq.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#FFFFFF" }}>
                    <Typography sx={{ color: "#4B5563" }}>
                      {faq.content}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
        {/* Ask any doubt to our Chatbot */}
        <div className="mt-10 text-center">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Ask any doubt to  {"      "}
            <span className="font-bold text-2xl  text-purple-700">
              {"    "}
              JobFit{"   "}
            </span>
            <span> {"     "}</span>
            support for instant assistance!
          </p>
          {/* <span className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200">
            Chat with JobBot 
          </span> */}
        </div>
      </div>
    </div>
  );
}
