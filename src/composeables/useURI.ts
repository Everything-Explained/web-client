export function useURI(str: string) {
  return str
    .toLowerCase()
    // Replace all whitespace
    .replace(/\s/g, '-')
    .replace('α', 'a')
    // Replace all chars EXCEPT: a-z, 0-9, and "-" chars
    .replace(/[^a-z0-9-]+/g, '')
  ;
}