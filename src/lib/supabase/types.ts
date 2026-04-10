// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          agencia: string | null
          ativo: boolean | null
          bairro: string | null
          banco: string | null
          cep: string | null
          cidade: string | null
          cnae: string | null
          cnpj: string | null
          complemento: string | null
          conta: string | null
          data_abertura: string | null
          data_criacao: string | null
          data_ultima_sincronizacao: string | null
          email: string | null
          email_secundario: string | null
          endereco: string | null
          enquadramento: string | null
          estado: string | null
          estado_civil: string | null
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          logradouro: string | null
          nacionalidade: string | null
          nome: string | null
          numero: string | null
          observacoes: string | null
          preferencias_notificacao: Json | null
          profissao: string | null
          razao_social: string | null
          regime_tributario: string | null
          sincronizado_rfb: boolean | null
          situacao_cadastral: string | null
          telefone: string | null
          tipo_conta: string | null
          titular_conta: string | null
          whatsapp: string | null
        }
        Insert: {
          agencia?: string | null
          ativo?: boolean | null
          bairro?: string | null
          banco?: string | null
          cep?: string | null
          cidade?: string | null
          cnae?: string | null
          cnpj?: string | null
          complemento?: string | null
          conta?: string | null
          data_abertura?: string | null
          data_criacao?: string | null
          data_ultima_sincronizacao?: string | null
          email?: string | null
          email_secundario?: string | null
          endereco?: string | null
          enquadramento?: string | null
          estado?: string | null
          estado_civil?: string | null
          id: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          logradouro?: string | null
          nacionalidade?: string | null
          nome?: string | null
          numero?: string | null
          observacoes?: string | null
          preferencias_notificacao?: Json | null
          profissao?: string | null
          razao_social?: string | null
          regime_tributario?: string | null
          sincronizado_rfb?: boolean | null
          situacao_cadastral?: string | null
          telefone?: string | null
          tipo_conta?: string | null
          titular_conta?: string | null
          whatsapp?: string | null
        }
        Update: {
          agencia?: string | null
          ativo?: boolean | null
          bairro?: string | null
          banco?: string | null
          cep?: string | null
          cidade?: string | null
          cnae?: string | null
          cnpj?: string | null
          complemento?: string | null
          conta?: string | null
          data_abertura?: string | null
          data_criacao?: string | null
          data_ultima_sincronizacao?: string | null
          email?: string | null
          email_secundario?: string | null
          endereco?: string | null
          enquadramento?: string | null
          estado?: string | null
          estado_civil?: string | null
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          logradouro?: string | null
          nacionalidade?: string | null
          nome?: string | null
          numero?: string | null
          observacoes?: string | null
          preferencias_notificacao?: Json | null
          profissao?: string | null
          razao_social?: string | null
          regime_tributario?: string | null
          sincronizado_rfb?: boolean | null
          situacao_cadastral?: string | null
          telefone?: string | null
          tipo_conta?: string | null
          titular_conta?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      documentos: {
        Row: {
          arquivo_url: string | null
          categoria: string
          cliente_id: string | null
          data_upload: string | null
          data_vencimento: string | null
          id: string
          nome: string
          status: string | null
          valor: number | null
        }
        Insert: {
          arquivo_url?: string | null
          categoria: string
          cliente_id?: string | null
          data_upload?: string | null
          data_vencimento?: string | null
          id?: string
          nome: string
          status?: string | null
          valor?: number | null
        }
        Update: {
          arquivo_url?: string | null
          categoria?: string
          cliente_id?: string | null
          data_upload?: string | null
          data_vencimento?: string | null
          id?: string
          nome?: string
          status?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'documentos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      documents: {
        Row: {
          category: string
          created_at: string
          file_url: string | null
          id: string
          is_favorite: boolean | null
          name: string
          size: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          file_url?: string | null
          id?: string
          is_favorite?: boolean | null
          name: string
          size?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string | null
          id?: string
          is_favorite?: boolean | null
          name?: string
          size?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      faturas: {
        Row: {
          cliente_id: string | null
          codigo_barras: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          id: string
          link_boleto: string | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          cliente_id?: string | null
          codigo_barras?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          id?: string
          link_boleto?: string | null
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          cliente_id?: string | null
          codigo_barras?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          id?: string
          link_boleto?: string | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: 'faturas_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      historico_clientes: {
        Row: {
          cliente_id: string
          created_at: string
          dados_antigos: Json | null
          dados_novos: Json | null
          data_sincronizacao: string
          id: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          dados_antigos?: Json | null
          dados_novos?: Json | null
          data_sincronizacao?: string
          id?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          dados_antigos?: Json | null
          dados_novos?: Json | null
          data_sincronizacao?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'historico_clientes_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      notificacoes: {
        Row: {
          cliente_id: string | null
          data_criacao: string | null
          id: string
          lido: boolean | null
          mensagem: string
          status: string | null
          tipo: string
        }
        Insert: {
          cliente_id?: string | null
          data_criacao?: string | null
          id?: string
          lido?: boolean | null
          mensagem: string
          status?: string | null
          tipo: string
        }
        Update: {
          cliente_id?: string | null
          data_criacao?: string | null
          id?: string
          lido?: boolean | null
          mensagem?: string
          status?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notificacoes_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          accountant_email: string | null
          accountant_name: string | null
          accountant_phone: string | null
          company_name: string | null
          created_at: string | null
          document_number: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          last_sync_at: string | null
          notify_email: boolean | null
          notify_sms: boolean | null
          notify_whatsapp: boolean | null
          office_preferences: Json | null
          phone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          accountant_email?: string | null
          accountant_name?: string | null
          accountant_phone?: string | null
          company_name?: string | null
          created_at?: string | null
          document_number?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          last_sync_at?: string | null
          notify_email?: boolean | null
          notify_sms?: boolean | null
          notify_whatsapp?: boolean | null
          office_preferences?: Json | null
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          accountant_email?: string | null
          accountant_name?: string | null
          accountant_phone?: string | null
          company_name?: string | null
          created_at?: string | null
          document_number?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_sync_at?: string | null
          notify_email?: boolean | null
          notify_sms?: boolean | null
          notify_whatsapp?: boolean | null
          office_preferences?: Json | null
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      taxes: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          status: string
          tax_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          status?: string
          tax_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          status?: string
          tax_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vencimentos: {
        Row: {
          cliente_id: string | null
          data_vencimento: string
          id: string
          status: string | null
          tipo_guia: string
          valor: number
        }
        Insert: {
          cliente_id?: string | null
          data_vencimento: string
          id?: string
          status?: string | null
          tipo_guia: string
          valor: number
        }
        Update: {
          cliente_id?: string | null
          data_vencimento?: string
          id?: string
          status?: string | null
          tipo_guia?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: 'vencimentos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: clientes
//   id: uuid (not null)
//   nome: text (nullable)
//   cnpj: text (nullable)
//   razao_social: text (nullable)
//   email: text (nullable)
//   telefone: text (nullable)
//   whatsapp: text (nullable)
//   ativo: boolean (nullable, default: true)
//   data_criacao: timestamp with time zone (nullable, default: now())
//   preferencias_notificacao: jsonb (nullable, default: '{"sms": false, "email": true, "whatsapp": false}'::jsonb)
//   sincronizado_rfb: boolean (nullable, default: false)
//   data_ultima_sincronizacao: timestamp with time zone (nullable)
//   situacao_cadastral: text (nullable)
//   endereco: text (nullable)
//   data_abertura: date (nullable)
//   nacionalidade: text (nullable)
//   estado_civil: text (nullable)
//   profissao: text (nullable)
//   email_secundario: text (nullable)
//   cep: text (nullable)
//   logradouro: text (nullable)
//   numero: text (nullable)
//   complemento: text (nullable)
//   bairro: text (nullable)
//   cidade: text (nullable)
//   estado: text (nullable)
//   regime_tributario: text (nullable)
//   inscricao_estadual: text (nullable)
//   inscricao_municipal: text (nullable)
//   cnae: text (nullable)
//   enquadramento: text (nullable)
//   banco: text (nullable)
//   agencia: text (nullable)
//   conta: text (nullable)
//   tipo_conta: text (nullable)
//   titular_conta: text (nullable)
//   observacoes: text (nullable)
// Table: documentos
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (nullable)
//   nome: text (not null)
//   categoria: text (not null)
//   arquivo_url: text (nullable)
//   status: text (nullable, default: 'Processando'::text)
//   data_upload: timestamp with time zone (nullable, default: now())
//   valor: numeric (nullable)
//   data_vencimento: date (nullable)
// Table: documents
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   name: text (not null)
//   category: text (not null)
//   status: text (not null, default: 'Pendente'::text)
//   file_url: text (nullable)
//   size: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   is_favorite: boolean (nullable, default: false)
// Table: faturas
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (nullable)
//   descricao: text (not null)
//   valor: numeric (not null)
//   data_vencimento: date (not null)
//   status: text (not null, default: 'Pendente'::text)
//   codigo_barras: text (nullable)
//   link_boleto: text (nullable)
//   data_pagamento: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: historico_clientes
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (not null)
//   data_sincronizacao: timestamp with time zone (not null, default: now())
//   dados_antigos: jsonb (nullable)
//   dados_novos: jsonb (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: notificacoes
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (nullable)
//   tipo: text (not null)
//   mensagem: text (not null)
//   lido: boolean (nullable, default: false)
//   data_criacao: timestamp with time zone (nullable, default: now())
//   status: text (nullable, default: 'Enviado'::text)
// Table: profiles
//   id: uuid (not null)
//   full_name: text (nullable)
//   document_number: text (nullable)
//   company_name: text (nullable)
//   email: text (nullable)
//   phone: text (nullable)
//   whatsapp: text (nullable)
//   accountant_name: text (nullable)
//   accountant_email: text (nullable)
//   accountant_phone: text (nullable)
//   notify_email: boolean (nullable, default: true)
//   notify_whatsapp: boolean (nullable, default: false)
//   notify_sms: boolean (nullable, default: false)
//   last_sync_at: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   is_admin: boolean (nullable, default: false)
//   office_preferences: jsonb (nullable, default: '{"due_date_alerts": true, "email_connected": true, "auto_notifications": true, "whatsapp_connected": true, "auto_document_sending": false}'::jsonb)
// Table: taxes
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   title: text (not null)
//   tax_type: text (not null)
//   due_date: date (not null)
//   amount: numeric (not null)
//   status: text (not null, default: 'Pendente'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: vencimentos
//   id: uuid (not null, default: gen_random_uuid())
//   cliente_id: uuid (nullable)
//   tipo_guia: text (not null)
//   data_vencimento: date (not null)
//   valor: numeric (not null)
//   status: text (nullable, default: 'Pendente'::text)

// --- CONSTRAINTS ---
// Table: clientes
//   FOREIGN KEY clientes_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
// Table: documentos
//   FOREIGN KEY documentos_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY documentos_pkey: PRIMARY KEY (id)
// Table: documents
//   PRIMARY KEY documents_pkey: PRIMARY KEY (id)
//   FOREIGN KEY documents_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: faturas
//   FOREIGN KEY faturas_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY faturas_pkey: PRIMARY KEY (id)
// Table: historico_clientes
//   FOREIGN KEY historico_clientes_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY historico_clientes_pkey: PRIMARY KEY (id)
// Table: notificacoes
//   FOREIGN KEY notificacoes_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY notificacoes_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: taxes
//   PRIMARY KEY taxes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY taxes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: vencimentos
//   FOREIGN KEY vencimentos_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   PRIMARY KEY vencimentos_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: clientes
//   Policy "authenticated_admin_select_clientes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))
//   Policy "authenticated_insert_clientes" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = id)
//   Policy "authenticated_select_clientes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//   Policy "authenticated_update_clientes" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)
// Table: documentos
//   Policy "authenticated_admin_select_documentos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))
//   Policy "authenticated_delete_documentos" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = cliente_id)
//   Policy "authenticated_insert_documentos" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = cliente_id)
//   Policy "authenticated_select_documentos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = cliente_id)
//   Policy "authenticated_update_documentos" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = cliente_id)
// Table: documents
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
// Table: faturas
//   Policy "authenticated_select_faturas" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = cliente_id)
// Table: historico_clientes
//   Policy "authenticated_admin_select_historico" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))
//   Policy "authenticated_insert_historico" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))
// Table: notificacoes
//   Policy "authenticated_delete_notificacoes" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = cliente_id)
//   Policy "authenticated_select_notificacoes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = cliente_id)
//   Policy "authenticated_update_notificacoes" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = cliente_id)
//     WITH CHECK: (auth.uid() = cliente_id)
// Table: profiles
//   Policy "authenticated_insert_profiles" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (auth.uid() = id)
//   Policy "authenticated_select_profiles" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//   Policy "authenticated_update_profiles" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)
// Table: taxes
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = user_id)
// Table: vencimentos
//   Policy "authenticated_admin_select_vencimentos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))
//   Policy "authenticated_select_vencimentos" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = cliente_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_document()
//   CREATE OR REPLACE FUNCTION public.handle_new_document()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_email text;
//     v_whatsapp text;
//     v_assunto text := 'Novo Documento Processado';
//     v_mensagem text;
//     v_valor numeric;
//     v_vencimento date;
//     v_supabase_url text := current_setting('app.settings.supabase_url', true);
//     v_anon_key text := current_setting('app.settings.supabase_anon_key', true);
//   BEGIN
//     -- Fallback para chaves baseadas no ambiente original (caso não haja custom settings)
//     IF v_supabase_url IS NULL OR v_supabase_url = '' THEN
//       v_supabase_url := 'https://gdrwxnsrfshibtvrnsbn.supabase.co';
//     END IF;
//
//     IF v_anon_key IS NULL OR v_anon_key = '' THEN
//       v_anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkcnd4bnNyZnNoaWJ0dnJuc2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3ODE2NTUsImV4cCI6MjA5MTM1NzY1NX0.g4jsxO4jaRHx9aUrPFI4OygW4dC3dH04eIQ3DhoZnEA';
//     END IF;
//
//     -- Busca o e-mail e WhatsApp do cliente na tabela "clientes"
//     SELECT email, whatsapp INTO v_email, v_whatsapp
//     FROM public.clientes
//     WHERE id = NEW.cliente_id;
//
//     v_valor := NULL;
//     v_vencimento := NULL;
//
//     -- Extrai os valores usando EXECUTE para garantir que veja as colunas adicionadas independentemente do cache do tipo de ROW
//     EXECUTE 'SELECT valor, data_vencimento FROM public.documentos WHERE id = $1'
//     INTO v_valor, v_vencimento
//     USING NEW.id;
//
//     -- Se não encontrar na tabela documentos, tenta buscar na tabela de vencimentos cruzando pelo cliente_id
//     IF (v_valor IS NULL OR v_vencimento IS NULL) AND NEW.cliente_id IS NOT NULL THEN
//       SELECT valor, data_vencimento INTO v_valor, v_vencimento
//       FROM public.vencimentos
//       WHERE cliente_id = NEW.cliente_id AND tipo_guia = NEW.categoria
//       ORDER BY data_vencimento DESC
//       LIMIT 1;
//     END IF;
//
//     -- Monta a mensagem estruturada e final para notificação
//     v_mensagem := 'Olá! Um novo documento foi processado e disponibilizado no seu portal.' || CHR(10) ||
//                   'Nome do Documento: ' || NEW.nome || CHR(10) ||
//                   'Tipo: ' || NEW.categoria;
//
//     IF v_valor IS NOT NULL THEN
//       v_mensagem := v_mensagem || CHR(10) || 'Valor: R$ ' || v_valor;
//     END IF;
//
//     IF v_vencimento IS NOT NULL THEN
//       v_mensagem := v_mensagem || CHR(10) || 'Vencimento: ' || TO_CHAR(v_vencimento, 'DD/MM/YYYY');
//     END IF;
//
//     -- Dispara o e-mail via net.http_post consumindo a Edge Function "send-email"
//     IF v_email IS NOT NULL AND v_email != '' THEN
//       PERFORM net.http_post(
//         url := v_supabase_url || '/functions/v1/send-email',
//         headers := jsonb_build_object(
//           'Content-Type', 'application/json',
//           'Authorization', 'Bearer ' || v_anon_key
//         ),
//         body := jsonb_build_object(
//           'cliente_email', v_email,
//           'assunto', v_assunto,
//           'mensagem', v_mensagem
//         )
//       );
//     END IF;
//
//     -- Dispara a mensagem via net.http_post consumindo a Edge Function "send-whatsapp"
//     IF v_whatsapp IS NOT NULL AND v_whatsapp != '' THEN
//       PERFORM net.http_post(
//         url := v_supabase_url || '/functions/v1/send-whatsapp',
//         headers := jsonb_build_object(
//           'Content-Type', 'application/json',
//           'Authorization', 'Bearer ' || v_anon_key
//         ),
//         body := jsonb_build_object(
//           'cliente_whatsapp', v_whatsapp,
//           'mensagem', v_mensagem
//         )
//       );
//     END IF;
//
//     -- Registra a notificação final na tabela
//     INSERT INTO public.notificacoes (cliente_id, tipo, mensagem, status, lido, data_criacao)
//     VALUES (NEW.cliente_id, 'Documento do Google Drive', v_mensagem, 'Enviado', false, now());
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     -- Popula profiles
//     INSERT INTO public.profiles (
//       id,
//       email,
//       full_name,
//       document_number,
//       company_name,
//       phone
//     )
//     VALUES (
//       NEW.id,
//       NEW.email,
//       NEW.raw_user_meta_data->>'full_name',
//       NEW.raw_user_meta_data->>'document_number',
//       NEW.raw_user_meta_data->>'company_name',
//       NEW.raw_user_meta_data->>'phone'
//     )
//     ON CONFLICT (id) DO UPDATE SET
//       email = EXCLUDED.email,
//       full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
//       document_number = COALESCE(EXCLUDED.document_number, public.profiles.document_number),
//       company_name = COALESCE(EXCLUDED.company_name, public.profiles.company_name),
//       phone = COALESCE(EXCLUDED.phone, public.profiles.phone);
//
//     -- Popula clientes
//     INSERT INTO public.clientes (
//       id,
//       email,
//       nome,
//       cnpj,
//       razao_social,
//       telefone
//     )
//     VALUES (
//       NEW.id,
//       NEW.email,
//       NEW.raw_user_meta_data->>'full_name',
//       NEW.raw_user_meta_data->>'document_number',
//       NEW.raw_user_meta_data->>'company_name',
//       NEW.raw_user_meta_data->>'phone'
//     )
//     ON CONFLICT (id) DO UPDATE SET
//       email = EXCLUDED.email,
//       nome = COALESCE(EXCLUDED.nome, public.clientes.nome),
//       cnpj = COALESCE(EXCLUDED.cnpj, public.clientes.cnpj),
//       razao_social = COALESCE(EXCLUDED.razao_social, public.clientes.razao_social),
//       telefone = COALESCE(EXCLUDED.telefone, public.clientes.telefone);
//
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: documentos
//   on_document_created: CREATE TRIGGER on_document_created AFTER INSERT ON public.documentos FOR EACH ROW EXECUTE FUNCTION handle_new_document()
