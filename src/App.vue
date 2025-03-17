<template>
    <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="/images/MT_Logo.png" alt="MT Logo" width="30" height="30" class="d-inline-block bg-white align-text-top">
          Bulk Sender
        </a>
        <ul class="nav nav-tabs me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link to="/" :class="['nav-link', { active: $route.path === '/' }]" aria-current="page">Send products</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/settings" :class="['nav-link', { active: $route.path === '/settings' }]">Settings</router-link>
              </li>
            </ul>
      </div>
    </nav>
    <router-view />
</template>

<style>
body {
  background-color: rgb(43, 42, 36);
  color: white;
}
</style>
