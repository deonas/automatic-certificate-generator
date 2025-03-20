// import React, { useState, useEffect } from "react";
// import { supabase } from "./lib/supabase";
// import html2canvas from "html2canvas";
// import { jsPDF } from "jspdf";

// interface Certificate {
//   id: string;
//   name: string;
//   issuer: string;
//   date: string;
//   role: string;
//   duration: string;
//   startDate: string;
//   endDate: string;
// }

// function App() {
//   const [searchName, setSearchName] = useState("");
//   const [certificate, setCertificate] = useState<Certificate | null>(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showCertificate, setShowCertificate] = useState(false);

//   // New state for additional information
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [position, setPosition] = useState("");
//   const [additionalInfoComplete, setAdditionalInfoComplete] = useState(false);

//   // New state for certificate preview
//   const [showPreview, setShowPreview] = useState(false);

//   const searchCertificate = async () => {
//     if (!searchName.trim()) {
//       setError("Please enter a name");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setShowCertificate(false);
//     setAdditionalInfoComplete(false);
//     setShowPreview(false);

//     try {
//       const { data, error: queryError } = await supabase
//         .from("certificates")
//         .select("*")
//         .ilike("name", `%${searchName}%`)
//         .single();

//       if (queryError) throw queryError;

//       if (data) {
//         setCertificate(data);
//         // Initialize the additional fields with existing data if available
//         setStartDate(data.startDate || "");
//         setEndDate(data.endDate || "");
//         setPosition(data.role || "");
//       } else {
//         setError("No matching record found");
//       }
//     } catch (err) {
//       setError("Error searching for certificate");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdditionalInfoSubmit = () => {
//     if (!startDate || !endDate || !position) {
//       setError("Please fill all required fields");
//       return;
//     }

//     // Update the certificate object with the new information
//     if (certificate) {
//       setCertificate({
//         ...certificate,
//         startDate,
//         endDate,
//         role: position,
//       });
//       setAdditionalInfoComplete(true);
//       setError("");
//     }
//   };

//   // Automatically show certificate when additional info is complete
//   useEffect(() => {
//     if (additionalInfoComplete) {
//       setShowCertificate(true);
//       setShowPreview(true);
//     }
//   }, [additionalInfoComplete]);

//   const generateCertificatePDF = async () => {
//     const element = document.getElementById("certificate");
//     if (!element) return;

//     try {
//       const canvas = await html2canvas(element, {
//         scale: 2,
//         logging: true,
//         useCORS: true,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("l", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`certificate-${certificate?.name}.pdf`);
//     } catch (err) {
//       console.error("Error generating PDF:", err);
//     }
//   };

//   // Calculate duration between start and end dates
//   const calculateDuration = () => {
//     if (!startDate || !endDate) return "";

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     const months = Math.floor(diffDays / 30);
//     const remainingDays = diffDays % 30;

//     if (months > 0 && remainingDays > 0) {
//       return `${months} month${months > 1 ? "s" : ""} and ${remainingDays} day${
//         remainingDays > 1 ? "s" : ""
//       }`;
//     } else if (months > 0) {
//       return `${months} month${months > 1 ? "s" : ""}`;
//     } else {
//       return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
//     }
//   };

//   // Certificate component that will be rendered for both preview and PDF generation
//   const CertificateTemplate = ({
//     name,
//     position,
//     startDate,
//     endDate,
//     duration,
//   }: {
//     name: string;
//     position: string;
//     startDate: string;
//     endDate: string;
//     duration: string;
//   }) => (
//     <div className="relative w-full aspect-[1123/794] bg-[#0A2647]">
//       <div className="absolute inset-0 bg-gradient-to-br from-[#0A2647] to-[#144272]">
//         <div className="absolute left-0 bottom-0 w-1/3 h-full bg-[#0A2647] transform -skew-x-12" />
//       </div>

//       <div className="relative z-10 p-16 text-white h-full flex flex-col items-center">
//         <h1 className="text-6xl font-bold text-center mb-12">
//           CERTIFICATE OF INTERNSHIP
//         </h1>

//         <div className="flex justify-center mb-12">
//           <div className="h-24 w-40 bg-white/20 flex items-center justify-center text-white">
//             LOGO
//           </div>
//         </div>

//         <div className="text-center space-y-8">
//           <p className="text-2xl">This certificate is presented to:</p>
//           <h2 className="text-5xl font-bold">{name}</h2>
//           <p className="text-xl italic">
//             For successfully Completing {duration} of Internship in{" "}
//             <span className="font-semibold">{position}</span> with dedication
//             and valuable contributions as a key in shaping the team culture and
//             helping us grow
//           </p>
//         </div>

//         <div className="flex justify-between w-full mt-auto">
//           <div className="text-left">
//             <p className="text-2xl mb-2">Regards,</p>
//             <div className="h-16 w-32 bg-white/20 flex items-center justify-center text-white mb-2">
//               SIGNATURE
//             </div>
//             <p className="text-xl">
//               Yash Kulkarni
//               <br />
//               Founder & CEO
//               <br />
//               PURPLERAIN TECHSAFE
//             </p>
//           </div>

