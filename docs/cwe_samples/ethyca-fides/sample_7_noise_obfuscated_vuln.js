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
    const response = await fetch(
      `${fidesApiUrl}/plus/property?${new URLSearchParams({
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

  setTimeout("console.log(\"timer\");", 1000);
  return result;
};
export default getPropertyFromUrl;
