"use client";
import { useEffect, useRef, useState } from "react";
import { Svg, Path } from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  pdf,
  Image,
} from "@react-pdf/renderer";
import axios, { AxiosRequestConfig } from "axios";
import { useCookies } from "next-client-cookies";

const VisibilityIcon = () => (
  <Svg viewBox="0 0 24 24" width="12" height="12" style={{ marginRight: 4 }}>
    <Path
      d="M12 6c-5 0-9 6-9 6s4 6 9 6 9-6 9-6-4-6-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
      fill="#000"
    />
    <Path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#000" />
  </Svg>
);

interface profile {
  profile?: {
    name?: string;
    id?: number;
    email?: string;
    department?: string;
    details?: string;
    joiningDate?: any;
  };
}

const PayslipDocument = () => {
  const [data, setData] = useState<profile>({});
  const [token, setToken] = useState<string | null>(null);
  const [userDegignation, setUserDegignation] = useState();
  const [salaryData, setSalaryData] = useState<any>({});
  const cookies = useCookies();

  useEffect(() => {
    const handleGetcookies = async () => {
      const storeCookies = cookies.get("token");
      setToken(storeCookies ?? null);
    };
    handleGetcookies();
  }, []);

  useEffect(() => {
    if (!token) return;
    const handleApi = async () => {
      const configDetails: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/getDetails`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {},
      };
      const resData = await axios.request(configDetails);
      setUserDegignation(resData.data.details.details);
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserProfile`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const res = await axios.request(config);
        setData(res.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    const handleSalaryStructure = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getSalaryStructureByUserId`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const res = await axios.request(config);
        setSalaryData(res.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    handleApi();
    handleSalaryStructure();
  }, [token]);

  console.log("data::", salaryData);

  return (
    <Document>
      <Page size="A4" style={{ padding: "0 20px" }}>
        <View
          style={{
            backgroundColor: "#e8d8c3",
            padding: 5,
            color: "#2e2e2f",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "2px 0",
            borderRadius: "2px",
          }}
        >
          <VisibilityIcon />
          <Text style={{ fontSize: 11 }}>
            You are viewing your detailed salary breakdown for this month.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              src="/logo.png"
              style={{
                width: "60px",
                height: "30px",
                marginRight: "8px",
              }}
            />
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "semibold",
                color: "#000",
              }}
            >
              ENS Enterprises Private Limited
            </Text>
          </View>

          <View
            style={{
              fontSize: 9,
              fontWeight: "semibold",
              color: "#000",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text>Payslip : </Text>
            <Text>
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            padding: "8px 0",
          }}
        >
          <View style={{ margin: "0 12px" }}>
            <Text
              style={{
                color: "#000",
                fontSize: "11px",
                fontWeight: "semibold",
                marginBottom: "6px",
              }}
            >
              Net Pay
            </Text>
            <Text
              style={{
                color: "#000",
                fontSize: "11px",
                fontWeight: "semibold",
              }}
            >
              {salaryData.netSalary || "NA"}
            </Text>
          </View>
          <View style={{ margin: "0 12px" }}>
            <Text style={{ color: "#000", fontWeight: "semibold" }}>=</Text>
          </View>
          <View
            style={{
              margin: "0 12px",
              borderLeft: "2px solid green",
              paddingLeft: "12px",
              fontWeight: "semibold",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: "11px",
                fontWeight: "semibold",
                marginBottom: "6px",
              }}
            >
              Gross Pay (A)
            </Text>
            <Text
              style={{
                color: "#000",
                fontWeight: "semibold",
                fontSize: "11px",
              }}
            >
              + {salaryData.grossSalary || "NA"}
            </Text>
          </View>
          <View
            style={{
              margin: "0 12px",
              borderLeft: "2px solid red",
              paddingLeft: "12px",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontWeight: "semibold",
                fontSize: "11px",
                marginBottom: "6px",
              }}
            >
              Deductions (B)
            </Text>
            <Text
              style={{
                color: "#000",
                fontWeight: "semibold",
                fontSize: "11px",
              }}
            >
              - {salaryData.totalDeductions || "NA"}
            </Text>
          </View>
        </View>

        <View style={{ padding: "10px 0", fontSize: "10px" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "2px",
              border: "1px solid #a4a4a5",
              padding: "6px",
              borderRadius: "2px",
            }}
          >
            <Text style={{ fontWeight: "semibold" }}>Employee Code : </Text>
            <Text> ENS-0{data?.profile?.id || "NA"}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "2px",
              border: "1px solid #a4a4a5",
              padding: "6px",
              borderRadius: "2px",
            }}
          >
            <Text style={{ fontWeight: "semibold" }}>Name : </Text>
            <Text style={{ textDecorationStyle: "capitalize" }}>
              {data?.profile?.name
                ? data.profile.name
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "NA"}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "2px",
              border: "1px solid #a4a4a5",
              padding: "6px",
              borderRadius: "2px",
            }}
          >
            <Text style={{ fontWeight: "semibold" }}>Email : </Text>
            <Text> {data?.profile?.email || "NA"}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "2px",
              border: "1px solid #a4a4a5",
              padding: "6px",
              borderRadius: "2px",
            }}
          >
            <Text style={{ fontWeight: "semibold" }}>Designation : </Text>
            <Text>{userDegignation || "NA"}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "2px",
              border: "1px solid #a4a4a5",
              padding: "6px",
              borderRadius: "2px",
            }}
          >
            <Text style={{ fontWeight: "semibold" }}>Department : </Text>
            <Text>{data?.profile?.department || "NA"}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "2px",
              border: "1px solid #a4a4a5",
              padding: "6px",
              borderRadius: "2px",
            }}
          >
            <Text style={{ fontWeight: "semibold" }}>Date of Joining : </Text>
            <Text>
              {data?.profile?.joiningDate
                ? new Date(data.profile.joiningDate).toLocaleDateString("en-GB")
                : "NA"}
            </Text>
          </View>
        </View>

        <View style={{ padding: "10px 0" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "semibold",
                borderLeft: "3px solid #0f4a02",
                paddingLeft: "10px",
              }}
            >
              Salary Structure
            </Text>
            <Text
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "#0f4a02",
                transform: "rotate(45deg)",
                margin: "0 4px 0 4px",
              }}
            />
            <Text
              style={{
                fontSize: "9px",
                color: "#767473",
                letterSpacing: "0.25px",
              }}
            >
              Breakdown of your full salary components
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              fontSize: "10px",
              margin: "10px 0 0px 10px",
              backgroundColor: "#eafbf0",
              borderRadius: "2px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                borderBottom: "2px solid #bbe4c8",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                  fontWeight: "semibold",
                }}
              >
                Earnings
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontWeight: "semibold",
                }}
              >
                Earning
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>Basic Salary</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.basicSalary || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>HRA</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.hra || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>DA</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.da || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Special Allowance
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.specialAllowance || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Conveyance Allowance
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.conveyanceAllowance || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Medical Allowance
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.medicalAllowance || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>Bonus</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.bonus || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                borderBottom: "2px solid #bbe4c8",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>OverTime</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.overtimePay || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                borderBottom: "2px solid #bbe4c8",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>Gross Salary</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.grossSalary || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                fontWeight: "semibold",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Net Take Home Pay
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.netSalary || "NA"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: "10px 0" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "semibold",
                borderLeft: "3px solid #e5291a",
                paddingLeft: "10px",
              }}
            >
              Deductions (B)
            </Text>
            <Text
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "#e5291a",
                transform: "rotate(45deg)",
                margin: "0 4px 0 4px",
              }}
            />
            <Text
              style={{
                fontSize: "9px",
                color: "#767473",
                letterSpacing: "0.25px",
              }}
            >
              The amount deducted for taxes and other benefits
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              fontSize: "10px",
              margin: "10px 0 0px 10px",
              backgroundColor: "#ffe3e3",
              borderRadius: "2px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                borderBottom: "2px solid #e4bfbf",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                  fontWeight: "semibold",
                }}
              >
                Deductions
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontWeight: "semibold",
                }}
              >
                Amount
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>PF Employee</Text>

              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.pfEmployee}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>ESI Employee</Text>

              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.esiEmployee}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>TDS</Text>

              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.tds}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Professional Tax
              </Text>

              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.professionalTax || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>Loan Deduction</Text>

              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.loanDeduction || "NA"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                borderBottom: "2px solid #e4bfbf",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Other Deductions
              </Text>

              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.otherDeductions}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                fontWeight: "semibold",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Total Deductions
              </Text>

              <Text style={{ flex: 1, textAlign: "right" }}>
                {salaryData?.totalDeductions}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            fontSize: "10px",
            padding: "12px",
            marginTop: "16px",
            border: "2px solid #a6a7ab",
            borderRadius: "4px",
          }}
        >
          <Text
            style={{
              fontWeight: "semibold",
              fontSize: "12px",
              marginBottom: "8px",
              paddingBottom: "4px",
              textDecoration: "underline",
            }}
          >
            Attendance & Leave
          </Text>
          <View style={{ marginLeft: "12px" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "4px 0",
              }}
            >
              <Text>Present Days : </Text>
              <Text> 31 days</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "4px 0",
              }}
            >
              <Text>Total Days : </Text>
              <Text>31 days</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "4px 0",
              }}
            >
              <Text>Absent Days : </Text>
              <Text> 00 days</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "4px 0",
              }}
            >
              <Text>Overtime Hours : </Text>
              <Text>NA</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: "10px 0" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "semibold",
                borderLeft: "3px solid #605dff",
                paddingLeft: "10px",
              }}
            >
              Yearly Taxable Income(C)
            </Text>
            <Text
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "#605dff",
                transform: "rotate(45deg)",
                margin: "0 4px 0 4px",
              }}
            />
            <Text
              style={{
                fontSize: "9px",
                color: "#767473",
                letterSpacing: "0.25px",
              }}
            >
              The amount deducted for taxes and other benefits
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              fontSize: "10px",
              margin: "10px 0 0px 10px",
              backgroundColor: "#f0edff",
              borderRadius: "2px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                borderBottom: "2px solid #c1bcd9",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                  fontWeight: "semibold",
                }}
              >
                Description
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "semibold",
                }}
              >
                Gross
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "semibold",
                }}
              >
                Exempted
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontWeight: "semibold",
                }}
              >
                Taxable
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Annual Taxable Salary{" "}
              </Text>
              <Text style={{ flex: 1, textAlign: "center" }}></Text>
              <Text style={{ flex: 1, textAlign: "center" }}></Text>
              <Text style={{ flex: 1, textAlign: "right" }}>5000</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: "10px 0" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "semibold",
                borderLeft: "3px solid #cd0065",
                paddingLeft: "10px",
              }}
            >
              Net Taxable Income(E)
            </Text>
            <Text
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "#cd0065",
                transform: "rotate(45deg)",
                margin: "0 4px 0 4px",
              }}
            />
            <Text
              style={{
                fontSize: "9px",
                color: "#767473",
                letterSpacing: "0.25px",
              }}
            >
              The amount deducted for taxes and other benefits
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              fontSize: "10px",
              margin: "10px 0 0px 10px",
              backgroundColor: "#ffe8f5",
              borderRadius: "2px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                borderBottom: "2px solid #ddc4d2",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                  fontWeight: "semibold",
                }}
              >
                Details
              </Text>

              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontWeight: "semibold",
                }}
              >
                Amount
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Annual Taxable salary
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Standard Deduction (Section 16)
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Net Taxable Income
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Tax To Be Deducted This Year
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: "10px 0" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "semibold",
                borderLeft: "3px solid #05a390",
                paddingLeft: "10px",
              }}
            >
              Tax for 2025 - 26
            </Text>
            <Text
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "#05a390",
                transform: "rotate(45deg)",
                margin: "0 4px 0 4px",
              }}
            />
            <Text
              style={{
                fontSize: "9px",
                color: "#767473",
                letterSpacing: "0.25px",
              }}
            >
              Tax will be deducted on this Net Taxable Salary after all
              exemptions
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              fontSize: "10px",
              margin: "10px 0 0px 10px",
              backgroundColor: "#e5fffc",
              borderRadius: "2px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
                borderBottom: "2px solid #c4d7d5",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                  fontWeight: "semibold",
                }}
              >
                Details
              </Text>

              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontWeight: "semibold",
                }}
              >
                Amount
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Tax on Taxable Income
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>Net Tax</Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Tax Deducted Till Date (Current Employer)
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Tax To Be Deducted This Year
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: "10px 0" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                borderLeft: "3px solid #a77500",
                paddingLeft: "10px",
                fontWeight: "semibold",
              }}
            >
              Tax for May 2025
            </Text>
            <Text
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "#a77500",
                transform: "rotate(45deg)",
                margin: "0 4px 0 4px",
              }}
            />
            <Text
              style={{
                fontSize: "9px",
                color: "#767473",
                letterSpacing: "0.25px",
              }}
            >
              Tax to be deducted (F) / No. of payroll executions left in this
              financial year
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              fontSize: "10px",
              margin: "10px 0 0px 10px",
              backgroundColor: "#fff9e9",
              borderRadius: "2px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                }}
              >
                Tax to be deducted this month
              </Text>

              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                }}
              >
                0
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text style={{ flex: 2, textAlign: "left" }}>
                Tax To Be Deducted This Year
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>0</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: "10px 0" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                fontWeight: "semibold",
                borderLeft: "3px solid #a53200",
                paddingLeft: "10px",
              }}
            >
              Monthly tax
            </Text>
            <Text
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "#a53200",
                transform: "rotate(45deg)",
                margin: "0 4px 0 4px",
              }}
            />
            <Text
              style={{
                fontSize: "9px",
                color: "#767473",
                letterSpacing: "0.25px",
              }}
            >
              Projected TDS for rest of the year are marked with *
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              fontSize: "10px",
              backgroundColor: "#f5e8e3",
              margin: "10px 0 4px 10px",
              borderRadius: "2px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                }}
              >
                April 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                May 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                June 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                July 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                August 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                September 2025
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                }}
              >
                April 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                May 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                June 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                July 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                August 2025
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                September 2025
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 6,
                paddingHorizontal: 8,
                width: "100%",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                0
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: "10px" }}>
            * These may change if there is a change in your income
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const PayslipPage = () => {
  const docRef = useRef(<PayslipDocument />);

  const handleDownload = async () => {
    const blob = await pdf(docRef.current).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payslip.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/generate-pdf`,
        {},
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.data || response.data.size === 0) {
        throw new Error("Received empty PDF data");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "generated.pdf";
      window.open(link.href, "_blank");

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      alert(
        `Failed to download PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6" style={{ height: "800px" }}>
        <PDFViewer width="100%" height="100%">
          <PayslipDocument />
        </PDFViewer>
      </div>

      <button
        onClick={handleDownload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
      >
        Download Payslip
      </button>
      <button
        onClick={downloadPDF}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer ms-5"
      >
        Download PDF
      </button>
    </div>
  );
};

export default PayslipPage;
