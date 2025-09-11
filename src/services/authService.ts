import { API_URL } from "../utils/env";

export async function isEmailConfirmed(email: string): Promise<boolean> {
    console.log('Checking email confirmation for:', email);
  const res = await fetch(`${API_URL}/users/is-email-confirmed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  console.log(data);
  
  return res.ok && data;
}

export async function login(email: string, passwordHash: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password_hash: passwordHash })
  });
  return res;
}