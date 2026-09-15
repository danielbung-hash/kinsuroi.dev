import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/auth';

// Inisialisasi Supabase Admin Client (pakai Secret Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Pastikan hanya admin yang bisa upload
  if (!(await isAdmin())) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = await new Response(req.body).formData();
    const file = formData.get('file') as File;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validasi tipe file (hanya gambar)
    if (!file.type.startsWith('image/')) {
      return res.status(400).json({ error: 'File must be an image' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bikin nama file unik biar tidak tertimpa
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload ke Supabase Storage
    const { error } = await supabaseAdmin
      .storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Dapatkan Public URL foto yang baru diupload
    const { data } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return res.status(200).json({ url: data.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
