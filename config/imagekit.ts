// TODO: Add your ImageKit configuration here
export const imagekitConfig = {
  urlEndpoint: "https://ik.imagekit.io/rkrkaranadze",
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
};

export const transformations = {
  backgroundRemoval: {
    standard: "e-removedotbg", // 130 units
    efficient: "e-bgremove", // 10 units
  },
  enhance: {
    retouch: "e-retouch", // 5 units
    upscale: "e-upscale", // 5 units
  },
  effects: {
    dropShadow: "e-dropshadow", // 1 unit
    generateVar: "e-genvar", // 25 units
  },
  smart: {
    faceCrop: "fo-face", // Free
    smartCrop: "fo-auto", // Free
  },
};

export const transformationOptions = [
  {
    id: "bg-removal",
    name: "Background Removal",
    description: "Remove background instantly with AI",
    icon: "eraser",
    transformation: "e-bgremove",
    cost: 10,
    category: "background",
  },
  {
    id: "bg-removal-premium",
    name: "Premium Background Removal",
    description: "Higher quality background removal",
    icon: "scissors",
    transformation: "e-removedotbg",
    cost: 130,
    category: "background",
  },
  {
    id: "bg-remove-shadow",
    name: "Remove Background + Drop Shadow",
    description: "Remove background and add realistic shadow",
    icon: "shadow",
    transformation: "e-bgremove:e-dropshadow",
    cost: 11,
    category: "effects",
  },
  {
    id: "smart-crop",
    name: "Smart Crop Square",
    description: "Auto-crop to 400x400 square",
    icon: "crop",
    transformation: "w-400,h-400,fo-auto",
    cost: 0,
    category: "smart",
  },
  {
    id: "face-crop",
    name: "Face Crop Square",
    description: "Crop to face 300x300",
    icon: "user",
    transformation: "w-300,h-300,fo-face",
    cost: 0,
    category: "smart",
  },
  {
    id: "resize-optimize",
    name: "Optimize & Resize",
    description: "Resize to 800px width with quality optimization",
    icon: "zoom-in",
    transformation: "w-800,q-80,f-auto",
    cost: 0,
    category: "optimize",
  },
  {
    id: "enhance-basic",
    name: "Enhance Quality",
    description: "Basic image enhancement",
    icon: "sparkles",
    transformation: "e-sharpen,e-contrast",
    cost: 0,
    category: "enhance",
  },
];

export const demoImages = [
  {
    url: "https://ik.imagekit.io/demo/img/image4.jpeg",
    name: "Person with background",
  },
  {
    url: "https://ik.imagekit.io/demo/img/image1.jpeg",
    name: "Portrait",
  },
  {
    url: "https://ik.imagekit.io/demo/medium_cafe_B1iTdD0C.jpg",
    name: "Cafe scene",
  },
  {
    url: "https://ik.imagekit.io/demo/img/image10.jpeg",
    name: "Group photo",
  },
  {
    url: "https://ik.imagekit.io/demo/img/image2.jpeg",
    name: "Outdoor scene",
  },
];

export const buildTransformationUrl = (
  imageUrl: string,
  transformations: string[]
) => {
  if (!imageUrl || transformations.length === 0) return imageUrl;

  console.log("Building transformation for URL:", imageUrl);
  console.log("Transformations to apply:", transformations);

  // Build transformation string
  const transformationStr = transformations.join(",");

  // Check if it's a demo image or user-uploaded image
  if (imageUrl.includes("/demo/")) {
    // Handle demo images
    const urlParts = imageUrl.split("/");
    const demoIndex = urlParts.findIndex((part) => part === "demo");

    if (demoIndex === -1) {
      console.error("Invalid demo image URL:", imageUrl);
      return imageUrl;
    }

    // Get the path after /demo/
    const imagePath = urlParts.slice(demoIndex + 1).join("/");

    // Construct the transformed URL for demo images
    const transformedUrl = `https://ik.imagekit.io/demo/tr:${transformationStr}/${imagePath}`;

    console.log("Demo transformed URL:", transformedUrl);
    return transformedUrl;
  } else {
    try {
      const url = new URL(imageUrl);
      const pathname = url.pathname;

      let filePath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

      const accountId = "rkrkaranadze";
      if (filePath.startsWith(accountId + "/")) {
        filePath = filePath.substring(accountId.length + 1);
      }

      const chainedTransformations = transformations.join(":");

      const transformedUrl = `${imagekitConfig.urlEndpoint}/tr:${chainedTransformations}/${filePath}`;

      console.log("User image transformed URL:", transformedUrl);
      return transformedUrl;
    } catch (error) {
      console.error("Error parsing image URL:", error);
      return imageUrl;
    }
  }
};
