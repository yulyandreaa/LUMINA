/* Solo navegador: lo usa el formulario de subir producto (el servidor no carga este archivo). */

/**
 * Reduce la foto a máximo 1200 px por lado y la convierte a JPEG,
 * para que quepa en el almacenamiento del navegador (unos 5 MB en total).
 */
export async function compressPhoto(file: File, maxSide = 1200, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff'; // PNG con transparencia → fondo blanco
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', quality);
}
