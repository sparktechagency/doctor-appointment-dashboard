import { FaPlus } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";

import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineForm } from "react-icons/ai";
const FaqPage = () => {
  const faqItems = [
    {
      id: 1,
      question: "Can I see who reads my email campaigns?",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Ultrices sit feugiat venenatis habitant mattis viverra elementum purus volutpat. Lacus eu molestie pulvinar rhoncus integer pede elementum. Pretium sit fringilla massa tristique cursus commodo leo. Aliquet viverra amet sit porta elementum et pellentesque posuere...",
    },
    {
      id: 2,
      question: "Can I see who reads my email campaigns?",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Ultrices sit feugiat venenatis habitant mattis viverra elementum purus volutpat. Lacus eu molestie pulvinar rhoncus integer pede elementum. Pretium sit fringilla massa tristique cursus commodo leo. Aliquet viverra amet sit porta elementum et pellentesque posuere...",
    },
    {
      id: 3,
      question: "Can I see who reads my email campaigns?",
      answer:
        "Lorem ipsum dolor sit amet consectetur. Ultrices sit feugiat venenatis habitant mattis viverra elementum purus volutpat. Lacus eu molestie pulvinar rhoncus integer pede elementum. Pretium sit fringilla massa tristique cursus commodo leo. Aliquet viverra amet sit porta elementum et pellentesque posuere...",
    },
  ]

  return (
    <>
      <div className="w-full flex justify-between items-center py-6 ">
        <h1 className="text-xl font-semibold flex items-center">
          <MdKeyboardArrowLeft /> FAQ
        </h1>
        <Link to={`/faq/add-faq`}>
          <button className="px-8 py-3 bg-[#77C4FE] text-white flex justify-center items-center gap-1 rounded text-sm">
            <FaPlus />
            Add FAQ
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
     {faqItems.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 shadow-sm rounded-md">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 leading-tight pr-2">{item.question}</h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                   <AiOutlineDelete />
                  </button>
                  <button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                   <AiOutlineForm />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FaqPage;
