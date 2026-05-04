<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabaseClient";

const router = useRouter();
const session = ref(null);

async function loadSession() {
  const { data } = await supabase.auth.getSession();
  session.value = data.session;

  if (!data.session) {

    if (router.currentRoute.value.path !== "/login") {
      router.push("/login");
    }
  }
}

async function handleAuthChanges() {
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession;

    if (!newSession) {
      if (router.currentRoute.value.path !== "/login") {
        router.push("/login");
      }
    }
  });
}

onMounted(async () => {
  await loadSession();
  await handleAuthChanges();
});
</script>

<template>
  <router-view />
</template>