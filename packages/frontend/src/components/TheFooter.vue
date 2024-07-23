<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { VirtualPrivateCloud as DataProtectionIcon } from '@vicons/carbon'
import { NIcon } from 'naive-ui'
</script>

<template>
  <div class="menu-bar">
    <RouterLink :to="{ name: 'imprint' }">
      <img alt="paragraph-icon" src="@/assets/ParagraphIcon.svg" />
      Impressum
    </RouterLink>

    <a href="https://github.com/mrsimpson/slideshow-frontend/" target="_blank">
      <img alt="github-icon" src="@/assets/GitHubIcon.svg" />
      GitHub
    </a>

    <RouterLink :to="{ name: 'data-protection' }">
      <n-icon>
        <DataProtectionIcon />
      </n-icon>
      Datenschutz
    </RouterLink>
  </div>
</template>

<style scoped>
.menu-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-bar > * {
  padding: 0 1rem;
  line-height: 3;
  position: relative;
}

.menu-bar > *:hover {
  filter: brightness(60%) brightness(130%);
  transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

a {
  text-decoration: none;
}

img {
  height: 16px;
  position: relative;
  top: 3px;
  margin-right: 5px;
}
</style>