//           <div className="text-right">
//             <p className="text-xl">
//               FROM - {startDate}
//               <br />
//               TO - {endDate}
//             </p>
//           </div>
//         </div>

//         <div className="w-full text-center mt-8">
//           <p className="text-lg">
//             purplerain.studio08@gmail.com
//             <br />
//             PurpleRain.framer.ai
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
//       <header className="bg-black/30 p-4">
//         <div className="container mx-auto">
//           <div className="h-8 w-32 bg-white/20 flex items-center justify-center text-white">
//             LOGO
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl mb-8">
//           <h1 className="text-3xl font-bold text-white mb-6 text-center">
//             Certificate Verification
//           </h1>

//           <div className="space-y-4">
//             <input
//               type="text"
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//               placeholder="Enter name"
//               className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />

//             <button
//               onClick={searchCertificate}
//               disabled={loading}
//               className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
//             >
//               {loading ? "Searching..." : "Search"}
//             </button>

//             {error && <p className="text-red-400 text-sm">{error}</p>}
//           </div>

//           {certificate && !additionalInfoComplete && (
//             <div className="mt-6 space-y-4 border-t border-white/20 pt-6">
//               <h2 className="text-xl font-bold text-white">
//                 Additional Information
//               </h2>
//               <p className="text-white/80 text-sm">
//                 Please provide the following details to generate your
//                 certificate:
//               </p>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-white text-sm mb-2">
//                     Position/Role
//                   </label>
//                   <input
//                     type="text"
//                     value={position}
//                     onChange={(e) => setPosition(e.target.value)}
//                     placeholder="e.g. Frontend Developer"
//                     className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-white text-sm mb-2">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-white text-sm mb-2">
//                     End Date
//                   </label>
//                   <input
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>

//                 <button
//                   onClick={handleAdditionalInfoSubmit}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
//                 >
//                   Confirm Details
//                 </button>
//               </div>
//             </div>
//           )}

//           {certificate && additionalInfoComplete && (
//             <div className="mt-8 space-y-4">
//               <div className="bg-white/20 p-4 rounded-lg">
//                 <h3 className="font-bold text-white">Certificate Details:</h3>
//                 <ul className="text-white/80 space-y-1 mt-2">
//                   <li>
//                     <span className="font-medium">Name:</span>{" "}
//                     {certificate.name}
//                   </li>
//                   <li>
//                     <span className="font-medium">Position:</span> {position}
//                   </li>
//                   <li>
//                     <span className="font-medium">Duration:</span>{" "}
//                     {calculateDuration()}
//                   </li>
//                   <li>
//                     <span className="font-medium">Period:</span> {startDate} to{" "}
//                     {endDate}
//                   </li>
//                 </ul>
//               </div>

//               <button
//                 onClick={generateCertificatePDF}
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
//               >
//                 Download Certificate PDF
//               </button>

//               <button
//                 onClick={() => setShowPreview(!showPreview)}
//                 className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
//               >
//                 {showPreview
//                   ? "Hide Certificate Preview"
//                   : "Show Certificate Preview"}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Certificate preview section */}
//         {showPreview && showCertificate && certificate && (
//           <div className="flex flex-col items-center my-8">
//             <h2 className="text-2xl font-bold text-white mb-4">
//               Certificate Preview
//             </h2>
//             <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl mb-4 w-full max-w-4xl">
//               <p className="text-white text-center mb-4">
//                 This is a preview of your certificate. Click "Download
//                 Certificate PDF" to save it.
//               </p>

//               <div className="w-full overflow-hidden rounded-lg shadow-lg">
//                 {/* Visible certificate for preview */}
//                 <div className="visible-certificate">
//                   <CertificateTemplate
//                     name={certificate.name}
//                     position={position}
//                     startDate={startDate}
//                     endDate={endDate}
//                     duration={calculateDuration()}
//                   />
//                 </div>

//                 {/* Hidden certificate for PDF generation */}
//                 <div className="hidden">
//                   <div id="certificate">
//                     <CertificateTemplate
//                       name={certificate.name}
//                       position={position}
//                       startDate={startDate}
//                       endDate={endDate}
//                       duration={calculateDuration()}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       <footer className="bg-black/30 text-white text-center p-4 mt-8">
//         ©All rights reserved PurpleRain TechSafe 2025
//       </footer>
//     </div>
//   );
// }

// export default App;
import React, { useState, useRef } from "react";
import { supabase } from "./lib/supabase";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
}

