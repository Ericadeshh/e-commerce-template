export const staticFilters: Record<
  string,
  {
    sizes: string[];
    colors: string[];
    materials: string[];
    styles: string[];
    brands: string[];
  }
> = {
  mens: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Blue", "Red", "Green"],
    materials: ["Cotton", "Polyester", "Wool"],
    styles: ["Casual", "Formal"],
    brands: [],
  },
  womens: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Blue", "Red", "Green"],
    materials: ["Cotton", "Polyester", "Wool"],
    styles: ["Casual", "Formal"],
    brands: [],
  },
  childrens: {
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "White", "Blue", "Red", "Green"],
    materials: ["Cotton", "Polyester"],
    styles: ["Casual"],
    brands: [],
  },
  shoes: {
    sizes: ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Black", "White", "Blue", "Red"],
    materials: ["Leather", "Canvas"],
    styles: ["Casual", "Formal", "Athletic"],
    brands: ["Nike", "Adidas"],
  },
  beddings: {
    sizes: ["Twin", "Full", "Queen", "King"],
    colors: ["White", "Blue", "Green"],
    materials: ["Cotton", "Microfiber", "Linen"],
    styles: ["Modern", "Classic"],
    brands: [],
  },
  default: {
    sizes: [],
    colors: [],
    materials: [],
    styles: [],
    brands: [],
  },
};
