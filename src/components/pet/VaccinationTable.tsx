import React, { useState } from 'react';
import type { Vaccine } from '@/lib/types';

interface Props {
  vaccines: Vaccine[];
  editable: boolean;
  onChange: (vaccines: Vaccine[]) => void;
}

export default function VaccinationTable({ vaccines, editable, onChange }: Props) {
  const [internalVaccines, setInternalVaccines] = useState<Vaccine[]>(vaccines);

  React.useEffect(() => {
    if (!editable) {
      setInternalVaccines(vaccines);
    }
  }, [vaccines, editable]);

  const handleChange = (updated: Vaccine[]) => {
    setInternalVaccines(updated);
    onChange(updated);
  };

  const handleInputChange = (
    index: number,
    field: keyof Vaccine,
    value: string
  ) => {
    setInternalVaccines(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };
      return newList;
    });
  };

  const handleDateChange = (
    index: number,
    field: keyof Vaccine,
    value: string
  ) => {
    setInternalVaccines(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value as any };
      return newList;
    });
  };

  const handleDelete = (index: number) => {
    setInternalVaccines(prev => {
      const newList = [...prev];
      newList.splice(index, 1);
      return newList;
    });
    onChange([...internalVaccines].filter((_, i) => i !== index));
  };

  const handleAddVaccine = () => {
    const newVaccine: Vaccine = {
      name: '',
      vaccinationDate: '',
      reminderDate: '',
      vetName: '',
    };
    setInternalVaccines(prev => [...prev, newVaccine]);
    onChange([...internalVaccines, newVaccine]);
  };

  const renderTable = () => {
    if (internalVaccines.length === 0 && !editable) {
      return (
        <tbody>
          <tr>
            <td colSpan="4" className="px-4 py-3 text-center text-neutral-400">
              هیچ واکسنی ثبت نشده است
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {internalVaccines.map((vaccine, idx) => {
          if (editable) {
            return (
              <tr key={idx} className="border-t border-neutral-200">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={vaccine.name}
                    onChange={e => handleInputChange(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="نام واکسن"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={vaccine.vaccinationDate}
                    onChange={e => handleDateChange(idx, 'vaccinationDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={vaccine.reminderDate}
                    onChange={e => handleDateChange(idx, 'reminderDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={vaccine.vetName}
                    onChange={e => handleInputChange(idx, 'vetName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="نام پزشک"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(idx)}
                    className="inline-flex items-center justify-center gap-2 bg-transparent text-danger font-medium text-base px-4 py-2.5 rounded-lg border border-danger hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            );
          } else {
            return (
              <tr key={idx} className="border-t border-neutral-200">
                <td className="px-4 py-3 text-sm text-neutral-800">{vaccine.name}</td>
                <td className="px-4 py-3 text-sm text-neutral-800">{vaccine.vaccinationDate}</td>
                <td className="px-4 py-3 text-sm text-neutral-800">{vaccine.reminderDate}</td>
                <td className="px-4 py-3 text-sm text-neutral-800">{vaccine.vetName}</td>
              </tr>
            );
          }
        })}
      </tbody>
    );
  };

  return (
    <div dir="rtl" className="w-full">
      <table className="w-full bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-neutral-50 text-xs font-medium text-neutral-600">
            <th className="px-4 py-3">نام واکسن</th>
            <th className="px-4 py-3">تاریخ تزریق</th>
            <th className="px-4 py-3">تاریخ یادآوری</th>
            <th className="px-4 py-3">پزشک</th>
            {editable && <th className="px-4 py-3"></th>}
          </tr>
        </thead>
        {renderTable()}
      </table>
      {editable && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddVaccine}
            className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            + افزودن واکسن
          </button>
        </div>
      )}
    </div>
  );
}
