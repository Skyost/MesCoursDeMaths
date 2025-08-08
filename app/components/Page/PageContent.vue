<template>
  <div class="page-content-parent">
    <b-container class="page-content">
      <slot />
    </b-container>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/bootstrap-mixins';
@import '~/assets/colors';

.page-content-parent {
  position: relative;

  .page-content {
    position: relative;
    padding: 100px 60px 80px;
    background-color: white;
    z-index: 1;

    @include media-breakpoint-down(md) {
      padding: 60px 40px;
    }

    @include media-breakpoint-down(sm) {
      padding: 60px 12px;
    }
  }

  .page-navigation {
    position: absolute;
    top: -0.5rem;
    right: calc(var(--bs-gutter-x) * 0.5);
    font-size: 0.6em;

    &:deep(a) {
      color: white !important;
      text-decoration: none !important;
    }
  }

  &::before {
    position: absolute;
    content: '';
    top: 0;
    right: 0;
    height: 100px;
    left: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: $primary;
  }
}

@include color-mode(dark) {
  .page-content-parent {
    .page-content {
      background-color: darken($dark, 5%);
    }

    &::before {
      background-color: black;
    }
  }
}

:deep(h1.centered),
:deep(h2.centered) {
  text-align: center;
  border-bottom: none;

  &::before,
  &::after {
    $size: 0.2em;

    content: '';
    display: inline-block;
    height: $size;
    width: $size;
    background-color: $primary;
    vertical-align: $size;
    border-radius: 100%;
  }

  &::before {
    margin-right: 0.75em;
  }

  &::after {
    margin-left: 0.75em;
  }
}

:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5) {
  border-bottom: 1px solid rgba(black, 0.25);
  padding-bottom: 0.2em;
  margin-bottom: 0.5em;
}

:deep(.modal-header h5) {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

:deep(code) {
  font-size: 1em;
}

:deep(a:not([role='button'])) {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
