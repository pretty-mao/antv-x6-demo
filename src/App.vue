<template>
  <div class="hello">
    <div class="mermaid">
      graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;
    </div>
  </div>
</template>

<script>
import mermaid from 'mermaid';

export default {
  name: "Hello",
  data() {
    return {
      value: "Hello Vite Vue2",
    };
  },
  mounted() {
    mermaid.initialize({startOnLoad:true});
    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
  },
};
</script>