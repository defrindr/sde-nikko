import moment from 'moment';
import { NextRequest } from 'next/server';
import { config } from '~/app/config';
import { students } from '~/app/api/mood/students';
export const revalidate = 60;

const fetchMoodsByDate = async (startDate: string, endDate: string) => {
  const URL = `https://staging-api-health2023.agileteknik.com/api/agileteknik/moods/niko-calendar?start_date=${startDate}&end_date=${endDate}`;
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('x-agileteknik-moodtracker-token', config.agileMoodToken);

  const data = await fetch(URL, {
    headers: requestHeaders,
  });

  const moods = await data.json();

  return moods;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mappingAgileUsers = (moodPerUsers: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return moodPerUsers.map((user: any) => {
    const selectedStudents = students.filter((student) => student.id === user.agileteknik_user_id);
    user.student = selectedStudents.length > 0 ? selectedStudents[0] : null;

    return user;
  });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate =
    searchParams.get('start_date') ?? moment().subtract(1, 'day').format('YYYY-MM-DD');
  const endDate = searchParams.get('end_date') ?? moment().format('YYYY-MM-DD');

  const moodPerUsers = await fetchMoodsByDate(startDate, endDate);
  const mergeWithAgileUser = mappingAgileUsers(moodPerUsers.data);

  return Response.json({ data: mergeWithAgileUser });
}
