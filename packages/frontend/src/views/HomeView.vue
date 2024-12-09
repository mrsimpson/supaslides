<template>
  <div class="home-container">
    <section class="hero">
      <h1>Transform Remote Presentations</h1>
      <p>Break the barrier between presenters and audiences, no matter the distance</p>
      <n-button size="large" type="primary" @click="goToSignUp">
        Get Started
        <template #icon>
          <n-icon>
            <ArrowRight/>
          </n-icon>
        </template>
      </n-button>
    </section>

    <section class="benefits">
      <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3">
        <n-grid-item>
          <n-card>
            <template #title>
              <n-icon class="benefit-icon" size="24">
                <Collaborate/>
              </n-icon>
              Real-Time Engagement
            </template>
            Transform passive viewers into active participants. Audience members can react, ask questions, and provide
            instant feedback during the presentation.
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card>
            <template #title>
              <n-icon class="benefit-icon" size="24">
                <Analytics/>
              </n-icon>
              Presenter Insights
            </template>
            Gain immediate understanding of audience comprehension through live reactions, comments, and engagement
            metrics. Adapt your presentation in real-time.
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card>
            <template #title>
              <n-icon class="benefit-icon" size="24">
                <Accessibility/>
              </n-icon>
              Inclusive Communication
            </template>
            Create a more inclusive environment where everyone, regardless of their communication style, can participate
            and feel heard.
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card>
            <template #title>
              <n-icon class="benefit-icon" size="24">
                <Gateway/>
              </n-icon>
              Cross-Platform
            </template>
            Works seamlessly across devices. Presenters and audience members can join from anywhere using just a web
            browser.
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card>
            <template #title>
              <n-icon class="benefit-icon" size="24">
                <GroupPresentation/>
              </n-icon>
              Expressive Interactions
            </template>
            Go beyond text. Use emoji reactions to quickly gauge audience sentiment and create a more dynamic
            presentation experience.
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card>
            <template #title>
              <n-icon class="benefit-icon" size="24">
                <Locked/>
              </n-icon>
              Locked First
            </template>
            No account required for audience members. Simple, secure join codes keep your presentations private and
            accessible.
          </n-card>
        </n-grid-item>
      </n-grid>
    </section>

    <section class="use-cases">
      <h2>Perfect for Every Scenario</h2>
      <n-space vertical>
        <n-card>
          <h3>🎓 Education</h3>
          <p>Engage students in online and hybrid learning environments. Get instant feedback, conduct live polls, and
            create interactive classroom experiences.</p>
        </n-card>
        <n-card>
          <h3>💼 Business Presentations</h3>
          <p>Transform webinars and remote meetings. Gather real-time insights, answer questions instantly, and keep
            your team engaged and aligned.</p>
        </n-card>
        <n-card>
          <h3>🎤 Conferences & Workshops</h3>
          <p>Create more interactive and memorable conference experiences. Allow attendees to ask questions, react, and
            feel connected, even when physically apart.</p>
        </n-card>
      </n-space>
    </section>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {Accessibility, Analytics, ArrowRight, Collaborate, Gateway, GroupPresentation, Locked} from '@vicons/carbon'

const router = useRouter()

function goToSignUp() {
  router.push('/me')
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.benefits {
  margin-bottom: 3rem;
}

.benefit-icon {
  margin-right: 10px;
  vertical-align: middle;
}

.use-cases h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.use-cases {
  margin-bottom: 1rem;
}
</style>
