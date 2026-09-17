"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  clearStaffSessionCookie,
  requireStaff,
  setStaffSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { ORDER_STATUSES, REQUEST_STATUSES, type StaffRole } from "@/lib/enums";
import { ActionState, Validator } from "@/lib/validation";

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const v = new Validator(formData);
  const email = v.email("email", "Email", { required: true });
  const password = v.required("password", "Password", { max: 200 });
  if (v.hasErrors) return { ok: false, errors: v.errors };

  const staff = await prisma.staffUser.findUnique({ where: { email: email!.toLowerCase() } });
  // Same message either way — don't reveal which accounts exist.
  const invalid: ActionState = { ok: false, message: "Those details did not match. Please try again." };
  if (!staff) return invalid;
  if (!(await verifyPassword(password, staff.passwordHash))) return invalid;

  await setStaffSessionCookie({
    staffId: staff.id,
    name: staff.name,
    role: staff.role as StaffRole,
  });
  redirect("/admin");
}

export async function logout() {
  await clearStaffSessionCookie();
  redirect("/admin/login");
}

export async function updateOrderStatus(formData: FormData) {
  await requireStaff();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!orderId || !(ORDER_STATUSES as readonly string[]).includes(status)) return;

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateRequestStatus(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !(REQUEST_STATUSES as readonly string[]).includes(status)) return;

  await prisma.customCakeRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/custom-cakes");
}

export async function toggleMessageRead(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("messageId") ?? "");
  if (!id) return;

  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) return;

  await prisma.contactMessage.update({ where: { id }, data: { isRead: !message.isRead } });
  revalidatePath("/admin/messages");
}
