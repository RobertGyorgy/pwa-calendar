/**
 * Appointment Service
 * Abstraction layer for appointment booking, status updates, and Convex query/mutation invocation.
 */

export interface AppointmentData {
  patientId: string;
  startTime: number; // Unix epoch ms
  endTime: number;
  notes?: string;
}

export async function createAppointment(data: AppointmentData): Promise<{ success: boolean; appointmentId?: string }> {
  // Placeholder service method - connects UI to Convex mutation
  return { success: true };
}

export async function cancelAppointment(appointmentId: string): Promise<{ success: boolean }> {
  // Placeholder service method - cancels appointment & associated scheduled push timer
  return { success: true };
}
