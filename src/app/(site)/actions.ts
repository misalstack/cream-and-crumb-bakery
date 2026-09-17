"use server";

import { prisma } from "@/lib/prisma";
import { ActionState, Validator, todayUtc } from "@/lib/validation";

export async function submitContactMessage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const v = new Validator(formData);
  const name = v.required("name", "Name", { max: 120 });
  const email = v.email("email", "Email", { required: true });
  const phone = v.optional("phone", "Phone", { max: 40 });
  const subject = v.required("subject", "Subject", { max: 160 });
  const message = v.required("message", "Message", { max: 4000 });

  if (v.hasErrors) {
    return { ok: false, errors: v.errors, message: "Please check the highlighted fields." };
  }

  await prisma.contactMessage.create({
    data: { name, email: email!, phone, subject, message },
  });

  return {
    ok: true,
    message: "Thank you — your message is with us. We reply to everything within one working day.",
  };
}

export async function submitCustomCakeRequest(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const v = new Validator(formData);
  const name = v.required("name", "Name", { max: 120 });
  const phone = v.phone("phone", "Phone number");
  const email = v.email("email", "Email");
  const occasion = v.required("occasion", "Occasion", { max: 120 });
  const eventDate = v.date("eventDate", "Event date", { notBefore: todayUtc() });
  const servings = v.integer("servings", "Number of servings", { min: 1, max: 2000 });
  const flavour = v.optional("flavour", "Flavour", { max: 200 });
  const budgetRwf = v.integer("budgetRwf", "Budget", { min: 0, max: 100_000_000 });
  const description = v.required("description", "Description", { max: 4000 });

  if (v.hasErrors) {
    return { ok: false, errors: v.errors, message: "Please check the highlighted fields." };
  }

  await prisma.customCakeRequest.create({
    data: { name, phone, email, occasion, eventDate, servings, flavour, budgetRwf, description },
  });

  return {
    ok: true,
    message:
      "Got it — your request is in. We will call or WhatsApp you within one working day to talk through the design and quote it properly.",
  };
}
