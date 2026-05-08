import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Step 1 of Sign up (show more fields)
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    // Build request body
    const data =
      currState === "Sign up"
        ? { fullName, email, password, bio }
        : { email, password };

    // Call context login/signup method
    login(currState === "Sign up" ? "signup" : "login", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col relative z-10 px-4">
      {/* Left Section — Logo */}
      <div className="flex flex-col items-center gap-3 animate-fade-up">
        <img
          src={assets.logo_big}
          alt="QuickChat Logo"
          className="w-[min(30vw,220px)]"
        />
      </div>

      {/* Right Section — Form */}
      <form
        onSubmit={onSubmitHandler}
        className="premium-card p-8 flex flex-col gap-5 w-full max-w-sm animate-fade-up"
        style={{ animationDelay: '0.1s', opacity: 0 }}
      >
        <h2 className="font-bold text-2xl text-[var(--text-white)] tracking-tight">
          {currState}
          {isDataSubmitted && currState === "Sign up" && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Go back"
              className="w-5 cursor-pointer inline-block ml-3 invert opacity-50 hover:opacity-100 transition-opacity"
            />
          )}
        </h2>

        <p className="text-sm text-[var(--text-muted)] -mt-2">
          {currState === "Sign up"
            ? "Create your QuickChat account"
            : "Welcome back to QuickChat"}
        </p>

        {/* Step 1 extra field for signup */}
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="premium-input"
            placeholder="Full Name"
            required
          />
        )}

        {/* Email + Password always shown */}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="premium-input"
          placeholder="Email Address"
          required
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="premium-input"
          placeholder="Password"
          required
        />

        {/* Step 2 → bio field */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="premium-input resize-none"
            placeholder="Provide a short bio about yourself"
          ></textarea>
        )}

        <button
          type="submit"
          className="btn-green py-3.5 cursor-pointer text-center"
          style={{ borderRadius: 'var(--radius-sm)' }}
        >
          {currState === "Sign up"
            ? isDataSubmitted
              ? "Complete Sign Up"
              : "Continue"
            : "Sign In"}
        </button>

        <div className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]">
          <input
            type="checkbox"
            required
            className="w-4 h-4 accent-[#22c55e] rounded"
          />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="text-[var(--text-green)] cursor-pointer hover:underline font-semibold transition-colors"
              >
                Sign in
              </span>
            </p>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              New to QuickChat?{" "}
              <span
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                }}
                className="text-[var(--text-green)] cursor-pointer hover:underline font-semibold transition-colors"
              >
                Create account
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
