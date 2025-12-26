export default function ImagesStep({ formData, setFormData }: any) {
  const upload = (key: string, file: File) => {
    setFormData((prev: any) => ({
      ...prev,
      images: { ...prev.images, [key]: file },
    }));
  };
  
  return (
    <div className="bg-white p-8 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Images</h2>

      {["square", "landscape", "logo"].map((type) => (
        <div key={type} className="mb-4">
          <label className="block font-medium mb-1">{type}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => upload(type, e.target.files![0])}
          />
        </div>
      ))}
    </div>
  );
}
