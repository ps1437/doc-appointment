export default function Alert({  message }) {
  
    return (
      <div className={`flex items-center justify-between p-4 border-l-4 mb-2 rounded-md bg-red-100 text-red-700 border-red-500`}>
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  }
  