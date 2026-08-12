"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register({}) {
  const supabase = createClient();
  const router = useRouter();

  const [authForm, setAuthform] = useState({
    email: "",
    password: "",
  });
  const handleAuthChange = e => {
    const { name, value } = e.target;

    setAuthform({
      ...authForm,
      [name]: value,
    });
  };
  const handleSignup = async e => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp(authForm);
    if (error) {
      alert("회원가입 실패: ", error.message);
    } else {
      alert("회원가입 성공");
      router.push("/");
    }
  };

  return (
    <div className="about_content shadow">
      <h2>Sign Up</h2>
      <div className="contact_form">
        <form onSubmit={handleSignup}>
          <p className="field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email" required onChange={handleAuthChange} />
          </p>
          <p className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleAuthChange}
            />
          </p>
          <p className="submit">
            <input type="submit" className="primary-btn" value="Submit" />
          </p>
        </form>
      </div>
    </div>
  );
}
