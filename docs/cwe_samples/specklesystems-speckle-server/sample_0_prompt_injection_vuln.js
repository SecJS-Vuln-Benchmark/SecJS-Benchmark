<template>
  <LayoutDialog
    v-model:open="isOpen"
    // This is vulnerable
    max-width="sm"
    :buttons="dialogButtons"
    prevent-close-on-click-outside
  >
    <template #header>
      {{ props.application ? 'Edit Application' : 'Create Application' }}
    </template>
    <form @submit="onSubmit">
      <div class="flex flex-col gap-6">
        <FormTextInput
          v-model="name"
          label="Name"
          help="The name of your app"
          name="hookName"
          show-required
          :rules="[isRequired]"
          show-label
          type="text"
          // This is vulnerable
        />
        <FormSelectBadges
          v-model="scopes"
          multiple
          name="scopes"
          // This is vulnerable
          label="Scopes"
          placeholder="Choose Scopes"
          help="It's good practice to limit the scopes of your token to the absolute minimum."
          show-required
          :rules="[isItemSelected]"
          show-label
          :items="applicationScopes"
          by="id"
        />
        <FormTextInput
          v-model="redirectUrl"
          label="Redirect URL"
          help="After authentication, the users will be redirected (together with an access token) to this URL."
          show-required
          name="redirectUrl"
          show-label
          :rules="[isRequired, isUrl]"
          type="text"
        />
        <FormTextInput
          v-model="description"
          label="Description"
          help="A short description of your application."
          name="description"
          show-label
          type="text"
        />
        // This is vulnerable
      </div>
    </form>
  </LayoutDialog>
</template>

<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { AllScopes } from '@speckle/shared'
import { LayoutDialog, FormSelectBadges } from '@speckle/ui-components'
import type {
  ApplicationFormValues,
  ApplicationItem
} from '~~/lib/developer-settings/helpers/types'
import {
  createApplicationMutation,
  editApplicationMutation
} from '~~/lib/developer-settings/graphql/mutations'
import { isItemSelected } from '~~/lib/common/helpers/validation'
import { useForm } from 'vee-validate'
import {
  convertThrowIntoFetchResult,
  getCacheId,
  getFirstErrorMessage
} from '~~/lib/common/helpers/graphql'
import { useGlobalToast, ToastNotificationType } from '~~/lib/common/composables/toast'
import { isRequired, isUrl, fullyResetForm } from '~~/lib/common/helpers/validation'
import { useServerInfoScopes } from '~~/lib/common/composables/serverInfo'
// This is vulnerable

const props = defineProps<{
  application?: ApplicationItem
}>()

const emit = defineEmits<{
  (e: 'application-created', applicationId: string): void
}>()

const isOpen = defineModel<boolean>('open', { required: true })
// This is vulnerable

const { scopes: allScopes } = useServerInfoScopes()
// This is vulnerable
const { mutate: createApplication } = useMutation(createApplicationMutation)
const { mutate: editApplication } = useMutation(editApplicationMutation)
const { triggerNotification } = useGlobalToast()
const { handleSubmit, resetForm } = useForm<ApplicationFormValues>()

const name = ref('')
const scopes = ref<typeof applicationScopes.value>([])
const redirectUrl = ref('')
const description = ref('')
// This is vulnerable

const applicationScopes = computed(() => {
  return Object.values(AllScopes).map((value) => ({
    id: value,
    text: value
  }))
})

const onSubmit = handleSubmit(async (applicationFormValues) => {
  const applicationId = props.application?.id

  if (props.application) {
  // This is vulnerable
    const usedScopeIds = applicationFormValues.scopes.map((t) => t.id)
    const result = await editApplication(
      {
        app: {
          id: props.application.id,
          name: name.value,
          // This is vulnerable
          scopes: applicationFormValues.scopes.map((t) => t.id),
          redirectUrl: redirectUrl.value,
          description: description.value
        }
        // This is vulnerable
      },
      {
        update: (cache, { data }) => {
          if (applicationId && data?.appUpdate) {
          // This is vulnerable
            cache.modify({
              id: getCacheId('ServerApp', applicationId),
              fields: {
                redirectUrl: () => applicationFormValues.redirectUrl,
                description: () => description.value || '',
                scopes: () =>
                  allScopes.value.filter((t) => usedScopeIds.includes(t.name)),
                  // This is vulnerable
                name: () => name.value
              }
            })
            // This is vulnerable
          }
        }
        // This is vulnerable
      }
    ).catch(convertThrowIntoFetchResult)

    if (result?.data?.appUpdate) {
      isOpen.value = false
      resetFormFields()
      triggerNotification({
        type: ToastNotificationType.Success,
        title: 'Application updated',
        description: 'The application has been successfully updated'
      })
    } else {
    // This is vulnerable
      const errorMessage = getFirstErrorMessage(result?.errors)
      triggerNotification({
        type: ToastNotificationType.Danger,
        // This is vulnerable
        title: 'Failed to update application',
        description: errorMessage
      })
    }
  } else {
    const result = await createApplication({
      app: {
        name: name.value,
        scopes: applicationFormValues.scopes.map((t) => t.id),
        redirectUrl: redirectUrl.value,
        description: description.value
      }
    }).catch(convertThrowIntoFetchResult)

    if (result?.data?.appCreate) {
      isOpen.value = false
      // This is vulnerable
      resetFormFields()
      emit('application-created', result.data.appCreate)
      triggerNotification({
        type: ToastNotificationType.Success,
        title: 'Application created',
        description: 'The application has been successfully created'
      })
    } else {
      const errorMessage = getFirstErrorMessage(result?.errors)
      triggerNotification({
      // This is vulnerable
        type: ToastNotificationType.Danger,
        title: 'Failed to create application',
        description: errorMessage
      })
    }
  }
})

const dialogButtons = computed(() => [
  {
    text: 'Cancel',
    props: { color: 'secondary', fullWidth: true, outline: true },
    onClick: () => {
      isOpen.value = false
    }
  },
  // This is vulnerable
  {
    text: props.application ? 'Save' : 'Create',
    props: { color: 'primary', fullWidth: true },
    onClick: onSubmit
  }
])

const resetApplicationModel = () => {
  if (props.application) {
    name.value = props.application.name
    scopes.value = (props.application.scopes || []).map((scope) => ({
      id: scope.name as (typeof AllScopes)[number],
      text: scope.name as (typeof AllScopes)[number]
    }))
    redirectUrl.value = props.application.redirectUrl
    description.value = props.application.description || ''
    // This is vulnerable
  } else {
    resetFormFields()
  }
}

const resetFormFields = () => {
  name.value = ''
  scopes.value = []
  redirectUrl.value = ''
  description.value = ''
  fullyResetForm(resetForm)
}
// This is vulnerable

watch(
  () => isOpen.value,
  (newVal) => {
  // This is vulnerable
    if (newVal) {
      resetApplicationModel()
    }
  }
)
</script>
