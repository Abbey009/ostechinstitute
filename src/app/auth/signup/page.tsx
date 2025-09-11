'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { countries } from '@/lib/data/countries';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1928 }, (_, index) => currentYear - index);
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const days = Array.from({ length: 31 }, (_, index) => index + 1);

export default function AuthForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('');
  const [callingCode, setCallingCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        email,
        phone: callingCode + phone,
        city,
        state: stateName,
        country,
        dob: `${dob.day}/${dob.month}/${dob.year}`,
        createdAt: new Date()
      });

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            className="border px-3 py-2 rounded w-1/2"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className="border px-3 py-2 rounded w-1/2"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <input
          type="email"
          className="border px-3 py-2 rounded"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex space-x-2">
          <select
            className="border px-3 py-2 rounded w-1/3"
            value={callingCode}
            onChange={(e) => setCallingCode(e.target.value)}
            required
          >
            <option value="">Code</option>
            {countries.map((c) => (
              <option key={c.code} value={c.callingCode}>
                {c.callingCode} ({c.code})
              </option>
            ))}
          </select>
          <input
            type="tel"
            className="border px-3 py-2 rounded w-2/3"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            className="border px-3 py-2 rounded w-1/3"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            className="border px-3 py-2 rounded w-1/3"
            placeholder="State"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            required
          />
          <select
            className="border px-3 py-2 rounded w-1/3"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {String.fromCodePoint(...[...c.code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65))} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <div className="w-1/3">
            <label htmlFor="dobDay" className="block text-sm mb-1">Day</label>
            <select
              id="dobDay"
              className="border px-3 py-2 rounded w-full"
              value={dob.day}
              onChange={(e) => setDob({ ...dob, day: e.target.value })}
              required
            >
              <option value="">Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/3">
            <label htmlFor="dobMonth" className="block text-sm mb-1">Month</label>
            <select
              id="dobMonth"
              className="border px-3 py-2 rounded w-full"
              value={dob.month}
              onChange={(e) => setDob({ ...dob, month: e.target.value })}
              required
            >
              <option value="">Month</option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/3">
            <label htmlFor="dobYear" className="block text-sm mb-1">Year</label>
            <select
              id="dobYear"
              className="border px-3 py-2 rounded w-full"
              value={dob.year}
              onChange={(e) => setDob({ ...dob, year: e.target.value })}
              required
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          type="password"
          className="border px-3 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="border px-3 py-2 rounded"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Sign Up
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
