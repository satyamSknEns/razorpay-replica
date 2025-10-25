"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("../../dashboard/Dashboard"));
const Attendance = dynamic(() => import("../../attendence/Attendence"));
const Reimbursements = dynamic(
  () => import("../../reimbursements/Reimbursements")
);
const TaxDeductions = dynamic(
  () => import("../../taxDeductions/TaxDeductions")
);
const Documents = dynamic(() => import("../../document/DocumentUpload"));
const Insurance = dynamic(() => import("../../insurance/Insurance"));
const Help = dynamic(() => import("../../help/Help"));
const SlipPage = dynamic(() => import("../../slipPage/SlipPage"));
const Profile = dynamic(() => import("../../profile/Profile"));
const Settings = dynamic(() => import("../../settings/Setting"));
const Teams = dynamic(() => import("../../teams/Teams"));
const Employees = dynamic(() => import("../../employees/page"));
const Department = dynamic(() => import("../../department/page"));
const LeaveType = dynamic(() => import("../../leavetype/page"));
const Managers = dynamic(() => import("../../managers/page"));

export default function SectionPage() {
  const { section } = useParams();

  switch (section) {
    case "dashboard":
      return <Dashboard />;
    case "attendance":
      return <Attendance />;
    case "reimbursements":
      return <Reimbursements />;
    case "taxdeduction":
      return <TaxDeductions />;
    case "document":
      return <Documents />;
    case "insurance":
      return <Insurance />;
    case "help":
      return <Help />;
    case "mypay":
      return <SlipPage />;
    case "profile":
      return <Profile />;
    case "settings":
      return <Settings />;
    case "teams":
      return <Teams />;
    case "employees":
      return <Employees />;
    case "department":
      return <Department />;
    case "leavetype":
      return <LeaveType />;
    case "managers":
      return <Managers />;
    default:
      return <div>Page {section} not found</div>;
  }
}
