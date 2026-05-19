<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabaseClient";

const router = useRouter();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function login() {
  errorMessage.value = "";
  loading.value = true;

  try {
    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select(`
        id,
        username,
        auth_email:auth.users(email)
      `)
      .eq("username", username.value)
      .maybeSingle();

    if (profileError) throw profileError;
    const email = profileRow?.auth_email;

    if (!email) {
      throw new Error("No account found with that username.");
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: password.value,
    });

    if (signInError) throw signInError;
    router.push("/").catch(() => {});
  } catch (e) {
    errorMessage.value = e?.message ?? "Login failed.";
  } finally {
    loading.value = false;
  }
}

function goToJoin() {
  router.push("/signup").catch(() => {});
}
</script>

<template>
  <div class="container">
    <h2>Login</h2>

    <div class="field">
      <label>Username</label>
      <input v-model="username" type="text" placeholder="Enter username" autocomplete="username" />
    </div>

    <div class="field">
      <label>Password</label>
      <input
        v-model="password"
        type="password"
        placeholder="Enter password"
        autocomplete="current-password"
      />
    </div>

    <button :disabled="loading" @click="login">
      {{ loading ? "Logging in..." : "Log in" }}
    </button>

    <p v-if="errorMessage" style="color: red; margin-top: 8px;">
      {{ errorMessage }}
    </p>

    <hr />

    <button :disabled="loading" @click="goToJoin">
      Join
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 360px;
  margin: 48px auto;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 10px;
}
.field { margin: 12px 0; }
label { display: block; margin-bottom: 6px; font-weight: 600; }
input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
button { width: 100%; padding: 10px; border-radius: 8px; cursor: pointer; margin-top: 10px; }
</style>