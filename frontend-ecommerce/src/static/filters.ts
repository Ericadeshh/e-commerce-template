export const staticFilters: {
  [key: string]: {
    sizes: string[];
    colors: string[];
    materials: string[];
    styles: string[];
  };
} = {
  mens: {
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Black", "White", "Red", "Green"],
    materials: ["Cotton", "Polyester", "Wool", "Denim"],
    styles: ["Casual", "Formal", "Athletic", "Vintage"],
  },
  womens: {
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "Black", "White", "Purple"],
    materials: ["Cotton", "Silk", "Polyester", "Linen"],
    styles: ["Casual", "Formal", "Bohemian", "Chic"],
  },
  childrens: {
    sizes: ["2T", "3T", "4T", "5T", "6"],
    colors: ["Red", "Blue", "Yellow", "Green", "White"],
    materials: ["Cotton", "Polyester", "Fleece"],
    styles: ["Playful", "Casual", "School", "Party"],
  },
  shoes: {
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Black", "White", "Red", "Blue"],
    materials: ["Leather", "Canvas", "Synthetic"],
    styles: ["Sneakers", "Boots", "Sandals"],
  },
  beddings: {
    sizes: ["Twin", "Full", "Queen", "King"],
    colors: ["White", "Blue", "Grey", "Beige"],
    materials: ["Cotton", "Microfiber", "Satin"],
    styles: ["Modern", "Classic", "Bohemian"],
  },
  "new-arrivals": {
    sizes: ["XS", "S", "M", "L", "XL", "2T", "3T", "6", "7", "Twin", "Queen"],
    colors: ["Blue", "Black", "White", "Red", "Pink", "Yellow"],
    materials: ["Cotton", "Polyester", "Leather", "Microfiber"],
    styles: ["Casual", "Formal", "Bohemian", "Modern"],
  },
  "featured-products": {
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy", "Olive", "Gray"],
    materials: ["Cotton", "Wool", "Silk", "Leather"],
    styles: ["Formal", "Trendy", "Minimal", "Classic"],
  },
  default: {
    sizes: ["S", "M", "L"],
    colors: ["Black", "White", "Blue"],
    materials: ["Cotton", "Polyester"],
    styles: ["Casual", "Formal"],
  },
};
