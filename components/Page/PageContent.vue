<template>
  <div class="page-content-parent">
    <ski-container class="page-content">
      <slot />
    </ski-container>
  </div>
</template>

<script>
import { SkiContainer } from 'skimple-components'

export default {
  name: 'PageContent',
  components: { SkiContainer }
}
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/_functions';
@import 'bootstrap/scss/_variables';
@import 'assets/app';

.page-content-parent {
  position: relative;
  background-color: #f8f8f8;

  .page-content {
    position: relative;
    padding: 100px 60px 80px 60px;
    background-color: white;
    z-index: 1;

    @include media-breakpoint-down(md) {
      padding: 60px 40px;
    }
  }

  &::before,
  &::after {
    position: absolute;
    content: '';
    right: 0;
    // bottom: 0;
    height: calc(2 * 100vw / 9);
    left: 0;
    background-size: cover;
    background-repeat: no-repeat;
  }

  // Thanks to https://getwaves.io/
  // and https://yoksel.github.io/url-encoder/
  &::before {
    top: 0;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%2381d4fa" fill-opacity="1" d="M0,224L80,213.3C160,203,320,181,480,160C640,139,800,117,960,106.7C1120,96,1280,96,1360,96L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"%3E%3C/path%3E%3C/svg%3E');
  }

  &::after {
    bottom: 0;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%23226bae" fill-opacity="1" d="M0,288L120,282.7C240,277,480,267,720,250.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"%3E%3C/path%3E%3C/svg%3E');
  }
}

::v-deep h1,
::v-deep h2,
::v-deep h3,
::v-deep h4,
::v-deep h5 {
  border-bottom: 1px solid rgba(black, 0.25);
  padding-bottom: 0.2em;
  margin-bottom: 0.5em;
}

::v-deep .modal-header h5 {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

::v-deep code {
  font-size: 1em;
}

::v-deep a:not([role='button']) {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
