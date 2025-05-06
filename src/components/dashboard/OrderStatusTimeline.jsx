import { Package } from 'lucide-react';

export const OrderStatusTimeline = ({ order }) => {
  const { status, createdAt } = order;

  const formattedDate = new Date(createdAt).toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = new Date(createdAt).toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Define all possible statuses in order
  const statusSteps = [
    {
      key: 'pending',
      label: 'Bestelling ontvangen',
      description: `${formattedDate} - ${formattedTime}`,
    },
    {
      key: 'processing',
      label: 'In behandeling',
      description: 'Wordt momenteel verwerkt',
    },
    {
      key: 'shipped',
      label: 'Verzonden',
      description: 'Onderweg naar bestemming',
    },
    {
      key: 'delivered',
      label: 'Afgeleverd',
      description: 'Bestelling is afgeleverd',
    },
  ];

  // Map the current status to a number for comparison
  const statusMap = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: -1,
  };

  const currentStatusIndex = statusMap[status];

  // Special handling for cancelled orders
  if (status === 'cancelled') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold mb-4 flex items-center">
          <Package size={20} className="text-teal-600 mr-2" />
          Bestelstatus
        </h2>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Bestelling geannuleerd
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Deze bestelling is geannuleerd op {formattedDate}.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-bold mb-4 flex items-center">
        <Package size={20} className="text-teal-600 mr-2" />
        Bestelstatus
      </h2>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {statusSteps.map((step, index) => {
          // Determine the state of this step
          let stepStatus;
          if (index < currentStatusIndex) {
            stepStatus = 'completed'; // Past step
          } else if (index === currentStatusIndex) {
            stepStatus = 'current'; // Current step
          } else {
            stepStatus = 'upcoming'; // Future step
          }

          // Set visual properties based on the step status
          let circleClasses =
            'absolute left-1.5 w-6 h-6 rounded-full border-4 border-white shadow ';
          let textClasses = '';

          if (stepStatus === 'completed') {
            circleClasses += 'bg-teal-600';
            textClasses = 'text-gray-800';
          } else if (stepStatus === 'current') {
            circleClasses += 'bg-teal-500';
            textClasses = 'text-gray-800 font-semibold';
          } else {
            circleClasses += 'bg-gray-200';
            textClasses = 'text-gray-500';
          }

          return (
            <div
              key={step.key}
              className={`relative pl-12 ${
                index < statusSteps.length - 1 ? 'pb-8' : ''
              }`}
            >
              <div className={circleClasses}></div>
              <div>
                <p className={`font-medium ${textClasses}`}>{step.label}</p>
                <p className="text-sm text-gray-500">{step.description}</p>

                {/* Show estimated delivery date for shipped status */}
                {step.key === 'shipped' && currentStatusIndex >= 2 && (
                  <p className="text-sm text-teal-600 font-medium mt-1">
                    Verwachte levering:{' '}
                    {new Date(
                      Date.now() + 2 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString('nl-NL')}
                  </p>
                )}

                {/* Show delivery confirmation for delivered status */}
                {step.key === 'delivered' && currentStatusIndex >= 3 && (
                  <p className="text-sm text-teal-600 font-medium mt-1">
                    Afgeleverd op{' '}
                    {new Date(Date.now()).toLocaleDateString('nl-NL')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
