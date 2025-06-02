import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardHome from "../page/DashboardHome/DashboardHome";
import Earnings from "../page/Earnings/Earnings";
import ForgetPassword from "../page/Auth/ForgetPassword/ForgetPassword";
import SignIn from "../page/Auth/SignIn/SignIn";
import Otp from "../page/Auth/Otp/Otp";
import NewPassword from "../page/Auth/NewPassword/NewPassword";
import PersonalInformationPage from "../page/PersonalInformation/PersonalInformationPage";
import SettingsPage from "../page/Settings/SettingsPage";
import PrivacyPolicyPage from "../page/PrivacyPolicy/PrivacyPolicyPage";
import TermsconditionPage from "../page/TermsCondition/TermsconditionPage";
import AboutUsPage from "../page/AboutUs/AboutUsPage";
import UsersPage from "../page/Users/UsersPage";
import Notification from "../component/Main/Notification/Notification";
import EditPersonalInformationPage from "../page/EditPersonalInformationPage/EditPersonalInformationPage";
import EditPrivacyPolicy from "../page/EditPrivacyPolicy/EditPrivacyPolicy";
import EditTermsConditions from "../page/EditTermsConditions/EditTermsConditions";
import EditAboutUs from "../page/EditAboutUs/EditAboutUs";
import Appointment from "../page/Appointment/Appointment";
import AddSubsciptionsPage from "../page/AddSubscriptions/AddSubscriptions";
import SubscriptionsPage from "../page/Subscriptions/SubscriptionsPage";
import EditSubscriptionsitems from "../page/EditSubscriptionsitems/EditSubscriptionsitems";
import AboutProfilePage from "../page/AboutProfile/AboutProfilePage";
import AppointmentListPage from "../page/Appointment/AppointmentList";
import AddInformationPage from "../page/AddInformation/AddInformation";
import EditInformationPage from "../page/EditInformation/EditInformation.";
import TeamMemberPage from "../page/TeamMember/TeamMemberpage";
import Chat from '../page/Chat/Chat'
import LaboratoryTestRequest from "../page/LaboratoryTestRequest/LaboratoryTestRequest";
import Faq from "../component/Main/Faq/Faq";
import AddFaqPage from "../page/AddFaq/AddFaq";
// import AppointmentList from "../page/appointmentList/AppointmentList";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <MainLayout />
    ),
    errorElement: <h1>Error</h1>,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <UsersPage />,
        
      },
      {
        path: "/appointment",
        element: <Appointment />,
      },
       {
        path: "/faq",
        element: <Faq />,

      },
      {
        path: "faq/add-faq",
        element: <AddFaqPage  />,
      },
      {
        path: "faq/edit-faq/:id",
        element: <EditSubscriptionsitems />,
      },
      {
        path: "/appointmentlist",
        element: <AppointmentListPage />,
      },
     
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/laboratory-test-request",
        element: <LaboratoryTestRequest />,
      },
      {
        path: "subscriptions",
        element: <SubscriptionsPage />,
      }, 
      {
        path: "subscriptions/add-item",
        element: <AddSubsciptionsPage  />,
      },
      {
        path: "subscriptions/edit-item/:id",
        element: <EditSubscriptionsitems />,
      },
      {
        path: "earnings",
        element: <Earnings />,
      },
      {
        path: "/about",
        element: <AboutProfilePage />,
      },
       {
        path: "personal-info",
        element: <PersonalInformationPage />,
      },
      {
        path: "/teammember",
        element: <TeamMemberPage />,
      },
      {
        path: "teammember/edit-item/:id",
        
      },
      {
        path: "/addInformation",
        element: <AddInformationPage />,
      },
      {
        path: "/editInformation",
        element: <EditInformationPage />,
      },
     
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
       {
        path: "settings/personal-info",
        element: <PersonalInformationPage />,
      },
      {
        path: "settings/edit-personal-info",
        element: <EditPersonalInformationPage />,
      },
      {
        path: "settings/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/settings/edit-privacy-policy/:id",
        element: <EditPrivacyPolicy />,
      },
      {
        path: "settings/terms-conditions",
        element: <TermsconditionPage />,
      },
      {
        path: "/settings/edit-terms-conditions/:id",
        element: <EditTermsConditions />,
      },
      {
        path: "settings/about-us",
        element: <AboutUsPage />,
      },
      {
        path: "/settings/edit-about-us/:id",
        element: <EditAboutUs/>
      }
    ],
  },
  {
    path: "/auth",
    errorElement: <h1>Auth Error</h1>,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "otp/:email",
        element: <Otp />,
      },
      {
        path: "new-password/:email",
        element: <NewPassword />,
      },
    ],
  },
]);

export default router;
