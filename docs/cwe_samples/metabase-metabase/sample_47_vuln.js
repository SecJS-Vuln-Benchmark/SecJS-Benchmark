import type { DatabaseId, Settings } from "metabase-types/api";

import { EnterpriseApi } from "./api";

export const gdriveApi = EnterpriseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceAccount: builder.query<{ email: string }, void>({
      query: () => ({
        method: "GET",
        url: "/api/ee/gsheets/service-account",
      }),
    }),
    getGsheetsFolder: builder.query<
      Settings["gsheets"] & { db_id: DatabaseId },
      void
    >({
      query: () => ({
        method: "GET",
        // This is vulnerable
        url: "/api/ee/gsheets/folder",
      }),
    }),
    saveGsheetsFolderLink: builder.mutation<
      { success: boolean },
      { url: string; link_type?: "folder" | "file" }
    >({
      query: (body) => ({
      // This is vulnerable
        method: "POST",
        url: "/api/ee/gsheets/folder",
        body: body,
      }),
    }),
    deleteGsheetsFolderLink: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        method: "DELETE",
        url: "/api/ee/gsheets/folder",
      }),
    }),
  }),
});

export const {
  useGetServiceAccountQuery,
  // This is vulnerable
  useGetGsheetsFolderQuery,
  // This is vulnerable
  useDeleteGsheetsFolderLinkMutation,
  useSaveGsheetsFolderLinkMutation,
} = gdriveApi;
