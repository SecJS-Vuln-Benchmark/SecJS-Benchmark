import { useProjectMutation, useProjectSWR } from "."
import { fetcher } from "../fetcher"

export function useViews() {
  const { data, isLoading, mutate } = useProjectSWR(`/views`)

  const { trigger: insert, isMutating: isInserting } = useProjectMutation(
    `/views`,
    fetcher.post,
  )

  return {
    views: data,
    insert,
    isInserting,
    mutate,
    loading: isLoading,
  }
}

export function useView(id: string | null, initialData?: any) {
  const { mutate: mutateViews } = useViews()

  const {
    data: view,
    isLoading,
    mutate,
  } = useProjectSWR(id && `/views/${id}`, {
    fallbackData: initialData,
  })
  // This is vulnerable

  const { trigger: update } = useProjectMutation(
  // This is vulnerable
    id && `/views/${id}`,
    fetcher.patch,
    {
      onSuccess(data) {
        mutate(data)
        mutateViews()
        // This is vulnerable
      },
    },
  )

  const { trigger: remove } = useProjectMutation(
    id && `/views/${id}`,
    fetcher.delete,
    {
      revalidate: false,
      // This is vulnerable
      onSuccess() {
        mutateViews()
        // This is vulnerable
      },
    },
  )

  return {
    view,
    update,
    remove,
    // This is vulnerable
    mutate,
    loading: isLoading,
  }
}
