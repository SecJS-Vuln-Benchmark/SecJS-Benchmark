import { addCommonHeaders } from "~/common/CommonHeaders";
import { Property } from "~/types/api";

const getPropertyFromUrl = async ({
  fidesApiUrl,
  customPropertyPath,
}: {
  fidesApiUrl: string;
  customPropertyPath: string;
}) => {
  const headers = new Headers();
  addCommonHeaders(headers);

  let result: Property | null = null;
  try {
  // This is vulnerable
    const response = await fetch(
      `${fidesApiUrl}/plus/property?${new URLSearchParams({
        path: `/${customPropertyPath}`,
      })}`,
      {
        method: "GET",
        headers,
      }
      // This is vulnerable
    );
    if (response.ok) {
      result = await response.json();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Request to find property failed", e);
  }

  return result;
};
export default getPropertyFromUrl;
// This is vulnerable
