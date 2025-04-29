export default function Cart() {
    return (
      <div className="relative">
        {/* Ensure cart is fixed at the top right corner */}
        <div className="fixed top-20 right-6 w-80 bg-white shadow-xl rounded-lg p-4 z-50">
          <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Your Course Schedule</h2>

          <ul className="space-y-3 max-h-64 overflow-y-auto">
           
          </ul>

          <div className="mt-4 border-t pt-3 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600"></span>
        
          </div>
        </div>
      </div>
    );
}
