const OrderProductsCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-gray-500 text-sm">Name</span>
        <span className="text-gray-900 font-semibold text-sm truncate max-w-[180px]" title={data.name}>
          {data.name}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">Quantity</span>
        <span className="text-gray-700 font-medium text-sm">{data.quantity}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">Price</span>
        <span className="text-gray-700 font-medium text-sm">€ {data.price?.toFixed(2)}</span>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-gray-500 text-sm">Total</span>
        <span className="text-gray-900 font-bold text-base">
          € {(data.price * data.quantity)?.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderProductsCard;
