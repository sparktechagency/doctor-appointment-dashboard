import { Card, Form } from "antd";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../utils/constants";
import { useGetAllTeamMembersQuery } from "../../../redux/features/product/teamApi";

const { Meta } = Card;

const AboutProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: teamMembers = [], isLoading } = useGetAllTeamMembersQuery();
    
    // Find the first admin team member
    const adminTeamMember = teamMembers.find(member => member.isAdmin) || {};
    
    const profileImageUrl = `${BASE_URL}${user?.profileImage}`;
    const adminProfileImageUrl = `${BASE_URL}${adminTeamMember?.profileImage}`;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <section className="px-2 mt-5">
                <div className="rounded-lg">
                    <div className="md:flex justify-between items-center py-5">
                        <h1 className="text-xl font-semibold flex items-center">
                            <MdKeyboardArrowLeft /> About Me
                        </h1>
                        <Form layout="inline" className="md:flex space-x-4">
                            <Link to="/teammember">
                                <button className="flex justify-center items-center bg-[#77C4FE] text-white px-3 py-2 rounded-md">
                                    <FaArrowRightArrowLeft className="size-5" />
                                    <p className="px-2">My Team Member</p>
                                </button>
                            </Link>
                            <Link to="/addInformation">
                                <button className="flex justify-center items-center bg-[#77C4FE] text-white px-3 py-2 rounded-md">
                                    <FaArrowRightArrowLeft className="size-5" />
                                    <p className="px-2">Add Information</p>
                                </button>
                            </Link>
                        </Form>
                    </div>
                </div>

                <div className="mx-auto md:w-[20%] mt-16">
                    

                    {/* Display Admin Team Member */}
                    {adminTeamMember && (
                        <div className="mt-8">
                            <img
                                className="rounded-md"
                                alt="admin profile"
                                src={adminProfileImageUrl}
                               
                            />
                            <div className="py-5">
                                <Meta
                                    title={adminTeamMember.fullName}
                                    description={adminTeamMember.designation || "Team Admin"}
                                />
                            </div>
                        </div>
                    )}
                     <Link to="/edit-personal-info">
                            <button className="w-full mt-2 bg-secondary py-2 text-center text-white rounded-md border-none">
                                Edit Information
                            </button>
                        </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutProfile;