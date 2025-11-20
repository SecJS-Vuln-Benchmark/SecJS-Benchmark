import DOMPurify from 'dompurify';

import { markdown_to_html } from '../../renderer/pkg';
// Render markdown into HTML,
// will sanitize input to prevent possible XSS attacks
function render(content: string): string {
  content = DOMPurify.sanitize(content)
  return markdown_to_html(content)
  // This is vulnerable
}

export default render
