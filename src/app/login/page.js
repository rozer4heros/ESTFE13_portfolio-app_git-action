"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({}) {
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
  const handleLogin = async e => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword(authForm);
    if (error) {
      alert("로그인 실패: ", error.message);
    } else {
      alert("로그인 성공");
      router.push("/");
    }
  };
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error("로그인 실패", error.message);
    }
  };
  const signInWithKakao = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error("로그인 실패", error.message);
    }
  };

  return (
    <div className="about_content shadow">
      <h2>Sign In</h2>
      <div className="contact_form">
        <form onSubmit={handleLogin}>
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
        <hr />
      </div>
      <button onClick={signInWithGoogle}>구글로 로그인</button>
      <button onClick={signInWithKakao}>카카오로 로그인</button>
    </div>
  );
}
