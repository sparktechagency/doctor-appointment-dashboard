const data = [
    {
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "Alice Johnson",
      email: "johnson@example.com",
      date: "2024-10-05 14:30:00",
    },
    {
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      name: "Bob Smith",
      email: "smith@example.com",
      date: "2024-10-06 09:15:00",
    },
    {
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      name: "Carol Williams",
      email: "williams@example.com",
      date: "2024-10-07 10:45:00",
    },
    {
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      name: "David Brown",
      email: "brown@example.com",
      date: "2024-10-08 12:00:00",
    },
    {
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      name: "Eve Davis",
      email: "davis@example.com",
      date: "2024-10-09 16:30:00",
    },
  ];
  

  const DayAppointment = () => {
    return (
     <div>
        <h1 className="text-xl py-5 ">To Day Appointment </h1>
         <div className="py-6 space-y-2 bg-[#77C4FE] rounded-md">
        {data.map((item, index) => {
          const date = new Date(item.date); // Convert the string to a Date object
          const formattedDate = date.toLocaleString(); // Format the date to show both date and time
  
          return (
            <div
              key={index}
              className="bg-white shadow-md  overflow-hidden md:flex py-2 px-4 space-x-5 border-b hover:bg-gray-50"
            >
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.image}
                  alt="m"
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
              </div>
  
              {/* Name and Email */}
              <div className="flex-grow md:flex space-x-2 justify-around">
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">{item.email}</p>
              </div>
  
              {/* Date */}
              <div className="flex-shrink-0">
                <p className="text-gray-500 text-sm">{formattedDate}</p>
              </div>
            </div>
          );
        })}
      </div>
     </div>
    );
  };
  
  export default DayAppointment;
  
