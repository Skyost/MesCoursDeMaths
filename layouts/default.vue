<template>
  <div>
    <nuxt-loading-indicator color="#f2f4f6" />
    <page-navbar />
    <page-header />
    <page-content>
      <slot />
    </page-content>
    <page-footer />
  </div>
</template>
