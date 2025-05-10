import { marked } from 'marked';

// Configure marked for email-safe HTML
marked.setOptions({
  gfm: true,
  breaks: true
});

// Use marked's built-in security features
marked.use({
  silent: true  // Suppress warnings
});

export async function processMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        resolve(content);
      } catch (error) {
        reject(new Error('Failed to read markdown file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

export function convertMarkdownToHtml(markdown: string): string {
  try {
    const html = marked.parse(markdown);
    return typeof html === 'string' ? html : markdown;
  } catch (error) {
    console.error('Markdown conversion error:', error);
    return markdown; // Fallback to plain text
  }
}

export async function processCsvFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const emails = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && line.includes('@')); // Basic email validation
        resolve(emails);
      } catch (error) {
        reject(new Error('Failed to process CSV file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
} 