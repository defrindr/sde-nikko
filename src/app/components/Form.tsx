'use client';

import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';

interface Activity {
  id: number;
  name: string;
  icon: string;
}

interface Mood {
  id: number;
  name: string;
  description: string;
  icon: string;
  mood_type_id: number;
  date: string;
  activities: Activity[];
}
interface User {
  id: number;
  name: string;
  identifier: string | null;
  profile_photo_path: string;
  profile_photo_url: string;
}

interface UserMood {
  id: number;
  agileteknik_user_id: number;
  alias_name: string;
  moods: Mood[];
  student: User | null;
}

interface MoodResponse {
  data: UserMood[];
}

export default function Form() {
  // * State Variables
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<{
    start_date: string;
    end_date: string;
  }>({
    start_date: '',
    end_date: '',
  });
  const [userMoods, setUserMoods] = useState<UserMood[]>([]);
  // * End State Variables

  // * Effects
  useEffect(() => {
    // if fields empty, fill with current date
    if (Object.values(fields).every((field) => field === '')) {
      setFields({
        start_date: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(() => false);
      }, 5000);
    }
  }, [loading]);

  // * End Effects

  // * Functions
  const setDate = (field: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [field]: e.target.value });
  };

  const search = async () => {
    setLoading(() => true);
    try {
      const response = await fetch(
        `/api/mood?start_date=${fields.start_date}&end_date=${fields.end_date}`,
      );
      const json: MoodResponse = await response.json();
      setUserMoods(json.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message);
    }
  };
  // * End Functions

  // * Components
  const Field = ({ name }: { name: keyof typeof fields }) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={name} className="font-bold">
          {name.charAt(0).toUpperCase() + name.slice(1).split('_').join(' ')}
        </label>
        <input
          type="date"
          name={name}
          className="rounded-sm bg-[#EAEAEA] px-2 py-1 text-[#000]"
          onChange={setDate(name)}
          value={fields[name]}
        />
      </div>
    );
  };
  const TableMood = ({ userMoods }: { userMoods: UserMood[] }) => {
    return (
      <table className="border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="p-2 text-center font-bold">Tanggal</th>
            <th className="p-2 text-center font-bold">NRP/NIP</th>
            <th className="p-2 text-center font-bold">User</th>
            <th className="p-2 text-center font-bold">Mood</th>
            <th className="p-2 text-center font-bold">Deskripsi</th>
            <th className="p-2 text-center font-bold">Aktivitas</th>
          </tr>
        </thead>
        <tbody>
          {userMoods.map((userMood, index) => (
            <Fragment key={index}>
              {userMood.moods.length > 0 &&
                userMood.moods.map((mood, indexMood) => (
                  <tr key={indexMood} className="border-b-2">
                    <td className="p-2">{moment(mood.date).format('DD MMM')}</td>
                    <td className="p-2">{userMood.student ? userMood.student.identifier : '-'}</td>
                    <td className="p-2">
                      {userMood.student ? userMood.student.name : userMood.alias_name}
                    </td>
                    <td className="p-2">{mood.name}</td>
                    <td className="p-2">{mood.description}</td>
                    <td className="p-2">
                      <ul className="list-disc pl-4">
                        {mood.activities.map((activity) => (
                          <li key={activity.id}>{activity.name}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // * End Components

  return (
    <>
      <div className="my-3 flex flex-col gap-4 md:flex-row">
        <Field name="start_date" />
        <Field name="end_date" />
      </div>
      <button
        disabled={loading}
        onClick={search}
        className="rounded-lg bg-[#EAEAEA] px-3 py-1 text-[#000] disabled:bg-[#555]"
      >
        Search
      </button>

      {userMoods.length > 0 && (
        <div className="w-full overflow-x-auto pt-5">
          <TableMood userMoods={userMoods} />
        </div>
      )}
    </>
  );
}
