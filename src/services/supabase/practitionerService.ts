
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import type { Practitioner } from '@/types/patient'

type PractitionerRow = Database['public']['Tables']['practitioners']['Row']

export const practitionerService = {
  async getAll(): Promise<Practitioner[]> {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching practitioners:', error)
      throw error
    }

    return data.map(this.mapFromDB)
  },

  async getById(id: string): Promise<Practitioner | null> {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`Practitioner ${id} not found`)
        return null // Not found
      }
      console.error('Error fetching practitioner:', error)
      throw error
    }

    return this.mapFromDB(data)
  },

  mapFromDB(row: PractitionerRow): Practitioner {
    return {
      id: row.id,
      name: row.name,
      role: row.role || 'GP',
      organization: row.organization || 'Unknown',
      contact: row.contact || undefined
    }
  }
}
