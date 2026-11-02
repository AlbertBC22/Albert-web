// Campos de formulario del panel (sin estado: sirven en componentes de servidor y de cliente).

const INPUT =
  "block w-full border border-line bg-paper px-3 py-2 outline-none transition-colors focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-ink";

type BaseProps = {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  maxLength?: number;
  hint?: string;
};

type TextFieldProps = BaseProps & {
  pattern?: string;
  type?: "text" | "number" | "date" | "url";
  min?: number;
  step?: number;
};

export function TextField({ label, name, defaultValue, required, maxLength, hint, pattern, type = "text", min, step }: TextFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="label-mono text-ink-muted">
        {label}
        {required && <span aria-hidden> *</span>}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        min={min}
        step={step}
        className={INPUT}
      />
      {hint && <span className="block text-sm text-ink-muted">{hint}</span>}
    </label>
  );
}

export function TextArea({ label, name, defaultValue, required, maxLength, hint, rows = 3 }: BaseProps & { rows?: number }) {
  return (
    <label className="block space-y-1.5">
      <span className="label-mono text-ink-muted">
        {label}
        {required && <span aria-hidden> *</span>}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        maxLength={maxLength}
        rows={rows}
        className={INPUT}
      />
      {hint && <span className="block text-sm text-ink-muted">{hint}</span>}
    </label>
  );
}

export function SelectField({ label, name, defaultValue, options }: Pick<BaseProps, "label" | "name" | "defaultValue"> & { options: { value: string; label: string }[] }) {
  return (
    <label className="block space-y-1.5">
      <span className="label-mono text-ink-muted">{label}</span>
      <select name={name} defaultValue={defaultValue ?? undefined} className={INPUT}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-sky-ink" />
      <span>{label}</span>
    </label>
  );
}

// Mensaje de resultado de un formulario (error o "guardado").
export function FormMessage({ error, ok }: { error: string | null; ok?: boolean }) {
  if (error) {
    return (
      <p role="alert" className="border-l border-red-700 pl-3 text-sm text-red-700">
        {error}
      </p>
    );
  }
  if (ok) {
    return (
      <p role="status" className="border-l border-sky pl-3 text-sm text-sky-ink">
        Guardado.
      </p>
    );
  }
  return null;
}
