"use client";

import { Filter } from "lucide-react";


import { getDailyOmzet } from "@/app/lib/branch/data_penjualan";
import { useEffect, useState } from "react";
import FormatRupiah from "@/app/lib/helper";


const percentages = {
  dividen: 2,
  owner: 2,
  bea: 2,
  bsa: 5,
  bma: 20,
  ps: 10,
  pi: 5,
  em: 1,
  hpp: 15,
  op: 10,
  advert: 22,
  event: 2,
  busdel: 2,
  cs: 2,
};

const data = [
  {
    date: "08-Jun",
    omzet: 120000,
  },
  {
    date: "09-Jun",
    omzet: 430000,
  },
  {
    date: "10-Jun",
    omzet: 370000,
  },
];

export default function PayoutTable() {
  const calculate = (omzet: number, percent: number) => {
    return (omzet * percent) / 100;
  };

  const [omzet, setOmzet] = useState<any[]>([]);
  useEffect(() => {
    async function loadOmzet() {
      try {
        const result = await getDailyOmzet();
        if (result) {
          setOmzet(result);
        }
      } catch (error) {
        console.error("Failed to load omzet:", error);
      }
    }
    loadOmzet();
  }, [])

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Table Toolbar controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
          <Filter size={18} className="text-[#312e81]" />
          Presentation Pay Out Server Report
        </h3>
      </div>

      {/* Sales Table element */}
      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm ">
          <thead>
            <tr className="bg-gray-50">
              <th rowSpan={2} className="border p-2">
                Hari / Tgl
              </th>

              <th rowSpan={2} className="border p-2">
                Omset
              </th>

              <th colSpan={8} className="border p-2">
                Return On Investment (ROI)
              </th>

              <th rowSpan={2} className="border p-2">
                HPP 15%
              </th>

              <th rowSpan={2} className="border p-2">
                OP 10%
              </th>

              <th rowSpan={2} className="border p-2">
                Advert 22%
              </th>

              <th rowSpan={2} className="border p-2">
                Event 2%
              </th>

              <th rowSpan={2} className="border p-2">
                Busdev 2%
              </th>

              <th rowSpan={2} className="border p-2">
                CS 2%
              </th>
            </tr>

            <tr className="bg-gray-50">
              <th className="border p-2">Dividen</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">BEA</th>
              <th className="border p-2">BSA</th>
              <th className="border p-2">BMA</th>
              <th className="border p-2">PS</th>
              <th className="border p-2">PI</th>
              <th className="border p-2">EM</th>
            </tr>
          </thead>

          <tbody>
            {omzet.map((row) => (
              <tr key={row.date}>
                <td className="border p-2">{row.date.toLocaleDateString("id-ID",{day:"numeric",month:"short"})}</td>

                <td className="border p-2">
                  {FormatRupiah(row.omzet)}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.dividen).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.owner).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.bea).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.bsa).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.bma).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.ps).toLocaleString("id-ID")}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.pi).toLocaleString("id-ID")}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.em).toLocaleString("id-ID")}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.hpp).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.op).toLocaleString("id-ID")}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.advert).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.event).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.busdel).toLocaleString(
                    "id-ID",
                  )}
                </td>

                <td className="border p-2">
                  {calculate(row.omzet, percentages.cs).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
