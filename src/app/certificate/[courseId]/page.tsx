'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { QRCodeCanvas } from 'qrcode.react';

export default function CertificatePage() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const [certificate, setCertificate] = useState<any>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !courseId) return;

    const fetchData = async () => {
      const certRef = doc(db, 'certificates', `${user.uid}_${courseId}`);
      const certSnap = await getDoc(certRef);
      if (certSnap.exists()) {
        setCertificate(certSnap.data());
      }

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setFullName(`${data.firstName} ${data.lastName}`);
      }
    };

    fetchData();
  }, [user, courseId]);

  if (!certificate || !fullName) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Certificate Not Available</h1>
        <p className="text-gray-600">Complete the course to unlock your certificate.</p>
      </div>
    );
  }

  const certId = `${user.uid}_${courseId}`;
  const verifyUrl = `https://ostechinstitute.com/verify?certId=${certId}`;

  return (
    <div className="flex justify-center items-center bg-gray-200 py-10 min-h-screen">
      <div className="relative w-[900px] h-[650px] bg-[#fdf6ec] shadow-2xl border border-gray-400 px-16 py-10 print:w-full print:h-auto">
        {/* Watermark Logo */}
        <img
          src="/assets/logo.png"
          alt="Watermark"
          className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none"
        />

        {/* Header */}
        <div className="text-center z-10 relative">
          <h1 className="text-4xl font-bold text-blue-900 tracking-wide mb-1">CERTIFICATE</h1>
          <h2 className="text-xl text-blue-700 font-medium italic border-b-2 border-blue-200 w-fit mx-auto pb-1">
            of Completion
          </h2>
        </div>

        {/* Recipient */}
        <div className="text-center mt-10 relative z-10">
          <p className="text-lg text-gray-700">This is to certify that</p>
          <h2 className="text-3xl font-bold text-black mt-2">{fullName}</h2>
          <p className="text-lg text-gray-700 mt-4">has successfully completed the course</p>
          <h3 className="text-2xl font-bold text-blue-800 mt-2">{certificate.courseTitle}</h3>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-end mt-20 relative z-10">
          {/* Empty space reserved to balance layout */}
          <div className="h-20" />

          {/* Certificate Info */}
          <div className="text-sm text-right">
            <p className="text-gray-600">Date</p>
            <p className="font-semibold text-black">
              {certificate.completedAt?.toDate().toLocaleDateString()}
            </p>
            <p className="text-gray-600 mt-2">Certificate ID</p>
            <p className="text-xs text-black">{certId}</p>
          </div>
        </div>

        {/* Signature + Stamp */}
        <div className="absolute bottom-12 right-16 text-right z-10 flex flex-col items-end">
          <img src="/assets/stamp.png" alt="Official Stamp" className="h-16 mb-1" />
          <p className="italic text-blue-800 text-lg font-semibold border-t border-gray-400 w-48 pt-2">
            Instructor
          </p>
        </div>

        {/* Logo + QR */}
        <div className="absolute bottom-12 left-16 flex flex-col items-center gap-1 z-10">
          <img src="/assets/logo.png" alt="OsTech Logo" className="h-10" />
          <p className="text-sm font-semibold text-blue-900">OsTech Institute</p>
          <QRCodeCanvas value={verifyUrl} size={56} />
          <p className="text-[10px] text-gray-500">ostechinstitute.com/verify</p>
        </div>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="absolute top-5 right-5 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 print:hidden z-20"
        >
          Download / Print
        </button>
      </div>
    </div>
  );
}
