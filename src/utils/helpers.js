export const formatBudget = (budget) => (budget ? `${parseInt(budget) / 100} IDR` : "-");

export const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "text-green-600 font-bold";
    case "PAUSED":
      return "text-yellow-600 font-bold";
    case "ARCHIVED":
      return "text-gray-500 italic";
    default:
      return "text-red-600 font-semibold";
  }
};

export const Section = ({ title, children }) => (
  <div className="my-10">
    <h2 className="text-2xl font-bold text-blue-700 mb-4">{title}</h2>
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">{children}</div>
  </div>
);
