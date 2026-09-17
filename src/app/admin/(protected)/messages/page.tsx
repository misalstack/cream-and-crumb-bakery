import { toggleMessageRead } from "@/app/admin/actions";
import { Badge, Card, EmptyState } from "@/components/ui";
import { IS_DEMO } from "@/lib/demo";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
  });
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <>
      <h1 className="font-display text-4xl text-ink-900">Messages</h1>
      <p className="mt-1 text-sm text-ink-700">
        {messages.length} total{unread > 0 && ` · ${unread} unread`}
      </p>

      <div className="mt-8 space-y-5">
        {messages.length === 0 ? (
          <EmptyState title="No messages yet" body="Anything sent from the contact form arrives here." />
        ) : (
          messages.map((message) => (
            <Card key={message.id} className={message.isRead ? "p-7 opacity-70" : "p-7"}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-ink-900">{message.subject}</h2>
                  <p className="mt-1 text-sm text-ink-700">
                    {message.name} ·{" "}
                    <a href={`mailto:${message.email}`} className="text-accent hover:underline">
                      {message.email}
                    </a>
                    {message.phone && (
                      <>
                        {" · "}
                        <a href={`tel:${message.phone}`} className="text-accent hover:underline">
                          {message.phone}
                        </a>
                      </>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-ink-700">{formatDateTime(message.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {!message.isRead && <Badge tone="wine">Unread</Badge>}
                  {IS_DEMO ? (
                    <button
                      type="button"
                      disabled
                      title="Read-only in this preview"
                      className="rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium text-ink-700 opacity-50"
                    >
                      Mark as {message.isRead ? "unread" : "read"}
                    </button>
                  ) : (
                    <form action={toggleMessageRead}>
                      <input type="hidden" name="messageId" value={message.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-ink-900/15 px-4 py-2 text-xs font-medium text-ink-700 transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        Mark as {message.isRead ? "unread" : "read"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <p className="mt-5 whitespace-pre-wrap rounded-xl bg-cream-100 px-5 py-4 text-sm leading-relaxed text-ink-900">
                {message.message}
              </p>

              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                className="mt-5 inline-flex items-center rounded-full bg-wine-800 px-5 py-2.5 text-sm font-semibold text-paper-50 transition-colors hover:bg-wine-700"
              >
                Reply by email
              </a>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
