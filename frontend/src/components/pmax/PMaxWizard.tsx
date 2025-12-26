import BasicsStep from "./steps/BasicsStep";
import LandingPageStep from "./steps/LandingPageStep";
import AssetsStep from "./steps/AssetsStep";
import ImagesStep from "./steps/ImagesStep";

const steps = ["Basics", "Landing Page", "Assets", "Images"];

export default function PMaxWizard({
    step,
    formData,
    setFormData,
    nextStep,
    prevStep,
    createCampaign,
    isCreating,
    creationStatus,
  }: any) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Step Header */}
      <div className="flex gap-4 mb-8">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-full text-sm ${
              i === step ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {step === 0 && <BasicsStep formData={formData} setFormData={setFormData} />}
{step === 1 && <LandingPageStep formData={formData} setFormData={setFormData} />}
{step === 2 && <AssetsStep formData={formData} setFormData={setFormData} />}
{step === 3 && <ImagesStep formData={formData} setFormData={setFormData} />}


      {creationStatus && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            creationStatus.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {creationStatus.message}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button onClick={prevStep} disabled={step === 0}>
          Back
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Next
          </button>
        ) : (
            <button
            onClick={createCampaign}
            disabled={isCreating}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            {isCreating ? "Creating..." : "Create Campaign"}
          </button>
          
        )}
      </div>
    </div>
  );
}
