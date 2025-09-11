'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { countries } from '@/lib/data/countries';

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
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

  // Date of Birth state
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user); // Send email verification

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName,
          lastName,
          email,
          phone: callingCode + phone,
          city,
          state: stateName,
          country,
          dob: `${dobDay}/${dobMonth}/${dobYear}`, // Store DOB in the format Day/Month/Year
          createdAt: new Date()
        });

        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {!isLogin && (
          <>
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

            {/* Date of Birth Section */}
            <div className="flex space-x-2">
              {/* Day Dropdown */}
              <select
                className="border px-3 py-2 rounded w-1/3"
                value={dobDay}
                onChange={(e) => setDobDay(e.target.value)}
                required
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              {/* Month Dropdown */}
              <select
                className="border px-3 py-2 rounded w-1/3"
                value={dobMonth}
                onChange={(e) => setDobMonth(e.target.value)}
                required
              >
                <option value="">Month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                className="border px-3 py-2 rounded w-1/3"
                value={dobYear}
                onChange={(e) => setDobYear(e.target.value)}
                required
              >
                <option value="">Year</option>
                {Array.from({ length: 100 }, (_, i) => 1929 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
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
          </>
        )}

        {isLogin && (
          <>
            <input
              type="email"
              className="border px-3 py-2 rounded"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="border px-3 py-2 rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <p
          className="mt-4 text-sm cursor-pointer text-blue-500 text-center"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </p>
      </form>
    </div>
  );
}
