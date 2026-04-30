<template>
  <div>
 <div class="box"></div>
  </div>
</template>

<script setup>

</script>

<style scoped>
:root {
  --bg-lm: #1e2b3b;
  --text-lm: #f0f3f5;
  --outline-lm: #34485d;
  --divs-lm: #2f3f4f;
  --lightish-lm: #8d9aad;
  --yestext-lm: #3fd371;
  --yes-lm: #345250;
  --notext-lm: #d5363b;
  --no-lm: #5a414c;

  --primary: var(--bg-lm);
  --secondary: var(--text-lm);
  --tertiary: var(--outline-lm);
  --quaternary: var(--divs-lm);
  --quinary: var(--lightish-lm);
  --senary: var(--yestext-lm);
  --septenary: var(--yes-lm);
  --octonary: var(--notext-lm);
  --nonary: var(--no-lm);
  --border: var(--brd-lm)
}

.default {
  --bg-lm: #1e2b3b;
  --text-lm: #f0f3f5;
  --outline-lm: #34485d;
  --divs-lm: #2f3f4f;
  --lightish-lm: #8d9aad;
  --yestext-lm: #3fd371;
  --yes-lm: #345250;
  --notext-lm: #d5363b;
  --no-lm: #5a414c;
  --brd-lm: 10px;
}

.light{
  --bg-2m: #dadfe6;
  --text-2m: #1c2227;
  --outline-2m: #6d7b8a;
  --divs-2m: #ffffff;
  --lightish-2m: #9faab9;
  --yestext-2m: #26a350;
  --yes-2m: #92c4a7;
  --notext-2m: #a0171c;
  --no-2m: #cfadad;
}
.samreich{
  --bg-3m: #fff68c;
  --text-3m: #5c3852;
  --outline-3m: #3d9dc0;
  --divs-3m: #fcf6ee;
  --lightish-3m: #f8a548;
  --yestext-3m: #5d978f;
  --yes-3m: #92c4a7;
  --notext-3m: #a4212d;
  --no-3m: #e05637;
}
.box{
  border: var(--brd-lm) red ridge;
}
</style>