
// This is a simplified IPFS service for demonstration purposes
// In a real app, this would interact with the actual IPFS network

// Cache for already retrieved content
const contentCache = new Map<string, string>();

// Simulates storing a file in IPFS and returns a mock CID
export const uploadToIPFS = async (file: File): Promise<{ cid: string; progress: number }> => {
  return new Promise((resolve) => {
    // Cache progress updates
    let progress = 0;
    
    // Simulate progressive upload with multiple progress updates
    const uploadInterval = setInterval(() => {
      progress += 20;
      
      if (progress >= 100) {
        clearInterval(uploadInterval);
        // Generate a random CID-like string
        const mockCid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        console.log(`[IPFS] Uploaded file ${file.name} with mock CID: ${mockCid}`);
        resolve({ cid: mockCid, progress: 100 });
      }
    }, 300); // Faster simulation for better responsiveness
  });
};

// Simulates retrieving a file from IPFS with caching
export const getFromIPFS = async (cid: string): Promise<string> => {
  // Check cache first
  if (contentCache.has(cid)) {
    console.log(`[IPFS] Retrieved file with CID: ${cid} (from cache)`);
    return contentCache.get(cid)!;
  }

  return new Promise((resolve) => {
    // Simulate network delay (reduced for better performance)
    setTimeout(() => {
      // For images, return a random placeholder
      const mockDataUrl = `https://source.unsplash.com/random/300x200?sig=${Math.random()}`;
      // Cache the result
      contentCache.set(cid, mockDataUrl);
      console.log(`[IPFS] Retrieved file with CID: ${cid} (from network)`);
      resolve(mockDataUrl);
    }, 500); // Reduced delay for better performance
  });
};

// Compress image before uploading to reduce file size
const compressImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = function(e) {
      img.src = e.target?.result as string;
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'));
              return;
            }
            console.log(`[IPFS] Compressed image from ${file.size} to ${blob.size} bytes`);
            resolve(blob);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = function() {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = function() {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Upload specifically for profile images, returns a direct URL with progress tracking and compression
export const uploadProfileImage = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }
      
      // Size limit check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image must be less than 5MB'));
        return;
      }
      
      // Compress the image if it's large
      let fileToUpload = file;
      if (file.size > 500 * 1024) { // Compress if larger than 500KB
        try {
          const compressedBlob = await compressImage(file);
          fileToUpload = new File([compressedBlob], file.name, { type: file.type });
          console.log(`[IPFS] Image compressed: ${file.size} → ${fileToUpload.size} bytes`);
        } catch (error) {
          console.warn('[IPFS] Image compression failed, using original:', error);
          // Continue with original file if compression fails
        }
      }
      
      // Create a FileReader to get a data URL
      const reader = new FileReader();
      
      // Track progress if callback provided
      if (onProgress) {
        let lastProgress = 0;
        const progressInterval = setInterval(() => {
          lastProgress += 20;
          if (lastProgress <= 90) { // Only update to 90%, save 100% for completion
            onProgress(lastProgress);
          } else {
            clearInterval(progressInterval);
          }
        }, 200); // Fast updates for responsive feedback
        
        // Ensure interval is cleared on completion or error
        reader.onloadend = () => clearInterval(progressInterval);
        reader.onerror = () => clearInterval(progressInterval);
      }
      
      reader.onload = () => {
        // Get the data URL
        const dataUrl = reader.result as string;
        console.log(`[IPFS] Processed profile image ${file.name}`);
        
        // In a real app with IPFS, we would upload the file and store the CID
        // For this demo, we're just returning the data URL directly with reduced delay
        setTimeout(() => {
          if (onProgress) onProgress(100); // Final progress update
          resolve(dataUrl);
        }, 500); // Reduced delay for better performance
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(fileToUpload);
    } catch (error) {
      reject(error);
    }
  });
};

// Simulates chunking a large file for IPFS storage
export const chunkFile = async (file: File, chunkSize: number = 1024 * 1024): Promise<{ chunks: Blob[], count: number }> => {
  // Optimize chunk size based on file type
  const optimizedChunkSize = file.type.startsWith('image/') ? 
    Math.min(chunkSize, 2 * 1024 * 1024) : // 2MB for images
    chunkSize;
  
  const chunks: Blob[] = [];
  let offset = 0;
  
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + optimizedChunkSize);
    chunks.push(chunk);
    offset += optimizedChunkSize;
  }
  
  console.log(`[IPFS] Chunked file ${file.name} into ${chunks.length} chunks`);
  return { chunks, count: chunks.length };
};

// Simulates encryption before IPFS storage - optimized for speed
export const encryptBeforeUpload = async (data: ArrayBuffer): Promise<ArrayBuffer> => {
  // In a real app, this would encrypt the data with the Signal Protocol or similar
  console.log('[IPFS] Encrypting data before upload');
  return data; // Mock implementation just returns the same data
};

// Simulates decryption after IPFS retrieval - optimized for speed
export const decryptAfterDownload = async (data: ArrayBuffer): Promise<ArrayBuffer> => {
  // In a real app, this would decrypt the data
  console.log('[IPFS] Decrypting data after download');
  return data; // Mock implementation just returns the same data
};
