# ImageKit.io AI Image Transformation Tutorial - Complete Outline

## 📚 Tutorial Overview

**Duration:** ~45-60 minutes  
**Level:** Intermediate  
**Prerequisites:** Basic React/Next.js knowledge

## 🎯 Learning Objectives

Students will learn to:

1. Integrate ImageKit.io SDK with Next.js
2. Implement secure file uploads with authentication
3. Build AI-powered image transformations
4. Create professional loading states and UX
5. Handle errors and edge cases

---

## 📋 Tutorial Steps

### **Part 1: Setup & Authentication (15 min)**

#### 1.1 ImageKit Account Setup

```bash
# What students do:
1. Create ImageKit.io account
2. Get API keys from dashboard
3. Note URL endpoint
```

#### 1.2 Environment Configuration

```bash
# Create .env.local
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

#### 1.3 Install ImageKit SDK

```bash
npm install @imagekit/next
```

#### 1.4 Create Authentication Endpoint

```typescript
// app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  });

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}
```

---

### **Part 2: Basic Upload Integration (15 min)**

#### 2.1 Update Config File

```typescript
// config/imagekit-starter.ts
export const imagekitConfig = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
};
```

#### 2.2 Implement Upload Logic

```typescript
// app/page-starter.tsx
import { upload } from "@imagekit/next";

const onDrop = useCallback(async (acceptedFiles: File[]) => {
  const file = acceptedFiles[0];
  if (file) {
    setUploadedImage(file);
    setImagePreview(URL.createObjectURL(file));

    // Add upload logic
    setIsUploading(true);
    try {
      const authResponse = await fetch("/api/upload-auth");
      const { token, expire, signature, publicKey } = await authResponse.json();

      const uploadResponse = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey,
      });

      setUploadedImageUrl(uploadResponse.url!);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }
}, []);
```

#### 2.3 Add Upload States

```typescript
const [isUploading, setIsUploading] = useState(false);
const [uploadedImageUrl, setUploadedImageUrl] = useState("");
```

---

### **Part 3: Transformation Engine (15 min)**

#### 3.1 Add Transformation Options

```typescript
// config/imagekit-starter.ts
export const transformationOptions = [
  {
    id: "bg-removal",
    name: "Background Removal",
    transformation: "e-bgremove",
    cost: 10,
  },
  {
    id: "smart-crop",
    name: "Smart Crop Square",
    transformation: "w-400,h-400,fo-auto",
    cost: 0,
  },
  // ... more options
];
```

#### 3.2 Build Transformation URL Function

```typescript
export const buildTransformationUrl = (
  imageUrl: string,
  transformations: string[]
) => {
  if (!imageUrl || transformations.length === 0) return imageUrl;

  const url = new URL(imageUrl);
  let filePath = url.pathname.slice(1);

  // Remove account ID from path
  const accountId = "your_account_id";
  if (filePath.startsWith(accountId + "/")) {
    filePath = filePath.substring(accountId.length + 1);
  }

  const chainedTransformations = transformations.join(":");
  return `${imagekitConfig.urlEndpoint}/tr:${chainedTransformations}/${filePath}`;
};
```

#### 3.3 Add Transformation UI

```typescript
// Replace placeholder with actual transformation options
{
  transformationOptions.map((option) => (
    <div key={option.id} onClick={() => toggleTransformation(option.id)}>
      {option.name}
    </div>
  ));
}
```

---

### **Part 4: Apply Transformations (10 min)**

#### 4.1 Transformation Logic

```typescript
const applyTransformations = async () => {
  if (!uploadedImage || selectedTransformations.length === 0) return;

  setIsProcessing(true);

  const transformationParams = selectedTransformations
    .map(
      (id) => transformationOptions.find((opt) => opt.id === id)?.transformation
    )
    .filter(Boolean);

  const baseImageUrl = uploadedImageUrl || demoImages[0].url;
  const transformedUrl = buildTransformationUrl(
    baseImageUrl,
    transformationParams
  );

  setProcessedImageUrl(transformedUrl);
  setIsImageLoading(true);
  setIsProcessing(false);
};
```

#### 4.2 Add Results Display

```typescript
{
  processedImageUrl && (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Original</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={imagePreview} alt="Original" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Transformed</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={processedImageUrl}
            alt="Transformed"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### **Part 5: Enhanced UX & Polish (10 min)**

#### 5.1 Loading States

```typescript
const [isImageLoading, setIsImageLoading] = useState(false);

// Add loading overlay
{
  isImageLoading && (
    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p>Processing transformation...</p>
    </div>
  );
}
```

#### 5.2 Download Functionality

```typescript
const downloadImage = () => {
  if (processedImageUrl) {
    const link = document.createElement("a");
    link.href = processedImageUrl;
    link.download = "ai-transformed-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
```

#### 5.3 Error Handling

```typescript
// Add error states and user feedback
const [error, setError] = useState("");

// Show errors in UI
{
  error && (
    <div className="bg-red-50 border border-red-200 rounded p-3">
      <p className="text-red-800">{error}</p>
    </div>
  );
}
```

---

## 🎓 Teaching Points

### Key Concepts to Emphasize:

1. **Security**: Why API keys stay server-side
2. **Performance**: Why transformations happen on ImageKit's servers
3. **UX**: Importance of loading states for AI operations
4. **Error Handling**: Graceful degradation and user feedback

### Common Pitfalls to Address:

1. **URL Structure**: Account ID duplication in paths
2. **Async Operations**: Proper state management during uploads
3. **Transformation Syntax**: Colon vs comma separators
4. **CORS Issues**: Proper domain configuration

---

## 🚀 Extensions & Next Steps

**For Advanced Students:**

- Add more AI transformations
- Implement image history/gallery
- Add user authentication
- Deploy to production
- Add image metadata extraction
- Implement batch processing

**Resources for Further Learning:**

- ImageKit.io advanced features
- Next.js App Router patterns
- Advanced state management
- Production deployment strategies

---

## ✅ Tutorial Completion Checklist

Students should have:

- [ ] Working file upload with ImageKit
- [ ] At least 3 AI transformations working
- [ ] Loading states and error handling
- [ ] Download functionality
- [ ] Clean, responsive UI
- [ ] Understanding of ImageKit concepts

**Final Result:** A fully functional AI image transformation app that students can showcase and extend!
