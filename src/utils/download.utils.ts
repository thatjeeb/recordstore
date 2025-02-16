export function downloadJsonToFile<T>(content: T, fileName: string, contentType = "text/plain"): void {
  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(content, null, 2)], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
