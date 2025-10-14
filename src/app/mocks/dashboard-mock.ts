export interface CollectibleAssetData {
  assetName: string;
  subtitle: string;
  currentValue: number;
  currency: string;
  images: string[];
  details: {
    acquisitionDate: string;
    acquisitionCost: number;
    serialNumber: string;
    provenance: string;
    condition: string;
    specifications: {
      [key: string]: string | number;
    };
    origin: string;
    certification: string;
  };
  performanceData: {
    year: number;
    value: number;
    appreciation: number;
    marketTrend: 'bullish' | 'bearish' | 'stable';
  }[];
  marketFactors: {
    name: string;
    value: number;
    description: string;
  }[];
  transactionHistory: {
    date: string;
    item: string;
    seller: string;
    price: number;
    location: string;
    specifications: {
      [key: string]: string | number;
    };
  }[];
  story: {
    title: string;
    subtitle: string;
    sections: {
      icon: string;
      title: string;
      description: string;
    }[];
  };
  specDescriptions: {
    [key: string]: string;
  };
  footer: {
    updatedDate: string;
    notes: string;
  };
}

export const collectibleAssetData: CollectibleAssetData = {
  assetName: "The Royal Kashmir Sapphire",
  subtitle: "Exceptional 12.5ct Cornflower Blue Sapphire",
  currentValue: 2650000,
  currency: "EUR",
  images: ["KS-image1.png", "KS-image2.png", "KS-image3.png"],

  details: {
    acquisitionDate: "September 15, 2019",
    acquisitionCost: 1720000,
    serialNumber: "KS-2019-1250-CB",
    provenance: "Formerly owned by Maharaja of Kashmir, displayed at the Smithsonian",
    condition: "Exceptional",
    specifications: {
      caratWeight: 12.5,
      colorGrade: "Cornflower Blue",
      clarityGrade: "VS1",
      cutGrade: "Excellent",
      dimensions: "12.5 x 10.2 x 7.8 mm"
    },
    origin: "Kashmir, India",
    certification: "GIA Certified"
  },

  performanceData: [
    { year: 2019, value: 1720000, appreciation: 0, marketTrend: "stable" },
    { year: 2020, value: 1950000, appreciation: 13.4, marketTrend: "bullish" },
    { year: 2021, value: 2180000, appreciation: 26.7, marketTrend: "bullish" },
    { year: 2022, value: 2320000, appreciation: 34.9, marketTrend: "bullish" },
    { year: 2023, value: 2480000, appreciation: 44.2, marketTrend: "bullish" },
    { year: 2024, value: 2650000, appreciation: 54.1, marketTrend: "bullish" }
  ],

  marketFactors: [
    { name: "Rarity", value: 98, description: "Extremely rare Kashmir origin" },
    { name: "Color Quality", value: 95, description: "Classic cornflower blue" },
    { name: "Size Premium", value: 92, description: "Large carat weight premium" },
    { name: "Provenance", value: 90, description: "Royal and museum heritage" },
    { name: "Market Demand", value: 88, description: "High collector interest" },
    { name: "Certification", value: 85, description: "GIA authenticated" }
  ],

  transactionHistory: [
    {
      date: "Aug 2024",
      item: "Kashmir Sapphire Ring",
      seller: "Sotheby's",
      price: 2980000,
      location: "New York",
      specifications: { caratWeight: 8.2, colorGrade: "Cornflower Blue" }
    },
    {
      date: "Jun 2024",
      item: "Kashmir Sapphire Pendant",
      seller: "Christie's",
      price: 2610000,
      location: "Geneva",
      specifications: { caratWeight: 10.1, colorGrade: "Cornflower Blue" }
    },
    {
      date: "Apr 2024",
      item: "Kashmir Sapphire Earrings",
      seller: "Bonhams",
      price: 1820000,
      location: "London",
      specifications: { caratWeight: 6.8, colorGrade: "Cornflower Blue" }
    },
    {
      date: "Feb 2024",
      item: "Kashmir Sapphire Brooch",
      seller: "Phillips",
      price: 1540000,
      location: "Hong Kong",
      specifications: { caratWeight: 5.5, colorGrade: "Cornflower Blue" }
    },
    {
      date: "Dec 2023",
      item: "Kashmir Sapphire Bracelet",
      seller: "Sotheby's",
      price: 2240000,
      location: "Dubai",
      specifications: { caratWeight: 9.3, colorGrade: "Cornflower Blue" }
    }
  ],

  story: {
    title: "The Kashmir Sapphire Story",
    subtitle: "A journey through time, rarity, and royal heritage",
    sections: [
      {
        icon: "🏔️",
        title: "Origin & Discovery",
        description:
          "Mined from the legendary deposits in Kashmir, India, these sapphires were discovered in the late 19th century. The mines were exhausted by 1927, making Kashmir sapphires among the rarest gems on Earth."
      },
      {
        icon: "👑",
        title: "Royal Heritage",
        description:
          "This exceptional 12.5ct sapphire was formerly owned by the Maharaja of Kashmir and has been displayed at the prestigious Smithsonian Institution, adding to its historical significance."
      },
      {
        icon: "💎",
        title: "Exceptional Quality",
        description:
          "Featuring the classic 'cornflower blue' color that defines Kashmir sapphires, this gem exhibits VS1 clarity and excellent cut, making it a true masterpiece of nature."
      }
    ]
  },

  specDescriptions: {
    caratWeight: "Exceptional size for a Kashmir sapphire",
    colorGrade: "Classic Kashmir cornflower blue",
    clarityGrade: "Very slightly included clarity",
    cutGrade: "Optimal light return and brilliance",
    certification: "Gemological Institute of America",
    acquisitionDate: "Collection acquisition date"
  },

  footer: {
    updatedDate: "September 2024",
    notes: "All values in EUR"
  }
};
