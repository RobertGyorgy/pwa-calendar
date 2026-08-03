/**
 * Patient Service
 * Abstraction layer for patient records CRUD operations.
 */

export interface PatientProfile {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  medicalHistory?: string;
}

export async function getPatientList(): Promise<PatientProfile[]> {
  // Placeholder service method
  return [];
}

export async function savePatient(patient: PatientProfile): Promise<{ success: boolean; id?: string }> {
  // Placeholder service method
  return { success: true };
}
