import { createElement } from "react";
import { useField } from "formik";

export default function Field ({ label, tag = 'input', ...props }) {
  const [field, meta] = useField(props.name);

  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      {createElement(tag, {
          className: 'border rounded block w-full p-1 px-2',
          ...field,
          ...props,
        })}
      {meta.touched && meta.error ? (
        <div className="text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
}
