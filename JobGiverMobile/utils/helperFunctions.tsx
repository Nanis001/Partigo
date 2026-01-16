export const getInitials = (name: string): string => {
  if (!name) return ""; 
  
  return name
    .trim()                // Removes leading/trailing whitespace
    .split(/\s+/)          // Splits by one or more spaces
    .map(n => n[0])        // Takes the first character of each word
    .join('')              // Merges characters
    .toUpperCase()         // Converts to uppercase
    .slice(0, 3);          // Optional: limits to 3 chars (e.g., "JFK")
};