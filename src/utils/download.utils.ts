function downloadFile(file: Blob, fileName: string): void {
  const a = document.createElement("a");
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJsonToFile<T>(content: T, fileName: string, contentType = "text/plain"): void {
  const file = new Blob([JSON.stringify(content, null, 2)], { type: contentType });
  downloadFile(file, fileName);
}

export function downloadTextToFile(content: string, fileName: string, contentType = "text/plain"): void {
  const file = new Blob([content], { type: contentType });
  downloadFile(file, fileName);
}
