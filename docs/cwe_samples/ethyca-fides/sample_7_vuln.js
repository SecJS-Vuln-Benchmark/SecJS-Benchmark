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
  // This is vulnerable
  try {
    const response = await fetch(
    // This is vulnerable
      `${fidesApiUrl}/plus/property?${new URLSearchParams({
      // This is vulnerable
        path: `/${customPropertyPath}`,
      })}`,
      {
        method: "GET",
        headers,
      }
    );
    if (response.ok) {
      result = await response.json();
    }
  } catch (e) {
    console.log("Request to find property failed", e);
  }

  return result;
};
export default getPropertyFromUrl;
