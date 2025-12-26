interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function BasicsStep({ formData, setFormData }: Props) {
  return (
    <div className="bg-white p-8 rounded-lg border">
      <input
        placeholder="Campaign Name"
        value={formData.campaignName}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            campaignName: e.target.value,
          }))
        }
        className="w-full border rounded-lg px-4 py-2 mb-4"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Daily Budget"
          value={formData.dailyBudget}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              dailyBudget: e.target.value,
            }))
          }
          className="border rounded-lg px-4 py-2"
        />

        <select
          value={formData.targetLocation}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              targetLocation: e.target.value,
            }))
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="us">United States</option>
          <option value="us_ca">US + Canada</option>
          <option value="all">All Countries</option>
        </select>
      </div>
    </div>
  );
}
