import axios, { AxiosRequestConfig } from "axios";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseButton from "../components/CloseButton";
import CustomButton from "../components/CustomButton";

const Department = () => {
  const cookies = useCookies();
  const token = cookies.get("token");
  const [addLeaveType, setAddLeaveType] = useState(false);
  const [departmentType, setDepartmentType] = useState<any[]>([]);
  const [adddepartmentType, setAdddepartmentType] = useState("");
  const [deletedid, setDeletedId] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchAllLeaveType = async () => {
      try {
        const leaveConfig: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getAllDepartments`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const allLeavesType = await axios.request(leaveConfig);
        if (allLeavesType.data.success) {
          const allHistoryes = allLeavesType.data.departments;
          setDepartmentType(allHistoryes);
        } else {
          console.error("API error:", allLeavesType.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch the data", error);
      }
    };
    fetchAllLeaveType();
  }, [token]);

  const AddDepartment = async () => {
    try {
      const leaveconfig: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/createDepartment`,
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          name: adddepartmentType,
        },
      };
      const response = await axios.request(leaveconfig);

      if (response.status === 200 || response.status === 201) {
        setDepartmentType((prev: any[]) => [
          ...(prev as any[]),
          response.data.department,
        ]);
        toast.success("Department created successfully!");
      } else {
        console.error("Something went wrong while creating the department");
        toast.error("Failed to create department");
      }
    } catch (error) {
      console.error("There is some error to creatinf the department", error);
    } finally {
      setAddLeaveType(false);
      setAdddepartmentType("");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/deleteDepartment`,
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: id,
        },
      };
      const response = await axios.request(config);
      // if (response.status === 200) {
      //   window.location.reload();
      // } else {
      //   console.error("there is some this wrong in creating the leave type");
      // }

      if (response.status === 200) {
        setDepartmentType((prev: any[]) => prev.filter((dep) => dep.id !== id));
        toast.success("Department deleted successfully!");
        setDeletePopup(false);
      } else {
        console.error("Error deleting department");
        toast.error("Failed to delete department");
      }
    } catch (error) {
      console.error("there is some error in delete leave type", error);
    }
  };

  return (
    <div className="lg:px-4 md:px-4 sm:px-2 px-2 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">All Departments</h1>
      <div className="flex justify-end pb-3">
        <CustomButton
          text="Add Department Type"
          onClick={() => setAddLeaveType(true)}
          color="bg-blue-500"
        />
      </div>

      {addLeaveType && (
        <div
          onClick={() => setAddLeaveType(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[200px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-3 border-gray-600 mt-2">
              <h3 className="text-2xl font-semibold">Add Department Name</h3>
              <CloseButton onClose={() => setAddLeaveType(false)} />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="">Department Name</label>
              <input
                placeholder="Enter Department Name"
                className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white"
                value={adddepartmentType}
                onChange={(e) => setAdddepartmentType(e.target.value)}
                required
              />
            </div>
            <div className="w-full my-6">
              <button
                onClick={AddDepartment}
                className="w-full py-2 bg-[#2E5BFF] text-white rounded-[5px] cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-4 rounded">
        <table className="min-w-full border border-gray-800 text-left">
          <thead className="bg-gray-700 uppercase text-sm">
            <tr>
              <th className="px-4 py-2 border border-gray-600">id</th>
              <th className="px-4 py-2 border border-gray-600">
                Department Name
              </th>
              <th className="px-4 py-2 border border-gray-600 text-center">
                Delete
              </th>
            </tr>
          </thead>

          <tbody>
            {departmentType && departmentType.length > 0 ? (
              departmentType.map((item: any, index) => (
                <tr key={item.id} className="border border-gray-600">
                  <td className="px-4 py-2 border border-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 capitalize border border-gray-600">
                    {item.name}
                  </td>
                  <td className="px-4 py-2 text-center border border-gray-600">
                    <button
                      onClick={() => {
                        setDeletePopup(true);
                        setDeletedId(item.id);
                      }}
                      className="bg-red-500 pb-1.5 px-1 rounded cursor-pointer"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-center text-gray-400">
                  No Department types found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deletePopup && (
        <div
          onClick={() => setDeletePopup(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[150px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-2 border-gray-600 mt-2">
              <h3 className="text-2xl font-semibold">Delete Department Type</h3>
              <CloseButton onClose={() => setDeletePopup(false)} />
            </div>

            <div>
              <h4 className="text-md border-b border-gray-500 py-5">
                Are you sure you want to delete this Department Type? This
                action cannot be undone.
              </h4>
              <div className="flex gap-3 my-3 justify-end">
                <CustomButton
                  text="Yes"
                  onClick={() => handleDelete(Number(deletedid))}
                  color="bg-red-500"
                />
                <CustomButton
                  text="No"
                  onClick={() => setDeletePopup(false)}
                  color="bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;
