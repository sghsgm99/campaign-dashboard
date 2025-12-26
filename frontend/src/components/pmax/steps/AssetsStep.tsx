export default function AssetsStep({ formData, setFormData }: any) {
  const update = (
    field: "headlines" | "descriptions",
    index: number,
    value: string
  ) => {
    setFormData((prev: any) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };
  
  return (
    <div className="bg-white p-8 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Ad Assets</h2>

      <h3 className="font-semibold mb-2">Long Headlines</h3>
      <input
        placeholder="Long Headlines"
        value={formData.longHeadlines || ""}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            longHeadlines: e.target.value,
          }))
        }
        className="w-full border rounded-lg px-4 py-2"
      />

      <h3 className="font-semibold mt-6 mb-2">Headlines</h3>
      {formData.headlines.map((h: string, i: number) => (
        <input
          key={i}
          value={h}
          onChange={(e) => update("headlines", i, e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-2"
        />
      ))}

      <h3 className="font-semibold mt-6 mb-2">Descriptions</h3>
      {formData.descriptions.map((d: string, i: number) => (
        <input
          key={i}
          value={d}
          onChange={(e) => update("descriptions", i, e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-2"
        />
      ))}
    </div>
  );
}
