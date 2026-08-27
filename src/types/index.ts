// Mirrors backend/apps/*/serializers.py response shapes exactly.

export type RegistrationStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_PROCESSING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED'

export const REGISTRATION_STATUSES: RegistrationStatus[] = [
  'PENDING_PAYMENT',
  'PAYMENT_PROCESSING',
  'CONFIRMED',
  'CANCELLED',
  'EXPIRED',
  'REFUNDED',
]

export type PaymentStatus = 'CREATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED'

export type PaymentMethod =
  | 'MTN_MONEY'
  | 'AIRTEL_MONEY'
  | 'ZAMTEL_KWACHA'
  | 'CARD'
  | 'BANK_TRANSFER'
  | 'CASH'

export const PAYMENT_METHODS: PaymentMethod[] = [
  'MTN_MONEY',
  'AIRTEL_MONEY',
  'ZAMTEL_KWACHA',
  'CARD',
  'BANK_TRANSFER',
  'CASH',
]

export type Gender = 'male' | 'female'

export const AGE_RANGES = ['Under 18', '18-29', '30-39', '40-49', '50-59', '60+']

export const T_SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL']

export type AdminRole = 'ADMIN' | 'VIEW'

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface RaceCategory {
  id: string
  name: string
  code: string
  description: string
  distance_label: string
  price: string
  currency: string
  capacity: number | null
}

export interface AdminRaceCategory extends RaceCategory {
  is_active: boolean
}

export interface RaceCategoryPayload {
  name: string
  code: string
  description?: string
  distance_label?: string
  price: string
  currency: string
  capacity?: number | null
  is_active?: boolean
}

export interface AdminParticipant {
  id: string
  full_name: string
  email: string
  phone: string
  gender: Gender | ''
  age_range: string
  country: string
}

export interface AdminRegistration {
  id: string
  // Null until the registration reaches CONFIRMED — the backend only
  // assigns a reference number on confirmation, so it doesn't permanently
  // "use up" a number for an abandoned/failed registration.
  registration_number: string | null
  status: RegistrationStatus
  amount: string
  currency: string
  participant: AdminParticipant
  category: string
  category_name: string
  t_shirt_size: string
  club_or_institution: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_notes: string
  latest_payment_reference: string | null
  registered_at: string
  updated_at: string
}

export interface RegistrationEditPayload {
  status?: RegistrationStatus
  full_name?: string
  email?: string
  phone?: string
  gender?: Gender | ''
  age_range?: string
  country?: string
  t_shirt_size?: string
  club_or_institution?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_notes?: string
}

export type PaymentTargetType = 'runner' | 'vendor'

export interface AdminPayment {
  id: string
  registration: string | null
  vendor_registration: string | null
  target_type: PaymentTargetType
  registration_number: string | null
  participant_name: string
  reference: string
  provider_reference: string
  amount: string
  currency: string
  status: PaymentStatus
  payment_method: PaymentMethod
  paid_at: string | null
  created_at: string
}

// --- Vendor / exhibitor registration — a separate domain from runners
// (own categories, own records) but the same status lifecycle and
// payment machinery. See backend/apps/vendors.

export const VENDOR_REQUIREMENTS = [
  'Exhibition Space',
  'Vendor Stall',
  'Food & Beverage Stall',
  'Corporate Activation',
  'Branding / Promotional Space',
  'Other',
]

export interface VendorCategory {
  id: string
  name: string
  code: string
  description: string
  price: string
  currency: string
  capacity: number | null
}

export interface AdminVendorCategory extends VendorCategory {
  is_active: boolean
}

export interface VendorCategoryPayload {
  name: string
  code: string
  description?: string
  price: string
  currency: string
  capacity?: number | null
  is_active?: boolean
}

export interface AdminVendor {
  id: string
  business_name: string
  full_name: string
  email: string
  phone: string
  business_location: string
}

export interface AdminVendorRegistration {
  id: string
  registration_number: string | null
  status: RegistrationStatus
  amount: string
  currency: string
  vendor: AdminVendor
  category: string
  category_name: string
  products_services: string
  requirement: string
  latest_payment_reference: string | null
  registered_at: string
  updated_at: string
}

export interface VendorRegistrationEditPayload {
  status?: RegistrationStatus
  business_name?: string
  full_name?: string
  email?: string
  phone?: string
  business_location?: string
  products_services?: string
  requirement?: string
}

export interface ManualVendorRegistrationPayload {
  category_id: string
  business_name: string
  full_name: string
  email?: string
  phone?: string
  business_location?: string
  products_services?: string
  requirement?: string
  status?: RegistrationStatus
}

export interface DashboardStats {
  total_registrations: number
  today_count: number
  by_status: { status: RegistrationStatus; count: number }[]
  by_category: { category__name: string; count: number }[]
  revenue_confirmed: string
  revenue_pending: string
}

export interface CurrentUser {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  phone: string
  role: AdminRole
  is_superuser: boolean
  is_staff: boolean
}

export interface AdminUser extends CurrentUser {
  is_active: boolean
  created_at: string
}

export interface ManualRegistrationPayload {
  category_id: string
  full_name: string
  email?: string
  phone?: string
  gender?: Gender | ''
  age_range?: string
  country?: string
  t_shirt_size?: string
  club_or_institution?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_notes?: string
  status?: RegistrationStatus
}

export interface BulkUploadReport {
  created_count: number
  created_references: (string | null)[]
  error_count: number
  errors: { row: number; error: string }[]
}

export interface CreateAdminUserPayload {
  email: string
  first_name: string
  last_name: string
  phone?: string
  password: string
  role: AdminRole
}

export interface UpdateAdminUserPayload {
  first_name?: string
  last_name?: string
  phone?: string
  is_active?: boolean
  role?: AdminRole
}

export interface ApiErrorShape {
  detail?: string
  [field: string]: unknown
}
