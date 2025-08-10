export default function CodeBlock({ code, filename }) {
  return (
    <div className="bg-black text-white p-4 rounded-md text-sm overflow-x-auto">
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
