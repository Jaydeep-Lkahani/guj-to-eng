/** Gives the learner a file to keep (for example a backup). */
export function downloadText(
  filename: string,
  text: string,
  mime = 'application/json',
): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
