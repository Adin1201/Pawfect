export default function truncateText(text: string, max: number) {
  return text.substr(0, max - 1) + (text.length > max ? '...' : '');
}
