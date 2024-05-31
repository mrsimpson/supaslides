<!-- eslint-disable max-len -->
<template>
  <div id="optout-form">
    <strong>
      tl;dr: Wir haben ein Tracking auf der Seite, aber wir speichern keine personenbezogenen Daten von Dir
    </strong>
    <p>Die Langform: Wir wollen, dass das hier ein Tool ist, das viele Menschen motiviert, Energie zu sparen.
    Wir haben kein kommerzielles Interesse, aber wir wollen dennoch wissen, ob / wie das Tool genutzt wird.
    Wir haben uns bemüht, diese Seite guten Gewissens ohne Consent-Banner umzusetzen und tun alles, 
    was 
    <a href="https://matomo.org/faq/new-to-piwik/how-do-i-use-matomo-analytics-without-consent-or-cookie-banner/" target="_blank">
        laut den Experten von Matomo notwendig ist, 
    </a>damit wir auch keine Zustimmung brauchen. Wir betreiben also die gesamte Seite unter "Legitimate interests".
    </p>
    <p>Solltest Du dennoch darauf bestehen, dass wir gar keine Daten über Deinen Besuch erhalten, kannst Du das mit folgendem Schalter erledigen</p>

    <p>
      <n-switch v-model:value="isUserOptedOut" @update:value="handleOptOut" /> Ich möchte überhaupt nicht getrackt werden
    </p>
    <p>{{text}}</p>
  </div>
</template>

<script setup lang="ts">
import { isOptedOut, optOut, optIn } from "@/lib/Matomo";
const isUserOptedOut = ref(false);

onMounted(() => isOptedOut().then((v) => (isUserOptedOut.value = v)));

const handleOptOut = (shallOptOut: boolean) => {
  if (shallOptOut) {
    optOut();
  } else {
    optIn();
  }
};

const text = computed(() =>
  isUserOptedOut.value
    ? "Wir tracken von Dir überhaupt nichts!"
    : "Du hast dem Tracking nicht widersprochen. Wir speichern anonyme Tracking-Informationen."
);
</script>
