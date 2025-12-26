import { useEffect } from "react";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function LandingPageStep({ formData, setFormData }: Props) {
  useEffect(() => {
    if (!formData.finalUrl) {
      setFormData((prev: any) => ({
        ...prev,
        finalUrl: "https://pixis.ai",
      }));
    }
  }, [formData.finalUrl, setFormData]);

  return (
    <div className="bg-white p-8 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Landing Page</h2>

      <input
        placeholder="Final URL"
        value={formData.finalUrl || ""}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            finalUrl: e.target.value,
          }))
        }
        className="w-full border rounded-lg px-4 py-2"
      />
    </div>
  );
}
