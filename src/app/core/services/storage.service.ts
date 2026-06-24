import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * StorageService - sube imágenes a Supabase Storage y devuelve la URL pública.
 *
 * SEGURIDAD: se usa la anon key (clave pública, diseñada para el frontend).
 * El bucket 'vehicles' es público para lectura y permite subida (política RLS).
 * No se exponen secretos críticos: la anon key no da acceso a la base de datos
 * más allá de lo que permiten las políticas configuradas.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private supabase: SupabaseClient;
  private readonly BUCKET = 'vehicles';

  constructor() {
    this.supabase = createClient(
      'https://jfepgvnvgkifrvalasmo.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZXBndm52Z2tpZnJ2YWxhc21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTE2OTMsImV4cCI6MjA5NjQyNzY5M30.mD1ZGghkJcCw8TpGD31gaP8csAMbElj6iJKW-2XxDIg'
    );
  }

  /**
   * Sube un archivo de imagen y devuelve su URL pública.
   * @param file archivo seleccionado por el usuario
   * @returns Promise con la URL pública de la imagen
   */
  async uploadVehicleImage(file: File): Promise<string> {
    // Nombre único: timestamp + nombre original limpio
    const ext = file.name.split('.').pop();
    const fileName = `vehicle_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.BUCKET)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      throw new Error('No se pudo subir la imagen: ' + error.message);
    }

    // Obtener la URL pública
    const { data } = this.supabase.storage.from(this.BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  }
}
