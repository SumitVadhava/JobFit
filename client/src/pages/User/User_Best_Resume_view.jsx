const resumes = [
  {
    viewSrc:
      "https://www.canva.com/design/DAGtlqKiwZU/LXwr8lJIJPRaZk1hNFB34A/view?embed",
    editLink:
      "https://www.canva.com/design/DAGtlqKiwZU/UX44C7yyEe65QUPvHPw0BQ/edit?utm_content=DAGtlqKiwZU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    viewSrc:
      "https://www.canva.com/design/DAGtlow2HnQ/2uUtl1pFYeGIKEtcSml79Q/view?embed",
    editLink:
      "https://www.canva.com/design/DAGtlow2HnQ/BbWHM1_xME0-7PWkuZxD_A/edit?utm_content=DAGtlow2HnQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    viewSrc:
      "https://www.canva.com/design/DAGtlSL63I4/jia2Mylrptpxuv9ydVga0w/view?embed",
    editLink:
      "https://www.canva.com/design/DAGtlSL63I4/LnoX9EY8m20sUJBascY7bw/edit?utm_content=DAGtlSL63I4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    viewSrc:
      "https://www.canva.com/design/DAGtluV-GPE/CO60zReWMszyyxMskntUsA/view?embed",
    editLink:
      "https://www.canva.com/design/DAGtluV-GPE/0a-P3QUs2b-M8xxzqRuWNw/edit?utm_content=DAGtluV-GPE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    viewSrc:
      "https://www.canva.com/design/DAGtpn7KhZo/mEzwhLqcW9O1qiTJ5jL2vw/view?embed",
    editLink:
      "https://www.canva.com/design/DAGtpn7KhZo/awJDF-VNmizJeOqxmJiV2Q/edit?utm_content=DAGtpn7KhZo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    viewSrc:
      "https://www.canva.com/design/DAGtprPKxhg/EPSWYGaUN9thIdb2p6G7ww/view?embed",
    editLink:
      "https://www.canva.com/design/DAGtprPKxhg/oFkScaftp7Dq3qTYTG0wmg/edit?utm_content=DAGtprPKxhg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    viewSrc:
      "https://www.canva.com/design/DAGtpwyOV5I/1R_FljjzHE94g5FHNvzOfQ/view?embed",
    editLink:
      "https://www.canva.com/design/DAGtpwyOV5I/Sar_ILtuFhEVW9aUwX1rdA/edit?utm_content=DAGtpwyOV5I&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },
  {
    viewSrc:
      "https://www.canva.com/design/DAGtp4n-brY/KMlIZe0bPhRvPid78Yjh7Q/view?embed",
    editLink:
      "https://www.canva.com/design/DAGtp4n-brY/Vcwlpmwsh4k4kRF2YT8KRw/edit?utm_content=DAGtp4n-brY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
  },

];

function ResumeCard({ viewSrc, editLink }) {
  return (
    <div className="resume-card bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
      <div className="iframe-wrapper relative w-full pt-[130%]">
        <iframe
          loading="lazy"
          src={viewSrc}
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        ></iframe>
      </div>
      <div className="card-footer p-3 text-center">
        <a
          href={editLink}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline text-purple-600 font-bold hover:text-purple-800"
        >
          Edit
        </a>
      </div>
    </div>
  );
}

function User_Best_Resume_view() {
  return (
    <div className="bg-white p-5">
      <h1 className="text-center text-3xl font-bold mb-8 md:text-4xl text-purple-800">
        Best Resumes
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 max-w-[1300px] mx-auto">
        {resumes.map((resume, index) => (
          <ResumeCard
            key={index}
            viewSrc={resume.viewSrc}
            editLink={resume.editLink}
          />
        ))}
      </div>
    </div>
  );
}

export default User_Best_Resume_view;