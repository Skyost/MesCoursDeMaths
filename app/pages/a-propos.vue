<script lang="ts">
export const aboutNavigationEntry = {
  title: 'À propos',
  to: '/a-propos/',
  depth: 0
}
</script>

<script setup lang="ts">
import siteMeta from '~/site/meta'
import { load } from 'recaptcha-v3'

enum FormState {
  incomplete,
  complete,
  sending,
  error,
  success
}

const projects = [
  {
    id: 'revise-tes-maths',
    to: 'https://revise.mes-cours-de-maths.fr',
    name: 'Révise tes maths !',
    image: '/images/about/revise-tes-maths.svg',
    text: 'Une application qui contient des exercices, classés par chapitres, pour réviser au jour le jour.'
  },
  {
    id: 'agregation',
    to: 'https://agreg.skyost.eu',
    name: 'agreg.skyost.eu',
    image: '/images/about/agregation.png',
    text: 'Je publie sur ce site tous les documents que j\'ai produits dans le cadre de ma préparation à l\'agrégation externe de mathématiques.'
  },
  {
    id: 'mathonaut',
    to: 'https://mathonaut.skyost.eu',
    name: 'Mathonaut',
    image: '/images/about/mathonaut.png',
    text: 'Un petit plateformer (volontairement difficile) dans lequel on incarne un astronaute 8-bit dont le but est d\'avancer en faisant des calculs.'
  }
]

const currentName = ref<string>('')
const currentEmail = ref<string>('')
const currentMessage = ref<string>('')
const currentState = ref<FormState>(FormState.incomplete)

const formSubmitEnabled = computed(() => currentState.value === FormState.complete)
const formEnabled = computed(() => currentState.value === FormState.incomplete || formSubmitEnabled.value)

watch(currentName, () => currentState.value = isValid() ? FormState.complete : FormState.incomplete)
watch(currentEmail, () => currentState.value = isValid() ? FormState.complete : FormState.incomplete)
watch(currentMessage, () => currentState.value = isValid() ? FormState.complete : FormState.incomplete)

const modal = ref<boolean>(false)

watch(currentState, () => {
  if (currentState.value == FormState.success || currentState.value == FormState.error) {
    modal.value = true
  }
})

const isValid = () => {
  if (!currentName.value || currentName.value.length === 0) {
    return false
  }
  if (!currentEmail.value || currentEmail.value.length === 0 || !(/\S+@\S+\.\S+/.test(currentEmail.value))) {
    return false
  }
  return currentMessage.value && currentMessage.value.length > 0
}

const onFormSubmit = async () => {
  currentState.value = FormState.sending
  try {
    const recaptcha = await load(siteMeta.contact.recaptchaKey, { autoHideBadge: true })
    const token = await recaptcha.execute('contact')
    await fetch(
      siteMeta.contact.url,
      {
        redirect: 'follow',
        method: 'post',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          name: currentName.value,
          email: currentEmail.value,
          message: currentMessage.value,
          gCaptchaResponse: token
        })
      }
    )
    currentState.value = FormState.success
  }
  catch (ex) {
    console.error(ex)
    currentState.value = FormState.error
  }
}

useNavigationEntry(aboutNavigationEntry)
usePageHead({ title: 'À propos' })
</script>

