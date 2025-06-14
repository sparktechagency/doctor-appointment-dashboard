import { HomeOutlined } from "@ant-design/icons";
import { FaAward } from "react-icons/fa";
import { FiFacebook, FiLinkedin, FiTwitter } from "react-icons/fi";
import { MdLocalPhone, MdOutlineEmail, MdSchool, MdWork } from "react-icons/md";
import { useGetTeamMemberByIdQuery } from "../../../redux/features/product/teamApi";
import { Skeleton } from "antd";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../../utils/constants";
const breadcrumbItems = [
  {
    href: "/",
    title: (
      <div className="flex gap-2 items-center">
        <HomeOutlined />
        <span>Home</span>
      </div>
    ),
  },
  {
    href: "/team-members",
    title: "Team Members",
  },
  {
    title: "Team Member Details",
  },
];

const MemberDetails = () => {
  const { id } = useParams();
  const { data: memberData, isLoading, isError } = useGetTeamMemberByIdQuery(id);
  
  // Access the nested data structure correctly
  const member = memberData?.data?.attributes?.team;
  const scheduleList = memberData?.data?.attributes?.scheduleList || [];

  if (isLoading) {
    return (
      <section className="w-full py-10">
        <div className="w-full hidden lg:block p-36 my-5 bg-[#F1F9FF]"></div>
        <div className="w-full md:w-[80%] mx-auto flex flex-col lg:flex-row gap-20 mt-10">
          <div className="w-full lg:w-1/3 rounded-xl">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
          <div className="w-full md:w-[600px] mx-auto rounded-xl -mt-0 lg:-mt-56">
            <Skeleton active paragraph={{ rows: 20 }} />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !member) {
    return (
      <section className="w-full py-10">
        <div className="text-center py-20">
          <p className="text-red-500 text-xl">Failed to load team member details</p>
        </div>
      </section>
    );
  }

  const imageUrl = member?.profileImage
    ? `${BASE_URL }${member.profileImage}`
    : `${BASE_URL }${member.profileImage}`;


  return (
    <section className="w-full py-10">
      <div className="w-full hidden lg:block p-36 my-5 bg-[#F1F9FF]"></div>
      
      <div className="w-full md:w-[80%] mx-auto flex flex-col lg:flex-row gap-20 mt-10">
        <div className="w-full lg:w-1/3 rounded-xl">
          <div className="flex flex-col items-center">
            <div className="w-full h-[full] max-w-[500px] mx-auto bg-[#C0E4FF] flex justify-center relative rounded-xl px-5 py-8 -mt-0 lg:-mt-32">
              <img
                src={imageUrl || "/default-profile.png"}
                alt={member.fullName}
                className="h-[280px] lg:h-[180px] xl:h-[270px] 2xl:h-[320px] bottom-0 absolute object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="w-full space-y-4 my-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-[#274760]">
                Contact Info
              </h1>
              <div className="flex space-x-3">
                {member.media?.facebook && (
                  <Link
                    to={member.media.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 bg-[#77C4FE] text-secondary rounded-full flex justify-center items-center hover:bg-[#6CB2E7] hover:text-white transition-all duration-300"
                  >
                    <FiFacebook size={18} color="white" />
                  </Link>
                )}
                {member.media?.linkedin && (
                  <Link
                    to={member.media.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 bg-[#77C4FE] text-secondary rounded-full flex justify-center items-center hover:bg-[#6CB2E7] hover:text-white transition-all duration-300"
                  >
                    <FiLinkedin size={18} color="white" />
                  </Link>
                )}
                {member.media?.X && (
                  <Link
                    to={member.media.X}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 bg-[#77C4FE] text-secondary rounded-full flex justify-center items-center hover:bg-[#6CB2E7] hover:text-white transition-all duration-300"
                  >
                    <FiTwitter size={18} color="white" />
                  </Link>
                )}
              </div>
            </div>
            {member.phoneNumber && (
              <div className="flex items-center gap-3">
                <MdLocalPhone color="#77C4FE" size={24} />
                <h1 className="font-semibold">
                  {member.callingCode} {member.phoneNumber}
                </h1>
              </div>
            )}
            {member.email && (
              <div className="flex items-center gap-3">
                <MdOutlineEmail color="#77C4FE" size={24} />
                <h1 className="font-semibold">{member.email}</h1>
              </div>
            )}
            
            {scheduleList.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-[#274760] mb-3">Availability</h2>
                {scheduleList.map((slot, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-medium">{slot.dayOfWeek}</p>
                    <p>
                      {slot.startTime} - {slot.endTime} {slot.timezone && `(${slot.timezone})`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[600px] mx-auto rounded-xl -mt-0 lg:-mt-56">
          <div className="space-y-16 text-[#274760]">
            <div className="space-y-4 text-[#274760]">
              <h1 className="text-4xl font-semibold">{member.fullName}</h1>
              <p className="text-xl font-semibold">{member.designation}</p>
              {member.specialties && (
                <p className="text-xl font-semibold">{member.specialties}</p>
              )}
              {member.about && <p className="text-gray-700">{member.about}</p>}
            </div>

            {member.degrees?.length > 0 && (
              <div>
                <h3 className="font-bold text-2xl mb-3 text-[#32526B] flex items-center gap-3">
                  <MdSchool color="#77C4FE" size={32} /> Education
                </h3>
                <ul className="space-y-4 px-6">
                  {member.degrees.map((degree, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-[#77C4FE] w-2 h-2 mt-2 rounded-full inline-block"></span>
                      <div>
                        <h1 className="text-xl font-semibold text-[#32526B]">
                          {degree.school || degree.institution}
                        </h1>
                        {degree.degree && (
                          <p className="text-[#627D98]">{degree.degree}</p>
                        )}
                        {degree.fieldOfStudy && (
                          <p className="text-[#627D98]">Field: {degree.fieldOfStudy}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.experience?.length > 0 && (
              <div>
                <h3 className="font-bold text-2xl mb-3 text-[#32526B] flex items-center gap-3">
                  <MdWork color="#77C4FE" size={32} /> Experience
                </h3>
                <ul className="space-y-4 px-6">
                  {member.experience.map((exp, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-[#77C4FE] w-2 h-2 mt-2 rounded-full inline-block"></span>
                      <div>
                        <h1 className="font-semibold text-[#32526B]">
                          {exp.position || exp.title} at {exp.company}
                        </h1>
                        <p className="text-[#627D98]">
                          {exp.employmentType} • {exp.location}
                        </p>
                        {exp.description && (
                          <p className="text-[#627D98]">{exp.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.achievements?.length > 0 && (
              <div>
                <h3 className="font-bold text-2xl mb-3 text-[#32526B] flex items-center gap-3">
                  <FaAward color="#77C4FE" size={32} /> Awards
                </h3>
                <ul className="space-y-4 px-6">
                  {member.achievements.map((award, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-[#77C4FE] w-2 h-2 mt-2 rounded-full inline-block"></span>
                      <div>
                        <h1 className="text-xl font-semibold text-[#32526B]">
                          {award.title}
                        </h1>
                        {award.description && (
                          <p className="text-[#627D98]">{award.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberDetails;