"use server";

import { signIn, signOut } from "../../lib/auth";

export async function doSocialLogin(formData) {
  const action = formData.get("action");
  await signIn(action, { redirectTo: "/" });
}

export async function doLogout() {
  await signOut({ redirect: false });
  const result = { success: true };
  return result;
}
