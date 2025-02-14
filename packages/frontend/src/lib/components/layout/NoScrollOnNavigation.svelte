<script lang="ts">
  import { afterNavigate, beforeNavigate } from '$app/navigation';

  const scrollBehaviorClass = 'scroll-behavior-smooth';

  beforeNavigate(() => {
    document
      .getElementsByTagName('html')[0]
      ?.classList.remove(scrollBehaviorClass);
  });

  afterNavigate(() => {
    document
      .getElementsByTagName('html')[0]
      ?.classList.add(scrollBehaviorClass);
  });
</script>
