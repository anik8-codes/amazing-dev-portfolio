/** Same PDF viewer approach as Code/products/Portfolio/src/app/resume/page.tsx.
 * Its old GitHub Pages URL is gone; the public PDF now lives under anik8-codes.
 * Local snapshot avoids depending on third-party embeds or cookies.
 */
export const resume = {
  title: 'resume',
  description: "Aniket Singh's resume. read it here, open the PDF or save a copy.",
  pdf: '/resume/aniket-singh.pdf',
  fileName: 'Aniket-Singh-Resume.pdf',
  source: 'https://github.com/anik8-codes/Aniket-CV-25/blob/main/cv.pdf',
  frameTitle: "Aniket Singh's resume PDF",
  open: 'open PDF ↗',
  download: 'download resume',
  fallback: 'if your browser does not display PDFs, open or download the file above.',
  back: { label: 'back home', href: '/' },
  office: { label: 'enter virtual workspace', href: '/office/' },
} as const;
