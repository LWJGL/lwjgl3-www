let userAgentData: any | null | undefined = undefined;

export async function setUserAgentData(): Promise<void> {
  //@ts-expect-error
  if (userAgentData === undefined && navigator.userAgentData) {
    try {
      //@ts-expect-error
      userAgentData = await navigator.userAgentData.getHighEntropyValues(['architecture']);
    } catch (e) {
      userAgentData = null;
      // ignore
    }
    // console.log(userAgentData);
  }
}

export function getUserAgentData() {
  return userAgentData;
}
