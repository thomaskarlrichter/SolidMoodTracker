<script lang="ts">
  export let session;
  import { onMount } from 'svelte';
  import { readProfile, writeProfile  } from './lib/readWrite.js';
  let webId = undefined;
  let isLogged = false;

  </script>
<main id="read">
  Hallo {session}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
  #read {
    background: #e6f4f9;
  }
</style>
