<script setup></script>

<template>
  <div class="container">
    <header class="header">
      <div class="brand">
        <div class="logo"></div>
        <h1>Polymarket Demo</h1>
      </div>
      <nav class="nav">
        <RouterLink to="/sign-up">Sign Up</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
  <RouterLink to="/dashboard">Dashboard</RouterLink>
      </nav>
    </header>

    <main class="card">
      <RouterView />
    </main>

    <footer class="footer">Polymarket-style demo · Built with Supabase & Vue</footer>
  </div>
</template>

<style scoped>
/* App-level small tweaks */
.nav a { margin-left: 1rem; color: var(--muted); text-decoration: none }
.nav a.router-link-active { color: var(--accent) }
</style>

