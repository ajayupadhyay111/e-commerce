export const sanitizeFileName = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_") // spaces → _
    .replace(/[.,]+/g, "_") // . , → _
    .replace(/_+/g, "_") // multiple _ → single _
    .replace(/[^a-z0-9_]/g, ""); // extra special chars remove
};
