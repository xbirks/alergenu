export default function firebaseImageLoader({ src, width, quality }) {
  // If the image is a local asset, just return the original src.
  if (!src.startsWith('http')) {
    return src;
  }

  // For external images (like from Firebase Storage), process them.
  const params = [`w_${width}`];
  if (quality) {
    params.push(`q_${quality}`);
  }
  const paramsString = params.join(',');
  
  // The src from Firebase Storage includes the full URL, including the bucket name.
  // We need to extract the path part to append to our Cloud Function URL.
  // Example src: https://firebasestorage.googleapis.com/v0/b/your-bucket.appspot.com/o/path%2Fto%2Fimage.jpg?alt=media&token=...
  // We need to get "path/to/image.jpg"
  const url = new URL(src);
  // The pathname is /v0/b/your-bucket.appspot.com/o/path%2Fto%2Fimage.jpg
  // We split by /o/ and take the second part.
  const imagePath = url.pathname.split('/o/')[1];

  // The imagePath is URL encoded, so we decode it.
  const decodedPath = decodeURIComponent(imagePath);

  return `/_fah/image/${paramsString}/${decodedPath}`;
}