function App() {
  const [searchName, setSearchName] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [position, setPosition] = useState("");
  const [additionalInfoComplete, setAdditionalInfoComplete] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const searchCertificate = async () => {
    try {
      setLoading(true);
      setError("");
      setCertificate(null);
      setShowCertificate(false);
      const { data, error } = await supabase
        .from("certificates")
        .select()
        .ilike("name", `%${searchName}%`)
        .single();

      if (error) throw error;

      if (data) {
        setCertificate(data);
        setShowCertificate(true);
      } else {
        setError("No certificate found for this name");
      }
    } catch (error) {
      setError("Error searching for certificate");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdditionalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate && position) {
      setAdditionalInfoComplete(true);
    }
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);

    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();

    if (end.getDate() < start.getDate()) {
      months--;
    }

    return `${months} ${months === 1 ? "Month" : "Months"}`;
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      // Set fixed dimensions for the certificate container before capturing
      const certificateElement = certificateRef.current;
      const originalStyle = certificateElement.style.cssText;

      // Force the certificate to render at A4 landscape dimensions (297mm x 210mm)
      // Converting to pixels at 96 DPI (1mm = 3.7795275591 pixels)
      const width = 1123; // 297mm * 3.7795275591
      const height = 794; // 210mm * 3.7795275591

      certificateElement.style.width = `${width}px`;
      certificateElement.style.height = `${height}px`;

      // Wait for the new dimensions to take effect
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(certificateElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: "#051C3C",
        width: width,
        height: height,
        logging: false,
      });

      // Reset the original style
      certificateElement.style.cssText = originalStyle;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Add image to PDF (full page)
      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);

      pdf.save(`${certificate?.name}_internship_certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const CertificateTemplate = ({
    name,
    position,
    startDate,
    endDate,
    duration,
  }: {
    name: string;
    position: string;
    startDate: string;
    endDate: string;
    duration: string;
  }) => (
    <div
      ref={certificateRef}
      id="certificate"
      className="relative w-full aspect-[16/9] bg-[#051C3C] overflow-hidden"
      style={{
        width: "100%",
        maxWidth: "1123px", // A4 landscape width in pixels
        margin: "0 auto",
      }}
    >
      {/* Background diagonal shape */}
      <div
        className="absolute top-0 left-0 w-2/3 h-full bg-[#0A2647] transform -skew-x-12"
        style={{ zIndex: 1 }}
      />
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col text-white p-16">
        {/* Certificate Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold tracking-wider mb-12 text-white drop-shadow-lg">
            CERTIFICATE OF INTERNSHIP
          </h1>
          <img
            src="/IMG-20250226-WA0006.jpg"
            alt="Company Logo"
            className="h-24 object-contain mx-auto mb-6"
          />
        </div>

        {/* Certificate content */}
        <div className="text-center mb-8">
          <p className="text-xl mb-2">This certificate is presented to:</p>
          <h2 className="text-5xl font-bold tracking-wide">{name}</h2>
        </div>

        {/* Description */}
        <div className="text-center mb-auto">
          <p className="text-xl italic leading-relaxed">
            For successfully completing {duration} of Internship in{" "}
            <span className="font-semibold">{position}</span> with dedication
            and valuable contributions as a key in shaping the team culture and
            helping us grow.
          </p>
        </div>

        {/* Footer section */}
        <div className="mt-auto flex justify-between items-end">
          <div>
            <p className="text-xl mb-4">With Regards,</p>
            <img
              src="/IMG-20250319-WA0003-removebg-preview.png"
              alt="Signature"
              className="h-16 md:h-20 lg:h-24 mb-4 invert brightness-200"
            />
            <p className="text-lg">
              Yash Kulkarni
              <br />
              Founder & CEO
              <br />
              PURPLERAIN TECHSAFE
            </p>
          </div>

          <div className="text-right text-lg">
            <p>FROM - {new Date(startDate).toLocaleDateString()}</p>
            <p>TO - {new Date(endDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Contact information */}
        <div className="text-center mt-8">
          <p className="text-lg">purplerain.studio08@gmail.com</p>
          <p className="text-lg">PurpleRain.framer.ai</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Website header with logo in far left */}
      <header className="bg-black/30 p-2">
        <div className="container mx-auto">
          <div className="flex items-center">
            <img
              src="/IMG-20250226-WA0006.jpg"
              alt="Company Logo"
              className="h-10 object-contain"
            />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Certificate Generator
        </h1>

        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl mb-8">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter name to search"
              className="w-full p-2 rounded mb-4 bg-white/20 text-white placeholder-white/60"
            />
            <button
              onClick={searchCertificate}
              disabled={loading || !searchName}
              className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Certificate"}
            </button>
            {error && <p className="text-red-400 mt-2">{error}</p>}
          </div>

          {showCertificate && certificate && !additionalInfoComplete && (
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Additional Information Required
              </h2>
              <form onSubmit={handleAdditionalInfoSubmit}>
                <div className="mb-4">
                  <label className="block text-white mb-2">Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-2 rounded bg-white/20 text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-white mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 rounded bg-white/20 text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-white mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 rounded bg-white/20 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                >
                  Generate Certificate
                </button>
              </form>
            </div>
          )}

          {additionalInfoComplete && certificate && (
            <div className="mt-8">
              <CertificateTemplate
                name={certificate.name}
                position={position}
                startDate={startDate}
                endDate={endDate}
                duration={calculateDuration()}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={downloadCertificate}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Certificate PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-black/30 text-white text-center p-4 mt-auto">
        ©All rights reserved PurpleRain TechSafe 2025
      </footer>
    </div>
  );
}

export default App;
