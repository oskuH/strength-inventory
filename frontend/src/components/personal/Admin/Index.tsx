import AdminGyms from './Gyms/Index';

export default function AdminLayoutComponent () {
  return (
    <div
      className='
      flex flex-1 justify-center items-stretch w-full overflow-hidden'
    >
      <div className='flex flex-1 gap-3 p-3 min-w-90 max-w-145'>
        <AdminGyms />
      </div>
    </div>
  );
}