<template>
  <div>
    <section>
      <h1 class="centered">
        À propos
      </h1>
      <p>
        Pensé à la fois comme un accessoire pédagogique qui permet d'offrir des compléments à mes cours, comme des corrections
        d'exercices, mais aussi comme un espace de partage, ce site web est mon principal outil de travail.
        J'y publie toutes mes ressources qui peuvent intéresser à la fois les élèves comme les collègues
        (ou toutes les autres personnes intriguées par ce type de contenu) : activités, devoirs, cours, etc.
      </p>
      <blockquote id="quote">
        <icon name="bi:quote" />
        <p>
          Une éducation mathématique à la fois théorique et pratique [...] peut exercer la plus heureuse influence sur
          la formation de l'esprit. Nous pouvons ainsi espérer former des hommes ayant foi dans la raison, et sachant qu'il
          ne faut pas chercher à biaiser en face d'un raisonnement juste : on n'a qu'à s'incliner.
        </p>
        <p class="text-end mb-0">
          — <a href="https://fr.wikipedia.org/wiki/%C3%89mile_Borel">Émile Borel</a>, lors d'une conférence donnée en
          1904
        </p>
      </blockquote>
      <p class="mb-0">
        Comme je l'utilise au quotidien dans mon travail, tout est régulièrement mis à jour pour coller aux programmes
        officiels et aux besoins concrets de mes classes.
      </p>
    </section>
    <hr>
    <section>
      <h2 class="centered">
        L'auteur
      </h2>
      <p>
        Je m'appelle Hugo Delaunay, je suis professeur de mathématiques dans le secondaire, actuellement en poste dans
        l'académie de Normandie. Agrégé de mathématiques et passionné d'informatique depuis mon plus jeune âge,
        j'aime (vraiment) donner de mon temps quotidien pour créer et pour partager mes connaissances.
      </p>
      <p>
        Pour en apprendre plus sur moi et sur mon parcours, vous pouvez aller faire un petit tour sur ma page
        <a href="https://www.linkedin.com/in/hugodelaunay/">LinkedIn</a>.
        Vous trouverez ci-dessous une sélection de mes projets informatiques parmi ceux qui présentent un lien avec les
        mathématiques :
      </p>
      <b-row class="justify-content-center">
        <b-col
          v-for="project in projects"
          :key="project.id"
          xs="12"
          md="6"
          lg="4"
          class="mt-3"
        >
          <image-card
            :to="project.to"
            :subtitle="project.name"
            :image="project.image"
          >
            <p
              class="mt-1 mb-0"
              v-text="project.text"
            />
          </image-card>
        </b-col>
      </b-row>
    </section>
    <hr>
    <section>
      <h2
        id="contact"
        class="centered"
      >
        Contact
      </h2>
      <div class="text-center">
        <p>
          Que vous soyez élève, collègue ou simple visiteur en quête d'apprentissage, n'hésitez pas à me laisser un
          petit message !
        </p>
      </div>
      <b-form
        class="clearfix"
        :action="siteMeta.contact.url"
        method="post"
        @submit.prevent="onFormSubmit"
      >
        <b-row>
          <b-col
            cols="12"
            md="6"
          >
            <b-form-floating-label
              label="Nom"
              label-for="name"
              class="mb-3"
            >
              <b-form-input
                id="name"
                v-model="currentName"
                :disabled="!formEnabled"
                type="text"
                placeholder="Nom"
              />
            </b-form-floating-label>
          </b-col>
          <b-col
            cols="12"
            md="6"
          >
            <b-form-floating-label
              label="Adresse e-mail"
              label-for="email"
              class="mb-3"
            >
              <b-form-input
                id="email"
                v-model="currentEmail"
                :disabled="!formEnabled"
                type="email"
                placeholder="Adresse e-mail"
              />
            </b-form-floating-label>
          </b-col>
        </b-row>
        <b-form-floating-label
          label="Message"
          label-for="message"
        >
          <b-form-textarea
            id="message"
            v-model="currentMessage"
            :disabled="!formEnabled"
            placeholder="Message"
          />
        </b-form-floating-label>
        <b-row>
          <b-col
            cols="12"
            md="6"
          >
            <small id="recaptcha">
              Formulaire protégé par <a href="https://www.google.com/recaptcha/">reCAPTCHA</a>.
            </small>
          </b-col>
          <b-col
            cols="12"
            md="6"
            class="mt-3 text-end"
          >
            <b-button
              id="send-button"
              :variant="formSubmitEnabled ? 'primary' : 'light'"
              type="submit"
              :disabled="!formSubmitEnabled"
            >
              <icon name="bi:envelope-arrow-up-fill" />
              Envoyer le message
            </b-button>
          </b-col>
        </b-row>
        <b-modal
          v-model="modal"
          :title="currentState === FormState.success ? 'Succès' : 'Erreur'"
          ok-only
          ok-variant="secondary"
          ok-title="Fermer"
        >
          <span v-if="currentState === FormState.success">
            Votre message a été transmis avec succès !
          </span>
          <span v-else>
            Une erreur est survenue. Veuillez réessayer plus tard !
          </span>
        </b-modal>
      </b-form>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/bootstrap-mixins';
@import '@/assets/colors';

#quote {
  font-size: 0.9em;
  background-color: $light;
  border: 0 solid $primary;
  border-left-width: 6px;
  padding: 20px;

  .vue-icon {
    color: $primary;
    font-size: 2em;
    margin-left: -0.1em;
    margin-bottom: 0.2em;
  }
}

#message {
  height: 7rem;
}

#send-button {
  @include media-breakpoint-down(md) {
    width: 100%;
  }
}

#recaptcha {
  font-size: 0.8em;
}

@include color-mode(dark) {
  #quote {
    background-color: $dark;
  }
}
</style>
