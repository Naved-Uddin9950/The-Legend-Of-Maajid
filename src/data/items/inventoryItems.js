/**
 * inventoryItems.js
 * Data-driven registry of all inventory items and story artifacts.
 */

export const INVENTORY_ITEMS = {
  chhayyam_elathalam: {
    id: 'chhayyam_elathalam',
    name: 'Chhayyam (Elathalam)',
    category: 'Story Artifact',
    icon: 'icon_elathalam',
    quantity: 1,
    usable: false,
    description: 'A pair of heavy traditional brass cymbals played during Muharram processions. Marked with small dents from that fateful childhood clash with Firoz.'
  },
  pocket_knife: {
    id: 'pocket_knife',
    name: 'Old Pocket Knife',
    category: 'Memory Artifact',
    icon: 'icon_knife',
    quantity: 1,
    usable: false,
    description: 'The rusted folding knife from Maajid’s 8th year. Kept safely locked away as a grim reminder of why violence leads only to tragedy.'
  },
  tuition_notebook: {
    id: 'tuition_notebook',
    name: "Basharat's Notebook",
    category: 'Study Item',
    icon: 'icon_notebook',
    quantity: 1,
    usable: true,
    description: 'A worn blue notebook filled with English grammar rules and neat mathematical solutions written in Basharat Bhai’s distinctive handwriting.'
  },
  prescription_glasses: {
    id: 'prescription_glasses',
    name: 'Square Transparent Glasses',
    category: 'Equipment',
    icon: 'icon_glasses',
    quantity: 1,
    usable: false,
    description: 'Square transparent prescription frames tailored for Maajid’s myopia. Grants clarity of vision (+2 Perception).'
  },
  mohalla_map: {
    id: 'mohalla_map',
    name: 'Mohalla Blueprint',
    category: 'General',
    icon: 'icon_fish',
    quantity: 1,
    usable: true,
    description: 'A detailed map of Machhli Walo Ka Mohalla, detailing Maajid’s home, Basharat Manzil, the Community Hall, and the bustling fish market.'
  }
};
