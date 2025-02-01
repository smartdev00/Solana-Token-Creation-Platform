const TextField = ({ label }: { label: string }) => {
  return (
    <div>
      <label className='block text-gray-300 text-sm font-medium mb-2'>{label}</label>
      <input
        className='w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition'
        type='text'
      />
    </div>
  );
};

export default TextField;
