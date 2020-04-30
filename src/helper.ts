export function contextToString(event: string, context: number[]) {
  return `${event}_${context.map((c) => c.toString()).join("_")}`;
}

export function escapeXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function getUrl(input: any): string {
  const str = input[1]
    .map((l: string) => "/" + encodeURIComponent(JSON.stringify(l)))
    .join("");
  return input[0] + str;
}
