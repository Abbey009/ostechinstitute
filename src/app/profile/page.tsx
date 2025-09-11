'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase/firebaseConfig';
import ClipLoader from 'react-spinners/ClipLoader';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setPhotoURL(data.photoURL || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);

    let updatedData: any = {
      firstName,
      lastName,
    };

    if (newPhoto) {
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);
      await uploadBytes(storageRef, newPhoto);
      const downloadURL = await getDownloadURL(storageRef);
      updatedData.photoURL = downloadURL;
      setPhotoURL(downloadURL);
    }

    await updateDoc(doc(db, 'users', user.uid), updatedData);

    setNewPhoto(null);
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <ClipLoader size={40} color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Your Profile</h1>
      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="flex items-center justify-center">
          <div className="relative h-24 w-24 rounded-full overflow-hidden">
            {photoURL ? (
              <Image
                src={photoURL}
                alt="Profile"
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Change Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setNewPhoto(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={updating}
        >
          {updating ? <ClipLoader size={20} color="#fff" /> : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
