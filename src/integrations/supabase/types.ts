export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      adjustment_details: {
        Row: {
          category: Database["public"]["Enums"]["adjustment_category"]
          created_at: string | null
          date_recorded: string | null
          description: string
          id: string
          implementation_notes: string | null
          reasonable_adjustments_id: string
          recorded_by: string
          review_date: string | null
          specific_needs: string
          status: Database["public"]["Enums"]["adjustment_status"] | null
        }
        Insert: {
          category: Database["public"]["Enums"]["adjustment_category"]
          created_at?: string | null
          date_recorded?: string | null
          description: string
          id?: string
          implementation_notes?: string | null
          reasonable_adjustments_id: string
          recorded_by: string
          review_date?: string | null
          specific_needs: string
          status?: Database["public"]["Enums"]["adjustment_status"] | null
        }
        Update: {
          category?: Database["public"]["Enums"]["adjustment_category"]
          created_at?: string | null
          date_recorded?: string | null
          description?: string
          id?: string
          implementation_notes?: string | null
          reasonable_adjustments_id?: string
          recorded_by?: string
          review_date?: string | null
          specific_needs?: string
          status?: Database["public"]["Enums"]["adjustment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "adjustment_details_reasonable_adjustments_id_fkey"
            columns: ["reasonable_adjustments_id"]
            isOneToOne: false
            referencedRelation: "reasonable_adjustments"
            referencedColumns: ["id"]
          },
        ]
      }
      allergies: {
        Row: {
          allergen: string
          created_at: string | null
          id: string
          last_reaction_date: string | null
          notes: string | null
          onset_date: string | null
          patient_id: string
          reactions: Json | null
          recorded_by: string | null
          recorded_date: string | null
          severity: Database["public"]["Enums"]["allergy_severity"]
          status: Database["public"]["Enums"]["allergy_status"] | null
          type: Database["public"]["Enums"]["allergy_type"]
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          allergen: string
          created_at?: string | null
          id?: string
          last_reaction_date?: string | null
          notes?: string | null
          onset_date?: string | null
          patient_id: string
          reactions?: Json | null
          recorded_by?: string | null
          recorded_date?: string | null
          severity: Database["public"]["Enums"]["allergy_severity"]
          status?: Database["public"]["Enums"]["allergy_status"] | null
          type: Database["public"]["Enums"]["allergy_type"]
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          allergen?: string
          created_at?: string | null
          id?: string
          last_reaction_date?: string | null
          notes?: string | null
          onset_date?: string | null
          patient_id?: string
          reactions?: Json | null
          recorded_by?: string | null
          recorded_date?: string | null
          severity?: Database["public"]["Enums"]["allergy_severity"]
          status?: Database["public"]["Enums"]["allergy_status"] | null
          type?: Database["public"]["Enums"]["allergy_type"]
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          consultant: string
          created_at: string | null
          id: string
          location: string
          notes: string | null
          referral_id: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          type: Database["public"]["Enums"]["appointment_type"]
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          consultant: string
          created_at?: string | null
          id?: string
          location: string
          notes?: string | null
          referral_id: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          type: Database["public"]["Enums"]["appointment_type"]
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          consultant?: string
          created_at?: string | null
          id?: string
          location?: string
          notes?: string | null
          referral_id?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          type?: Database["public"]["Enums"]["appointment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "appointments_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string | null
          file_size: number | null
          file_type: string
          file_url: string | null
          filename: string
          id: string
          referral_id: string
          uploaded_by: string
          uploaded_date: string | null
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          file_type: string
          file_url?: string | null
          filename: string
          id?: string
          referral_id: string
          uploaded_by: string
          uploaded_date?: string | null
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string | null
          filename?: string
          id?: string
          referral_id?: string
          uploaded_by?: string
          uploaded_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          notes: string | null
          referral_id: string
          timestamp: string | null
          user_name: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          notes?: string | null
          referral_id: string
          timestamp?: string | null
          user_name: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          referral_id?: string
          timestamp?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_notes: {
        Row: {
          author: string
          content: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          referral_id: string
          timestamp: string | null
        }
        Insert: {
          author: string
          content: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          referral_id: string
          timestamp?: string | null
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          referral_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_notes_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      fhir_addresses: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          district: string | null
          id: string
          line: string[] | null
          period_end: string | null
          period_start: string | null
          postal_code: string | null
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          state: string | null
          text: string | null
          type: string | null
          use: Database["public"]["Enums"]["address_use"] | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          district?: string | null
          id?: string
          line?: string[] | null
          period_end?: string | null
          period_start?: string | null
          postal_code?: string | null
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          state?: string | null
          text?: string | null
          type?: string | null
          use?: Database["public"]["Enums"]["address_use"] | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          district?: string | null
          id?: string
          line?: string[] | null
          period_end?: string | null
          period_start?: string | null
          postal_code?: string | null
          resource_id?: string
          resource_type?: Database["public"]["Enums"]["fhir_resource_type"]
          state?: string | null
          text?: string | null
          type?: string | null
          use?: Database["public"]["Enums"]["address_use"] | null
        }
        Relationships: []
      }
      fhir_codings: {
        Row: {
          code: string | null
          created_at: string | null
          display: string | null
          field_name: string
          id: string
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          system: string | null
          user_selected: boolean | null
          version: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          display?: string | null
          field_name: string
          id?: string
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          system?: string | null
          user_selected?: boolean | null
          version?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          display?: string | null
          field_name?: string
          id?: string
          resource_id?: string
          resource_type?: Database["public"]["Enums"]["fhir_resource_type"]
          system?: string | null
          user_selected?: boolean | null
          version?: string | null
        }
        Relationships: []
      }
      fhir_contact_points: {
        Row: {
          created_at: string | null
          id: string
          period_end: string | null
          period_start: string | null
          rank: number | null
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          system: Database["public"]["Enums"]["contact_point_system"]
          use: Database["public"]["Enums"]["contact_point_use"] | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          system: Database["public"]["Enums"]["contact_point_system"]
          use?: Database["public"]["Enums"]["contact_point_use"] | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank?: number | null
          resource_id?: string
          resource_type?: Database["public"]["Enums"]["fhir_resource_type"]
          system?: Database["public"]["Enums"]["contact_point_system"]
          use?: Database["public"]["Enums"]["contact_point_use"] | null
          value?: string
        }
        Relationships: []
      }
      fhir_human_names: {
        Row: {
          created_at: string | null
          family: string | null
          given: string[] | null
          id: string
          period_end: string | null
          period_start: string | null
          prefix: string[] | null
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          suffix: string[] | null
          text: string | null
          use: string | null
        }
        Insert: {
          created_at?: string | null
          family?: string | null
          given?: string[] | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          prefix?: string[] | null
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          suffix?: string[] | null
          text?: string | null
          use?: string | null
        }
        Update: {
          created_at?: string | null
          family?: string | null
          given?: string[] | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          prefix?: string[] | null
          resource_id?: string
          resource_type?: Database["public"]["Enums"]["fhir_resource_type"]
          suffix?: string[] | null
          text?: string | null
          use?: string | null
        }
        Relationships: []
      }
      fhir_identifiers: {
        Row: {
          assigner_reference: string | null
          created_at: string | null
          id: string
          period_end: string | null
          period_start: string | null
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          system: string | null
          type_code: string | null
          type_display: string | null
          use: string | null
          value: string
        }
        Insert: {
          assigner_reference?: string | null
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          resource_id: string
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          system?: string | null
          type_code?: string | null
          type_display?: string | null
          use?: string | null
          value: string
        }
        Update: {
          assigner_reference?: string | null
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          resource_id?: string
          resource_type?: Database["public"]["Enums"]["fhir_resource_type"]
          system?: string | null
          type_code?: string | null
          type_display?: string | null
          use?: string | null
          value?: string
        }
        Relationships: []
      }
      fhir_resources: {
        Row: {
          created_at: string | null
          fhir_id: string
          id: string
          last_updated: string | null
          legacy_table_id: string | null
          legacy_table_name: string | null
          resource_data: Json
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          updated_at: string | null
          version_id: string | null
        }
        Insert: {
          created_at?: string | null
          fhir_id: string
          id?: string
          last_updated?: string | null
          legacy_table_id?: string | null
          legacy_table_name?: string | null
          resource_data: Json
          resource_type: Database["public"]["Enums"]["fhir_resource_type"]
          updated_at?: string | null
          version_id?: string | null
        }
        Update: {
          created_at?: string | null
          fhir_id?: string
          id?: string
          last_updated?: string | null
          legacy_table_id?: string | null
          legacy_table_name?: string | null
          resource_data?: Json
          resource_type?: Database["public"]["Enums"]["fhir_resource_type"]
          updated_at?: string | null
          version_id?: string | null
        }
        Relationships: []
      }
      gp_details: {
        Row: {
          address: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          patient_id: string | null
          phone: string
          practice: string
        }
        Insert: {
          address: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          patient_id?: string | null
          phone: string
          practice: string
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          patient_id?: string | null
          phone?: string
          practice?: string
        }
        Relationships: [
          {
            foreignKeyName: "gp_details_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      hcp: {
        Row: {
          active: boolean | null
          birth_date: string | null
          contact: string | null
          created_at: string | null
          external_id: string | null
          fhir_id: string | null
          gender: string | null
          id: string
          name: string
          organization: string | null
          qualification_code: string | null
          qualification_display: string | null
          qualification_issuer: string | null
          role: string | null
          team_id: string | null
        }
        Insert: {
          active?: boolean | null
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          external_id?: string | null
          fhir_id?: string | null
          gender?: string | null
          id?: string
          name: string
          organization?: string | null
          qualification_code?: string | null
          qualification_display?: string | null
          qualification_issuer?: string | null
          role?: string | null
          team_id?: string | null
        }
        Update: {
          active?: boolean | null
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          external_id?: string | null
          fhir_id?: string | null
          gender?: string | null
          id?: string
          name?: string
          organization?: string | null
          qualification_code?: string | null
          qualification_display?: string | null
          qualification_issuer?: string | null
          role?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hcp_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      historic_addresses: {
        Row: {
          address: string
          address_type: string | null
          created_at: string | null
          date_from: string
          date_to: string | null
          id: string
          patient_id: string
        }
        Insert: {
          address: string
          address_type?: string | null
          created_at?: string | null
          date_from: string
          date_to?: string | null
          id?: string
          patient_id: string
        }
        Update: {
          address?: string
          address_type?: string | null
          created_at?: string | null
          date_from?: string
          date_to?: string | null
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historic_addresses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          indication: string | null
          name: string
          notes: string | null
          patient_id: string
          prescribed_by: string
          prescribed_date: string
          status: Database["public"]["Enums"]["medication_status"] | null
        }
        Insert: {
          created_at?: string | null
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          indication?: string | null
          name: string
          notes?: string | null
          patient_id: string
          prescribed_by: string
          prescribed_date: string
          status?: Database["public"]["Enums"]["medication_status"] | null
        }
        Update: {
          created_at?: string | null
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          indication?: string | null
          name?: string
          notes?: string | null
          patient_id?: string
          prescribed_by?: string
          prescribed_date?: string
          status?: Database["public"]["Enums"]["medication_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      mha_sections: {
        Row: {
          applied_date: string
          consultant_responsible: string
          created_at: string | null
          expiry_date: string | null
          hospital: string
          id: string
          notes: string | null
          patient_id: string
          reason: string
          review_date: string | null
          section_number: string
          section_title: string
          status: Database["public"]["Enums"]["mha_status"]
        }
        Insert: {
          applied_date: string
          consultant_responsible: string
          created_at?: string | null
          expiry_date?: string | null
          hospital: string
          id?: string
          notes?: string | null
          patient_id: string
          reason: string
          review_date?: string | null
          section_number: string
          section_title: string
          status: Database["public"]["Enums"]["mha_status"]
        }
        Update: {
          applied_date?: string
          consultant_responsible?: string
          created_at?: string | null
          expiry_date?: string | null
          hospital?: string
          id?: string
          notes?: string | null
          patient_id?: string
          reason?: string
          review_date?: string | null
          section_number?: string
          section_title?: string
          status?: Database["public"]["Enums"]["mha_status"]
        }
        Relationships: [
          {
            foreignKeyName: "mha_sections_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          access_restriction_applied_by: string | null
          access_restriction_applied_date: string | null
          access_restriction_enabled: boolean | null
          access_restriction_level: string | null
          access_restriction_notes: string | null
          access_restriction_reason: string | null
          access_restriction_review_date: string | null
          accommodation_type: string | null
          active: boolean | null
          address: string | null
          birth_date: string
          communication_language_code: string | null
          created_at: string | null
          deceased_boolean: boolean | null
          deceased_datetime: string | null
          ethnicity: string | null
          external_id: string | null
          fhir_id: string | null
          gender: string | null
          general_practitioner_reference: string | null
          id: string
          managing_organization_reference: string | null
          marital_status_code: string | null
          marital_status_display: string | null
          multiple_birth_boolean: boolean | null
          multiple_birth_integer: number | null
          name: string
          nhs_number: string
          phone: string | null
          pronouns: string | null
          updated_at: string | null
        }
        Insert: {
          access_restriction_applied_by?: string | null
          access_restriction_applied_date?: string | null
          access_restriction_enabled?: boolean | null
          access_restriction_level?: string | null
          access_restriction_notes?: string | null
          access_restriction_reason?: string | null
          access_restriction_review_date?: string | null
          accommodation_type?: string | null
          active?: boolean | null
          address?: string | null
          birth_date: string
          communication_language_code?: string | null
          created_at?: string | null
          deceased_boolean?: boolean | null
          deceased_datetime?: string | null
          ethnicity?: string | null
          external_id?: string | null
          fhir_id?: string | null
          gender?: string | null
          general_practitioner_reference?: string | null
          id?: string
          managing_organization_reference?: string | null
          marital_status_code?: string | null
          marital_status_display?: string | null
          multiple_birth_boolean?: boolean | null
          multiple_birth_integer?: number | null
          name: string
          nhs_number: string
          phone?: string | null
          pronouns?: string | null
          updated_at?: string | null
        }
        Update: {
          access_restriction_applied_by?: string | null
          access_restriction_applied_date?: string | null
          access_restriction_enabled?: boolean | null
          access_restriction_level?: string | null
          access_restriction_notes?: string | null
          access_restriction_reason?: string | null
          access_restriction_review_date?: string | null
          accommodation_type?: string | null
          active?: boolean | null
          address?: string | null
          birth_date?: string
          communication_language_code?: string | null
          created_at?: string | null
          deceased_boolean?: boolean | null
          deceased_datetime?: string | null
          ethnicity?: string | null
          external_id?: string | null
          fhir_id?: string | null
          gender?: string | null
          general_practitioner_reference?: string | null
          id?: string
          managing_organization_reference?: string | null
          marital_status_code?: string | null
          marital_status_display?: string | null
          multiple_birth_boolean?: boolean | null
          multiple_birth_integer?: number | null
          name?: string
          nhs_number?: string
          phone?: string | null
          pronouns?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pharmacy_details: {
        Row: {
          address: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          patient_id: string
          pharmacy_type: string | null
          phone: string
        }
        Insert: {
          address: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          patient_id: string
          pharmacy_type?: string | null
          phone: string
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          patient_id?: string
          pharmacy_type?: string | null
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_details_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      pinned_referrals: {
        Row: {
          created_at: string
          id: string
          pinned_at: string
          referral_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pinned_at?: string
          referral_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pinned_at?: string
          referral_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pinned_referrals_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      practitioners: {
        Row: {
          active: boolean | null
          birth_date: string | null
          contact: string | null
          created_at: string | null
          external_id: string | null
          fhir_id: string | null
          gender: Database["public"]["Enums"]["administrative_gender"] | null
          id: string
          name: string
          organization: string | null
          qualification_code: string | null
          qualification_display: string | null
          qualification_issuer: string | null
          role: string | null
        }
        Insert: {
          active?: boolean | null
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          external_id?: string | null
          fhir_id?: string | null
          gender?: Database["public"]["Enums"]["administrative_gender"] | null
          id?: string
          name: string
          organization?: string | null
          qualification_code?: string | null
          qualification_display?: string | null
          qualification_issuer?: string | null
          role?: string | null
        }
        Update: {
          active?: boolean | null
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          external_id?: string | null
          fhir_id?: string | null
          gender?: Database["public"]["Enums"]["administrative_gender"] | null
          id?: string
          name?: string
          organization?: string | null
          qualification_code?: string | null
          qualification_display?: string | null
          qualification_issuer?: string | null
          role?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reasonable_adjustments: {
        Row: {
          created_at: string | null
          flag_level: Database["public"]["Enums"]["flag_level"] | null
          has_adjustments: boolean | null
          id: string
          last_updated: string | null
          patient_id: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          flag_level?: Database["public"]["Enums"]["flag_level"] | null
          has_adjustments?: boolean | null
          id?: string
          last_updated?: string | null
          patient_id: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          flag_level?: Database["public"]["Enums"]["flag_level"] | null
          has_adjustments?: boolean | null
          id?: string
          last_updated?: string | null
          patient_id?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reasonable_adjustments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_letters: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          letter_content: string
          letter_type: string
          recipient_email: string | null
          recipient_name: string | null
          referral_id: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          letter_content: string
          letter_type: string
          recipient_email?: string | null
          recipient_name?: string | null
          referral_id: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          letter_content?: string
          letter_type?: string
          recipient_email?: string | null
          recipient_name?: string | null
          referral_id?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_letters_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_tags: {
        Row: {
          created_at: string | null
          id: string
          referral_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_tags_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          administrative_category: string | null
          ai_generated: boolean | null
          allergies_info: string | null
          allocated_by: string | null
          allocated_date: string | null
          assigned_hcp_id: string | null
          authored_on: string | null
          camhs_service_tier: string | null
          category_code: string | null
          category_display: string | null
          code_code: string | null
          code_display: string | null
          confidence: number | null
          created_at: string | null
          diagnosis: string | null
          display_order: number | null
          external_id: string | null
          external_reference: string | null
          fhir_id: string | null
          history: string | null
          id: string
          intent: string | null
          is_sub_referral: boolean | null
          medications: string | null
          notes: string | null
          occurrence_datetime: string | null
          occurrence_period_end: string | null
          occurrence_period_start: string | null
          overseas_status: string | null
          parent_referral_id: string | null
          patient_area_care_setting: string | null
          patient_id: string
          performer_reference: string | null
          priority: Database["public"]["Enums"]["referral_priority"] | null
          reason: string
          reasonable_code_code: string | null
          reasonable_code_display: string | null
          referral_type: string | null
          referrer_id: string
          requester_reference: string | null
          service: string | null
          specialty: string
          status: Database["public"]["Enums"]["referral_status"] | null
          supporting_info: string[] | null
          team_id: string | null
          triage_status: Database["public"]["Enums"]["triage_status"] | null
          ubrn: string
          updated_at: string | null
          waiting_list_added_date: string | null
          waiting_list_notes: string | null
          waiting_list_position: number | null
          waiting_list_priority_override: string | null
        }
        Insert: {
          administrative_category?: string | null
          ai_generated?: boolean | null
          allergies_info?: string | null
          allocated_by?: string | null
          allocated_date?: string | null
          assigned_hcp_id?: string | null
          authored_on?: string | null
          camhs_service_tier?: string | null
          category_code?: string | null
          category_display?: string | null
          code_code?: string | null
          code_display?: string | null
          confidence?: number | null
          created_at?: string | null
          diagnosis?: string | null
          display_order?: number | null
          external_id?: string | null
          external_reference?: string | null
          fhir_id?: string | null
          history?: string | null
          id?: string
          intent?: string | null
          is_sub_referral?: boolean | null
          medications?: string | null
          notes?: string | null
          occurrence_datetime?: string | null
          occurrence_period_end?: string | null
          occurrence_period_start?: string | null
          overseas_status?: string | null
          parent_referral_id?: string | null
          patient_area_care_setting?: string | null
          patient_id: string
          performer_reference?: string | null
          priority?: Database["public"]["Enums"]["referral_priority"] | null
          reason: string
          reasonable_code_code?: string | null
          reasonable_code_display?: string | null
          referral_type?: string | null
          referrer_id: string
          requester_reference?: string | null
          service?: string | null
          specialty: string
          status?: Database["public"]["Enums"]["referral_status"] | null
          supporting_info?: string[] | null
          team_id?: string | null
          triage_status?: Database["public"]["Enums"]["triage_status"] | null
          ubrn: string
          updated_at?: string | null
          waiting_list_added_date?: string | null
          waiting_list_notes?: string | null
          waiting_list_position?: number | null
          waiting_list_priority_override?: string | null
        }
        Update: {
          administrative_category?: string | null
          ai_generated?: boolean | null
          allergies_info?: string | null
          allocated_by?: string | null
          allocated_date?: string | null
          assigned_hcp_id?: string | null
          authored_on?: string | null
          camhs_service_tier?: string | null
          category_code?: string | null
          category_display?: string | null
          code_code?: string | null
          code_display?: string | null
          confidence?: number | null
          created_at?: string | null
          diagnosis?: string | null
          display_order?: number | null
          external_id?: string | null
          external_reference?: string | null
          fhir_id?: string | null
          history?: string | null
          id?: string
          intent?: string | null
          is_sub_referral?: boolean | null
          medications?: string | null
          notes?: string | null
          occurrence_datetime?: string | null
          occurrence_period_end?: string | null
          occurrence_period_start?: string | null
          overseas_status?: string | null
          parent_referral_id?: string | null
          patient_area_care_setting?: string | null
          patient_id?: string
          performer_reference?: string | null
          priority?: Database["public"]["Enums"]["referral_priority"] | null
          reason?: string
          reasonable_code_code?: string | null
          reasonable_code_display?: string | null
          referral_type?: string | null
          referrer_id?: string
          requester_reference?: string | null
          service?: string | null
          specialty?: string
          status?: Database["public"]["Enums"]["referral_status"] | null
          supporting_info?: string[] | null
          team_id?: string | null
          triage_status?: Database["public"]["Enums"]["triage_status"] | null
          ubrn?: string
          updated_at?: string | null
          waiting_list_added_date?: string | null
          waiting_list_notes?: string | null
          waiting_list_position?: number | null
          waiting_list_priority_override?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_parent_referral_id_fkey"
            columns: ["parent_referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
        ]
      }
      related_people: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          is_emergency_contact: boolean | null
          is_next_of_kin: boolean | null
          is_primary_contact: boolean | null
          name: string
          patient_id: string
          phone: string | null
          relationship: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          is_next_of_kin?: boolean | null
          is_primary_contact?: boolean | null
          name: string
          patient_id: string
          phone?: string | null
          relationship: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          is_next_of_kin?: boolean | null
          is_primary_contact?: boolean | null
          name?: string
          patient_id?: string
          phone?: string | null
          relationship?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "related_people_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          display_order: number | null
          external_id: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          display_order?: number | null
          external_id?: string | null
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          display_order?: number | null
          external_id?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          email: string | null
          external_id: string | null
          id: string
          lead_contact: string | null
          location: string | null
          name: string
          phone: string | null
          specialty_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          external_id?: string | null
          id?: string
          lead_contact?: string | null
          location?: string | null
          name: string
          phone?: string | null
          specialty_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          external_id?: string | null
          id?: string
          lead_contact?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          specialty_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          created_at: string | null
          id: string
          interpretation: string | null
          notes: string | null
          patient_id: string
          performed_by: string | null
          report_date: string | null
          requested_by: string
          requested_date: string
          results: Json | null
          sample_date: string | null
          status: Database["public"]["Enums"]["test_status"] | null
          test_name: string
          test_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interpretation?: string | null
          notes?: string | null
          patient_id: string
          performed_by?: string | null
          report_date?: string | null
          requested_by: string
          requested_date: string
          results?: Json | null
          sample_date?: string | null
          status?: Database["public"]["Enums"]["test_status"] | null
          test_name: string
          test_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interpretation?: string | null
          notes?: string | null
          patient_id?: string
          performed_by?: string | null
          report_date?: string | null
          requested_by?: string
          requested_date?: string
          results?: Json | null
          sample_date?: string | null
          status?: Database["public"]["Enums"]["test_status"] | null
          test_name?: string
          test_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          created_at: string | null
          heart_rate: number | null
          id: string
          news2: number | null
          oxygen_saturation: number | null
          patient_id: string
          respiration: number | null
          temperature: number | null
          timestamp: string
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          news2?: number | null
          oxygen_saturation?: number | null
          patient_id: string
          respiration?: number | null
          temperature?: number | null
          timestamp: string
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          news2?: number | null
          oxygen_saturation?: number | null
          patient_id?: string
          respiration?: number | null
          temperature?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      waiting_list_entries: {
        Row: {
          added_by: string
          added_date: string
          created_at: string
          id: string
          notes: string | null
          position: number
          priority_override: string | null
          referral_id: string
          specialty: string
          status: string
          updated_at: string
        }
        Insert: {
          added_by: string
          added_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          position: number
          priority_override?: string | null
          referral_id: string
          specialty: string
          status?: string
          updated_at?: string
        }
        Update: {
          added_by?: string
          added_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          position?: number
          priority_override?: string | null
          referral_id?: string
          specialty?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      waiting_list_history: {
        Row: {
          action: string
          created_at: string
          id: string
          new_position: number | null
          new_priority: string | null
          notes: string | null
          old_position: number | null
          old_priority: string | null
          performed_at: string
          performed_by: string
          referral_id: string
          specialty: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_position?: number | null
          new_priority?: string | null
          notes?: string | null
          old_position?: number | null
          old_priority?: string | null
          performed_at?: string
          performed_by: string
          referral_id: string
          specialty: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_position?: number | null
          new_priority?: string | null
          notes?: string | null
          old_position?: number | null
          old_priority?: string | null
          performed_at?: string
          performed_by?: string
          referral_id?: string
          specialty?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_fhir_patient_resource: {
        Args: { patient_row: Database["public"]["Tables"]["patients"]["Row"] }
        Returns: Json
      }
      reorder_waiting_list_positions: {
        Args: { specialty_param: string; referral_positions: Json }
        Returns: undefined
      }
    }
    Enums: {
      address_use: "home" | "work" | "temp" | "old" | "billing"
      adjustment_category:
        | "communication"
        | "mobility"
        | "sensory"
        | "cognitive"
        | "mental-health"
        | "physical"
        | "other"
      adjustment_status: "active" | "inactive" | "under-review"
      administrative_gender: "male" | "female" | "other" | "unknown"
      allergy_severity: "mild" | "moderate" | "severe" | "life-threatening"
      allergy_status: "active" | "inactive" | "resolved"
      allergy_type: "drug" | "food" | "environmental" | "contact" | "other"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no-show"
      appointment_type:
        | "consultation"
        | "pre-admission"
        | "follow-up"
        | "procedure"
        | "virtual"
      contact_point_system:
        | "phone"
        | "fax"
        | "email"
        | "pager"
        | "url"
        | "sms"
        | "other"
      contact_point_use: "home" | "work" | "temp" | "old" | "mobile"
      fhir_resource_type:
        | "Patient"
        | "Practitioner"
        | "Organization"
        | "ServiceRequest"
        | "Observation"
        | "Condition"
        | "MedicationStatement"
        | "AllergyIntolerance"
        | "Appointment"
        | "DocumentReference"
        | "DiagnosticReport"
      fhir_status:
        | "active"
        | "inactive"
        | "suspended"
        | "unknown"
        | "entered-in-error"
      flag_level: "none" | "standard" | "complex" | "high-risk"
      medication_status: "active" | "discontinued" | "completed" | "paused"
      mha_status: "active" | "expired" | "discharged" | "appealed"
      referral_priority: "routine" | "urgent" | "emergency"
      referral_status:
        | "new"
        | "accepted"
        | "rejected"
        | "completed"
        | "cancelled"
      test_status:
        | "requested"
        | "collected"
        | "in-progress"
        | "completed"
        | "cancelled"
      triage_status:
        | "pending"
        | "in-progress"
        | "completed"
        | "waiting-list"
        | "pre-assessment"
        | "assessed"
        | "pre-admission-assessment"
        | "refer-to-another-specialty"
      verification_status: "confirmed" | "unconfirmed" | "suspected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      address_use: ["home", "work", "temp", "old", "billing"],
      adjustment_category: [
        "communication",
        "mobility",
        "sensory",
        "cognitive",
        "mental-health",
        "physical",
        "other",
      ],
      adjustment_status: ["active", "inactive", "under-review"],
      administrative_gender: ["male", "female", "other", "unknown"],
      allergy_severity: ["mild", "moderate", "severe", "life-threatening"],
      allergy_status: ["active", "inactive", "resolved"],
      allergy_type: ["drug", "food", "environmental", "contact", "other"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "cancelled",
        "completed",
        "no-show",
      ],
      appointment_type: [
        "consultation",
        "pre-admission",
        "follow-up",
        "procedure",
        "virtual",
      ],
      contact_point_system: [
        "phone",
        "fax",
        "email",
        "pager",
        "url",
        "sms",
        "other",
      ],
      contact_point_use: ["home", "work", "temp", "old", "mobile"],
      fhir_resource_type: [
        "Patient",
        "Practitioner",
        "Organization",
        "ServiceRequest",
        "Observation",
        "Condition",
        "MedicationStatement",
        "AllergyIntolerance",
        "Appointment",
        "DocumentReference",
        "DiagnosticReport",
      ],
      fhir_status: [
        "active",
        "inactive",
        "suspended",
        "unknown",
        "entered-in-error",
      ],
      flag_level: ["none", "standard", "complex", "high-risk"],
      medication_status: ["active", "discontinued", "completed", "paused"],
      mha_status: ["active", "expired", "discharged", "appealed"],
      referral_priority: ["routine", "urgent", "emergency"],
      referral_status: [
        "new",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      test_status: [
        "requested",
        "collected",
        "in-progress",
        "completed",
        "cancelled",
      ],
      triage_status: [
        "pending",
        "in-progress",
        "completed",
        "waiting-list",
        "pre-assessment",
        "assessed",
        "pre-admission-assessment",
        "refer-to-another-specialty",
      ],
      verification_status: ["confirmed", "unconfirmed", "suspected"],
    },
  },
} as const
