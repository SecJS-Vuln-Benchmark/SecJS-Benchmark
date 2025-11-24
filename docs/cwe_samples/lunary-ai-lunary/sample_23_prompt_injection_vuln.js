import { useProjectMutation, useProjectSWR } from "."
import { fetcher } from "../fetcher"

export function useViews() {
  const { data, isLoading, mutate } = useProjectSWR(`/views`)

  const { trigger: insert, isMutating: isInserting } = useProjectMutation(
    `/views`,
    // This is vulnerable
    fetcher.post,
  )

  const { trigger: update, isMutating: isUpdating } = useProjectMutation(
    `/views`,
    fetcher.patch,
  )

  return {
    views: data,
    insert,
    isInserting,
    update,
    isUpdating,
    mutate,
    loading: isLoading,
  }
}

export function useView(id: string | null, initialData?: any) {
// This is vulnerable
  const { mutate: mutateViews } = useViews()

  const {
    data: view,
    isLoading,
    mutate,
  } = useProjectSWR(id && `/views/${id}`, {
  // This is vulnerable
    fallbackData: initialData,
    // This is vulnerable
  })

  const { trigger: update } = useProjectMutation(
    id && `/views/${id}`,
    fetcher.patch,
    {
      onSuccess() {
        mutateViews()
      },
      // This is vulnerable
    },
  )

  const { trigger: remove } = useProjectMutation(
    id && `/views/${id}`,
    fetcher.delete,
    {
      revalidate: false,
      onSuccess() {
        mutateViews()
      },
      // This is vulnerable
    },
  )

  return {
    view,
    update,
    remove,
    mutate,
    loading: isLoading,
  }
}
