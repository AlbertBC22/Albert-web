import type { Metadata } from "next";
import SectionLabel from "@/components/blueprint/SectionLabel";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { listMessagesAdmin } from "@/lib/data/messages";
import { deleteMessage, markMessageRead } from "./actions";

export const metadata: Metadata = { title: "Mensajes" };

const DATE_FORMAT = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Madrid",
});

// Mensajes del formulario de contacto: lectura, marcar como leído y borrado.
export default async function MessagesPage() {
  const messages = await listMessagesAdmin();
  const unread = messages.filter((message) => !message.read_at).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <SectionLabel index="03">Mensajes</SectionLabel>
          <h1 className="text-h2 font-medium">Mensajes</h1>
        </div>
        <p className="label-mono text-ink-muted">
          Sin leer: <span className="text-ink">{unread}</span>
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="text-ink-muted">Todavía no hay mensajes.</p>
      ) : (
        <ol className="space-y-4">
          {messages.map((message) => (
            <li key={message.id} className={`space-y-3 border bg-paper p-4 ${message.read_at ? "border-line" : "border-sky"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p>
                  <span className="font-medium">{message.name}</span>{" "}
                  <a href={`mailto:${message.email}`} className="text-sky-ink underline-offset-4 hover:underline">
                    {message.email}
                  </a>
                </p>
                <p className="label-mono text-ink-muted">
                  {message.read_at ? "Leído" : <span className="text-sky-ink">Sin leer</span>} · {message.locale} ·{" "}
                  <time dateTime={message.created_at}>{DATE_FORMAT.format(new Date(message.created_at))}</time>
                </p>
              </div>
              <p className="whitespace-pre-line break-words">{message.message}</p>
              <div className="flex flex-wrap items-center gap-x-2 border-t border-line pt-3">
                {!message.read_at && (
                  <form action={markMessageRead.bind(null, message.id)}>
                    <SubmitButton>Marcar como leído</SubmitButton>
                  </form>
                )}
                <form action={deleteMessage.bind(null, message.id)} className="ml-auto">
                  <ConfirmSubmit message="¿Borrar este mensaje? No se puede deshacer.">Borrar</ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
